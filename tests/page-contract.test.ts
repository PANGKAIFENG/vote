import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("survey page UI contract", () => {
  const pageSource = readFileSync("src/app/page.tsx", "utf8");

  it("does not expose CSV export actions on the public survey page", () => {
    expect(pageSource).not.toContain("导出汇总 CSV");
    expect(pageSource).not.toContain("导出明细 CSV");
    expect(pageSource).not.toContain("handleCsvExport");
  });

  it("uses the uploaded ODM direction image instead of the old stage cards", () => {
    expect(pageSource).toContain("odm建设方向.png");
    expect(pageSource).not.toContain("DIRECTION_STAGES.map");
  });

  it("uses the desktop score matrix at common laptop widths", () => {
    expect(pageSource).toContain("hidden overflow-x-auto lg:block");
    expect(pageSource).toContain("space-y-4 lg:hidden");
  });

  it("keeps the desktop score matrix header aligned to the rating columns", () => {
    expect(pageSource).toContain(
      'className={clsx("grid bg-slate-100 text-xs font-semibold text-slate-600", GRID_COLUMNS_CLASS)}'
    );
    expect(pageSource).toContain('className={clsx("grid bg-white", GRID_COLUMNS_CLASS)}');
  });

  it("keeps supplemental agent details visual instead of dense text lists", () => {
    expect(pageSource).toContain("AgentWorkflowFlow");
    expect(pageSource).not.toContain("list-decimal");
  });

  it("keeps rating controls large enough in compact layouts", () => {
    expect(pageSource).not.toContain("h-9 rounded-md border");
    expect(pageSource).toContain("min-h-10 rounded-md border");
  });
});
