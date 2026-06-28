import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Meoo DB client configuration", () => {
  const generatedClient = readFileSync("src/supabase/client.ts", "utf8");
  const storageSource = readFileSync("src/lib/meoo-db-storage.ts", "utf8");

  it("uses the Meoo generated Supabase proxy path", () => {
    expect(generatedClient).toContain("MEOO_CONFIG?.meoo_app_access_url");
    expect(generatedClient).toContain("window.location.origin");
    expect(generatedClient).toContain("/sb-api");
  });

  it("does not require a service role key in frontend code", () => {
    expect(generatedClient).toContain("supabaseAnonKey");
    expect(generatedClient).not.toContain("SERVICE_ROLE");
  });

  it("does not insert the retired result usability score placeholder", () => {
    expect(storageSource).not.toContain("result_usability_score: 0");
  });
});
