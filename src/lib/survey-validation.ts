import { z } from "zod";
import { AGENT_IDS } from "./survey-data";
import type {
  AgentId,
  AgentScoreDraft,
  SurveyDraft,
  SurveySubmission,
  ValidationResult
} from "./survey-types";

const agentValues = AGENT_IDS as unknown as [AgentId, ...AgentId[]];

const ratingSchema = z
  .number({
    required_error: "请选择 1-5 分。",
    invalid_type_error: "请选择 1-5 分。"
  })
  .int()
  .min(1, "请选择 1-5 分。")
  .max(5, "请选择 1-5 分。");

const agentScoreSchema = z.object({
  purchaseOrUpsell: ratingSchema,
  pain: ratingSchema,
  coverage: ratingSchema,
  frequency: ratingSchema,
  resultUsability: ratingSchema,
  customerExample: z.string().trim().optional().default(""),
  mostImportantStep: z.string().trim().optional().default(""),
  paidReason: z.string().trim().optional()
});

const suggestionRequiredFields = [
  ["agentName", "有新增 Agent 建议时请填写新增 Agent 名称。"],
  ["businessScene", "有新增 Agent 建议时请填写服务业务场景。"],
  ["targetUser", "有新增 Agent 建议时请填写谁来使用。"],
  ["inputMaterials", "有新增 Agent 建议时请填写输入资料。"],
  ["expectedOutput", "有新增 Agent 建议时请填写希望输出的结果。"],
  ["whyCustomerPay", "有新增 Agent 建议时请填写客户愿意使用或付费的原因。"]
] as const;

const surveySchema = z
  .object({
    respondent: z.object({
      name: z.string().trim().min(1, "请填写姓名。")
    }),
    scores: z.object(
      Object.fromEntries(AGENT_IDS.map((agentId) => [agentId, agentScoreSchema])) as Record<
        AgentId,
        typeof agentScoreSchema
      >
    ),
    ranking: z.object({
      rank1: z.enum(agentValues, { required_error: "请选择第一优先级。" }),
      rank2: z.enum(agentValues, { required_error: "请选择第二优先级。" }),
      rank3: z.enum(agentValues, { required_error: "请选择第三优先级。" }),
      reason: z.string().trim().optional().default("")
    }),
    suggestion: z.object({
      hasSuggestion: z.boolean({
        required_error: "请选择是否有新增 Agent 建议。",
        invalid_type_error: "请选择是否有新增 Agent 建议。"
      }),
      agentName: z.string().trim().optional(),
      businessScene: z.string().trim().optional(),
      targetUser: z.string().trim().optional(),
      inputMaterials: z.string().trim().optional(),
      expectedOutput: z.string().trim().optional(),
      whyCustomerPay: z.string().trim().optional()
    })
  })
  .superRefine((value, context) => {
    const ranks = [value.ranking.rank1, value.ranking.rank2, value.ranking.rank3];
    if (new Set(ranks).size !== ranks.length) {
      for (const rankKey of ["rank1", "rank2", "rank3"] as const) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ranking", rankKey],
          message: "三个优先级不能选择同一个 Agent，请重新选择。"
        });
      }
    }

    if (value.suggestion.hasSuggestion) {
      for (const [fieldName, message] of suggestionRequiredFields) {
        if (!value.suggestion[fieldName]?.trim()) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["suggestion", fieldName],
            message
          });
        }
      }
    }
  });

export function buildEmptySurveyDraft(): SurveyDraft {
  const emptyScore: AgentScoreDraft = {
    purchaseOrUpsell: null,
    pain: null,
    coverage: null,
    frequency: null,
    resultUsability: null,
    customerExample: "",
    mostImportantStep: "",
    paidReason: ""
  };

  return {
    respondent: {
      name: ""
    },
    scores: Object.fromEntries(AGENT_IDS.map((agentId) => [agentId, { ...emptyScore }])) as Record<
      AgentId,
      AgentScoreDraft
    >,
    ranking: {
      rank1: "",
      rank2: "",
      rank3: "",
      reason: ""
    },
    suggestion: {
      hasSuggestion: null,
      agentName: "",
      businessScene: "",
      targetUser: "",
      inputMaterials: "",
      expectedOutput: "",
      whyCustomerPay: ""
    }
  };
}

export function validateSurveySubmission(draft: unknown): ValidationResult {
  const parsed = surveySchema.safeParse(normalizeBlankValues(draft));

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: flattenZodErrors(parsed.error)
    };
  }

  return {
    success: true,
    fieldErrors: {},
    data: parsed.data as SurveySubmission
  };
}

function normalizeBlankValues(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value;
  }

  return JSON.parse(
    JSON.stringify(value, (_key, item) => {
      if (item === "") {
        return undefined;
      }

      return item;
    })
  );
}

function flattenZodErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".");
    const key = path || "form";
    fieldErrors[key] = fieldErrors[key] ?? [];
    fieldErrors[key].push(issue.message);
  }

  return fieldErrors;
}
