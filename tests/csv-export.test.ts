import { describe, expect, it } from "vitest";
import { buildAgentSummaryCsv } from "@/lib/csv-export";
import type { StoredSurveySubmission } from "@/lib/survey-types";

describe("buildAgentSummaryCsv", () => {
  it("exports weighted survey metrics and Top ranking counts as CSV", () => {
    const submissions: StoredSurveySubmission[] = [
      {
        id: "sub_1",
        createdAt: "2026-06-24T08:00:00.000Z",
        respondent: {
          name: "陈明"
        },
        scores: {
          email_outreach: {
            purchaseOrUpsell: 5,
            pain: 5,
            coverage: 4,
            frequency: 4,
            resultUsability: 5,
            customerExample: "A 客户",
            mostImportantStep: "首封开发信"
          },
          marketing_acquisition: {
            purchaseOrUpsell: 3,
            pain: 3,
            coverage: 3,
            frequency: 3,
            resultUsability: 3,
            customerExample: "",
            mostImportantStep: ""
          },
          customer_development: {
            purchaseOrUpsell: 4,
            pain: 4,
            coverage: 4,
            frequency: 4,
            resultUsability: 4,
            customerExample: "",
            mostImportantStep: ""
          },
          trend_analysis: {
            purchaseOrUpsell: 2,
            pain: 3,
            coverage: 2,
            frequency: 2,
            resultUsability: 3,
            customerExample: "",
            mostImportantStep: ""
          },
          style_asset_governance: {
            purchaseOrUpsell: 1,
            pain: 2,
            coverage: 2,
            frequency: 1,
            resultUsability: 2,
            customerExample: "",
            mostImportantStep: ""
          }
        },
        ranking: {
          rank1: "email_outreach",
          rank2: "customer_development",
          rank3: "marketing_acquisition",
          reason: "获客最直接"
        },
        suggestion: {
          hasSuggestion: false
        }
      }
    ];

    const csv = buildAgentSummaryCsv(submissions);

    expect(csv.split("\n")[0]).toBe(
      "agent_id,agent_name,purchase_or_upsell_avg,pain_avg,coverage_avg,frequency_avg,result_usability_avg,total_avg,weighted_total,top1_count,top3_count,response_count"
    );
    expect(csv).toContain(
      "email_outreach,邮件拓新 Agent,5.00,5.00,4.00,4.00,5.00,4.60,4.70,1,1,1"
    );
  });
});
