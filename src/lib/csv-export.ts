import { AGENT_IDS, AGENTS } from "./survey-data";
import type { AgentId, StoredSurveySubmission } from "./survey-types";

const HEADER = [
  "agent_id",
  "agent_name",
  "purchase_or_upsell_avg",
  "pain_avg",
  "coverage_avg",
  "frequency_avg",
  "total_avg",
  "weighted_total",
  "top1_count",
  "top3_count",
  "response_count"
];

export function buildAgentSummaryCsv(submissions: StoredSurveySubmission[]): string {
  const rows = AGENT_IDS.map((agentId) => {
    const scores = submissions
      .map((submission) => submission.scores[agentId])
      .filter(Boolean);
    const responseCount = scores.length;
    const purchaseOrUpsellAvg = average(scores.map((score) => score.purchaseOrUpsell));
    const painAvg = average(scores.map((score) => score.pain));
    const coverageAvg = average(scores.map((score) => score.coverage));
    const frequencyAvg = average(scores.map((score) => score.frequency));
    const totalAvg = average([
      purchaseOrUpsellAvg,
      painAvg,
      coverageAvg,
      frequencyAvg
    ]);
    const weightedTotal =
      purchaseOrUpsellAvg * 0.35 +
      painAvg * 0.25 +
      coverageAvg * 0.2 +
      frequencyAvg * 0.2;

    return [
      agentId,
      AGENTS[agentId].name,
      formatNumber(purchaseOrUpsellAvg),
      formatNumber(painAvg),
      formatNumber(coverageAvg),
      formatNumber(frequencyAvg),
      formatNumber(totalAvg),
      formatNumber(weightedTotal),
      countTop1(submissions, agentId),
      countTop3(submissions, agentId),
      responseCount
    ];
  });

  return [HEADER, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

export function buildRawSubmissionsCsv(submissions: StoredSurveySubmission[]): string {
  const header = [
    "submission_id",
    "created_at",
    "name",
    "rank_1",
    "rank_2",
    "rank_3",
    "ranking_reason",
    "has_new_agent_suggestion",
    "new_agent_name",
    "new_agent_scene",
    "new_agent_target_user",
    "new_agent_input_materials",
    "new_agent_expected_output",
    "new_agent_why_pay"
  ];

  const rows = submissions.map((submission) => [
    submission.id,
    submission.createdAt,
    submission.respondent.name,
    submission.ranking.rank1,
    submission.ranking.rank2,
    submission.ranking.rank3,
    submission.ranking.reason,
    String(submission.suggestion.hasSuggestion),
    submission.suggestion.agentName ?? "",
    submission.suggestion.businessScene ?? "",
    submission.suggestion.targetUser ?? "",
    submission.suggestion.inputMaterials ?? "",
    submission.suggestion.expectedOutput ?? "",
    submission.suggestion.whyCustomerPay ?? ""
  ]);

  return [header, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function countTop1(submissions: StoredSurveySubmission[], agentId: AgentId): number {
  return submissions.filter((submission) => submission.ranking.rank1 === agentId).length;
}

function countTop3(submissions: StoredSurveySubmission[], agentId: AgentId): number {
  return submissions.filter((submission) =>
    [submission.ranking.rank1, submission.ranking.rank2, submission.ranking.rank3].includes(agentId)
  ).length;
}

function formatNumber(value: number): string {
  return value.toFixed(2);
}

function escapeCsvCell(value: unknown): string {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}
