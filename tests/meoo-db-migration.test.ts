import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Meoo DB migration", () => {
  const migration = readFileSync("migrations/001_create_odm_survey.sql", "utf8");

  it("enables row level security on every survey table", () => {
    for (const tableName of [
      "respondents",
      "agent_scores",
      "rankings",
      "new_agent_suggestions"
    ]) {
      expect(migration).toContain(`alter table ${tableName} enable row level security`);
    }
  });

  it("allows anonymous respondents to submit and read survey rows", () => {
    expect(migration).toContain("create policy respondents_anon_insert");
    expect(migration).toContain("create policy agent_scores_anon_insert");
    expect(migration).toContain("create policy rankings_anon_insert");
    expect(migration).toContain("create policy new_agent_suggestions_anon_insert");
    expect(migration).toContain("create policy respondents_anon_select");
    expect(migration).toContain("create policy agent_scores_anon_select");
    expect(migration).toContain("create policy rankings_anon_select");
    expect(migration).toContain("create policy new_agent_suggestions_anon_select");
  });
});
