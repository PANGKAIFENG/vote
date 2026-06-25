export type AgentId =
  | "email_outreach"
  | "marketing_acquisition"
  | "customer_development"
  | "trend_analysis"
  | "style_asset_governance";

export type Role =
  | "sales"
  | "solution"
  | "customer_success"
  | "business_owner"
  | "product_ops"
  | "other";

export type CustomerType =
  | "large_odm"
  | "small_mid_odm"
  | "export_odm"
  | "design_odm"
  | "other";

export type ScoreKey =
  | "purchaseOrUpsell"
  | "pain"
  | "coverage"
  | "frequency";

export interface RatingField {
  key: ScoreKey;
  label: string;
  question: string;
}

export interface SelectOption<TValue extends string> {
  value: TValue;
  label: string;
}

export type RoleOption = SelectOption<Role>;
export type CustomerTypeOption = SelectOption<CustomerType>;

export interface AgentDefinition {
  id: AgentId;
  name: string;
  shortName: string;
  tagline: string;
  scene: string;
  workflow: string[];
  keywords: string[];
}

export interface RespondentDraft {
  name: string;
}

export interface AgentScoreDraft {
  purchaseOrUpsell: number | null;
  pain: number | null;
  coverage: number | null;
  frequency: number | null;
  customerExample: string;
  mostImportantStep: string;
  paidReason?: string;
}

export interface RankingDraft {
  rank1: AgentId | "";
  rank2: AgentId | "";
  rank3: AgentId | "";
  reason: string;
}

export interface NewAgentSuggestionDraft {
  hasSuggestion: boolean | null;
  agentName?: string;
  businessScene?: string;
  targetUser?: string;
  inputMaterials?: string;
  expectedOutput?: string;
  whyCustomerPay?: string;
}

export interface SurveyDraft {
  respondent: RespondentDraft;
  scores: Record<AgentId, AgentScoreDraft>;
  ranking: RankingDraft;
  suggestion: NewAgentSuggestionDraft;
}

export interface ValidRespondent {
  name: string;
}

export interface ValidAgentScore {
  purchaseOrUpsell: number;
  pain: number;
  coverage: number;
  frequency: number;
  customerExample: string;
  mostImportantStep: string;
  paidReason?: string;
}

export interface ValidRanking {
  rank1: AgentId;
  rank2: AgentId;
  rank3: AgentId;
  reason: string;
}

export interface ValidNewAgentSuggestion {
  hasSuggestion: boolean;
  agentName?: string;
  businessScene?: string;
  targetUser?: string;
  inputMaterials?: string;
  expectedOutput?: string;
  whyCustomerPay?: string;
}

export interface SurveySubmission {
  respondent: ValidRespondent;
  scores: Record<AgentId, ValidAgentScore>;
  ranking: ValidRanking;
  suggestion: ValidNewAgentSuggestion;
}

export interface StoredSurveySubmission extends SurveySubmission {
  id: string;
  createdAt: string;
}

export interface ValidationResult {
  success: boolean;
  fieldErrors: Record<string, string[]>;
  data?: SurveySubmission;
}
