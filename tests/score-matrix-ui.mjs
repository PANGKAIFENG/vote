import assert from "node:assert/strict";
import { chromium } from "playwright";
import { createServer } from "vite";

const fields = ["成单 / 增购帮助", "客户痛点强度", "适用客户范围", "使用频次"];

function edgeDelta(a, b, edge) {
  return Math.abs(a[edge] - b[edge]);
}

async function rect(locator, target) {
  return locator.evaluate(
    (node, targetName) => {
      const element =
        targetName === "parent"
          ? node.parentElement
          : node.closest("div.border-l");
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom,
        width: box.width,
        height: box.height
      };
    },
    target
  );
}

const server = await createServer({
  logLevel: "error",
  server: {
    host: "127.0.0.1",
    port: 0,
    strictPort: false
  }
});

let browser;

try {
  await server.listen();
  const localUrl = server.resolvedUrls?.local[0];
  assert.ok(localUrl, "Vite server did not expose a local URL");

  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1365, height: 768 } });

  await page.goto(localUrl, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "候选 Agent 评分" }).scrollIntoViewIfNeeded();

  const section = page.locator("section", {
    has: page.getByRole("heading", { name: "候选 Agent 评分" })
  });
  const desktopMatrix = section.locator("[data-score-matrix-desktop]");

  for (const field of fields) {
    const headerRect = await rect(desktopMatrix.locator("span", { hasText: field }).first(), "parent");
    const scoreRect = await rect(desktopMatrix.getByLabel(`邮件拓新 ${field} 1 分`), "score-cell");

    assert.ok(
      edgeDelta(headerRect, scoreRect, "left") <= 2 && edgeDelta(headerRect, scoreRect, "right") <= 2,
      `${field} header is not aligned with its score column`
    );
  }

  await desktopMatrix.locator("[data-score-tooltip-trigger]").first().hover();
  await page.waitForTimeout(150);

  const tooltipState = await desktopMatrix.locator("[data-score-tooltip]").first().evaluate((tooltip) => {
    const table = tooltip.closest("[data-score-matrix-table]");
    const tooltipRect = tooltip.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();
    const style = tooltip.ownerDocument.defaultView.getComputedStyle(tooltip);

    return {
      opacity: style.opacity,
      text: tooltip.textContent?.trim() ?? "",
      tooltipTop: tooltipRect.top,
      tooltipBottom: tooltipRect.bottom,
      tooltipWidth: tooltipRect.width,
      tooltipHeight: tooltipRect.height,
      tableTop: tableRect.top,
      tableBottom: tableRect.bottom
    };
  });

  assert.equal(tooltipState.opacity, "1", "tooltip should become visible on hover");
  assert.ok(tooltipState.text.length > 0, "tooltip should include explanatory text");
  assert.ok(tooltipState.tooltipWidth >= 180, "tooltip should render as a readable panel");
  assert.ok(tooltipState.tooltipHeight >= 32, "tooltip should not collapse into a thin bar");
  assert.ok(
    tooltipState.tooltipTop >= tooltipState.tableTop - 1,
    "tooltip should stay inside the table clipping area instead of being cut off above it"
  );
  assert.ok(
    tooltipState.tooltipBottom <= tooltipState.tableBottom + 1,
    "tooltip should stay inside the table clipping area instead of being cut off below it"
  );

  await page.screenshot({ path: "/tmp/score-matrix-ui-test.png", fullPage: true });
} finally {
  await browser?.close();
  await server.close();
}
