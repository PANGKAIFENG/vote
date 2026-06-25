import { describe, expect, it } from "vitest";
import {
  buildEmptySurveyDraft,
  validateSurveySubmission
} from "@/lib/survey-validation";

describe("validateSurveySubmission", () => {
  it("accepts a complete survey with unique Top 3 choices", () => {
    const draft = buildEmptySurveyDraft();
    draft.respondent.name = "陈明";
    draft.ranking.rank1 = "email_outreach";
    draft.ranking.rank2 = "customer_development";
    draft.ranking.rank3 = "trend_analysis";
    draft.suggestion.hasSuggestion = false;

    for (const score of Object.values(draft.scores)) {
      score.purchaseOrUpsell = 5;
      score.pain = 4;
      score.coverage = 4;
      score.frequency = 3;
      score.resultUsability = 4;
    }

    const result = validateSurveySubmission(draft);

    expect(result.success).toBe(true);
  });

  it("accepts a complete survey when the respondent only provides a name", () => {
    const draft = buildEmptySurveyDraft();
    draft.respondent.name = "陈明";
    draft.ranking.rank1 = "email_outreach";
    draft.ranking.rank2 = "customer_development";
    draft.ranking.rank3 = "trend_analysis";
    draft.suggestion.hasSuggestion = false;

    for (const score of Object.values(draft.scores)) {
      score.purchaseOrUpsell = 5;
      score.pain = 4;
      score.coverage = 4;
      score.frequency = 3;
      score.resultUsability = 4;
    }

    const result = validateSurveySubmission(draft);

    expect(result.success).toBe(true);
    expect(result.data?.respondent).toEqual({ name: "陈明" });
  });

  it("rejects repeated Top 3 choices with a field-level error", () => {
    const draft = buildEmptySurveyDraft();
    draft.respondent.name = "陈明";
    draft.ranking.rank1 = "email_outreach";
    draft.ranking.rank2 = "email_outreach";
    draft.ranking.rank3 = "trend_analysis";
    draft.suggestion.hasSuggestion = false;

    for (const score of Object.values(draft.scores)) {
      score.purchaseOrUpsell = 3;
      score.pain = 3;
      score.coverage = 3;
      score.frequency = 3;
      score.resultUsability = 3;
    }

    const result = validateSurveySubmission(draft);

    expect(result.success).toBe(false);
    expect(result.fieldErrors["ranking.rank2"]).toContain(
      "三个优先级不能选择同一个 Agent，请重新选择。"
    );
  });

  it("requires suggestion details only when the respondent has a new Agent idea", () => {
    const draft = buildEmptySurveyDraft();
    draft.respondent.name = "陈明";
    draft.ranking.rank1 = "email_outreach";
    draft.ranking.rank2 = "marketing_acquisition";
    draft.ranking.rank3 = "style_asset_governance";
    draft.suggestion.hasSuggestion = true;

    for (const score of Object.values(draft.scores)) {
      score.purchaseOrUpsell = 4;
      score.pain = 4;
      score.coverage = 4;
      score.frequency = 4;
      score.resultUsability = 4;
    }

    const result = validateSurveySubmission(draft);

    expect(result.success).toBe(false);
    expect(result.fieldErrors["suggestion.agentName"]).toContain(
      "有新增 Agent 建议时请填写新增 Agent 名称。"
    );
  });
});
