import { supabase } from "@/supabase/client";
import type { AgentId, StoredSurveySubmission, SurveySubmission } from "./survey-types";

export async function saveSubmissionToMeooDb(
  submission: SurveySubmission
): Promise<StoredSurveySubmission> {
  console.log("[Survey] Starting submission save, respondent name:", submission.respondent.name);

  const { data: respondent, error: respondentError } = await supabase
    .from("respondents")
    .insert({
      name: submission.respondent.name,
      department: "",
      role: "other",
      customer_types: [],
      willing_to_interview: null
    })
    .select("id, created_at")
    .single();

  if (respondentError) {
    console.error("[Survey] Respondent insert error:", respondentError);
    throw respondentError;
  }

  console.log("[Survey] Respondent saved, id:", respondent.id);

  const respondentId = respondent.id;
  const createdAt = respondent.created_at;
  const scoreRows = Object.entries(submission.scores).map(([agentId, score]) => ({
    respondent_id: respondentId,
    agent_id: agentId,
    purchase_or_upsell_score: score.purchaseOrUpsell,
    pain_score: score.pain,
    coverage_score: score.coverage,
    frequency_score: score.frequency,
    result_usability_score: score.resultUsability,
    customer_example: score.customerExample,
    most_important_step: score.mostImportantStep,
    paid_reason: score.paidReason ?? ""
  }));

  const { error: scoresError } = await supabase.from("agent_scores").insert(scoreRows);
  if (scoresError) {
    console.error("[Survey] Agent scores insert error:", scoresError);
    throw scoresError;
  }

  console.log("[Survey] Agent scores saved, count:", scoreRows.length);

  const { error: rankingError } = await supabase.from("rankings").insert({
    respondent_id: respondentId,
    rank_1_agent_id: submission.ranking.rank1,
    rank_2_agent_id: submission.ranking.rank2,
    rank_3_agent_id: submission.ranking.rank3,
    ranking_reason: submission.ranking.reason
  });

  if (rankingError) {
    console.error("[Survey] Ranking insert error:", rankingError);
    throw rankingError;
  }

  console.log("[Survey] Ranking saved");

  const { error: suggestionError } = await supabase.from("new_agent_suggestions").insert({
    respondent_id: respondentId,
    has_suggestion: submission.suggestion.hasSuggestion,
    agent_name: submission.suggestion.agentName ?? "",
    business_scene: submission.suggestion.businessScene ?? "",
    target_user: submission.suggestion.targetUser ?? "",
    input_materials: submission.suggestion.inputMaterials ?? "",
    expected_output: submission.suggestion.expectedOutput ?? "",
    why_customer_pay: submission.suggestion.whyCustomerPay ?? ""
  });

  if (suggestionError) {
    console.error("[Survey] Suggestion insert error:", suggestionError);
    throw suggestionError;
  }

  console.log("[Survey] Suggestion saved, all done");

  return {
    ...submission,
    id: respondentId,
    createdAt
  };
}

export async function readSubmissionsFromMeooDb(): Promise<StoredSurveySubmission[]> {
  const { data, error } = await supabase
    .from("respondents")
    .select(
      `
      id,
      created_at,
      name,
      department,
      role,
      customer_types,
      willing_to_interview,
      agent_scores (
        agent_id,
        purchase_or_upsell_score,
        pain_score,
        coverage_score,
        frequency_score,
        result_usability_score,
        customer_example,
        most_important_step,
        paid_reason
      ),
      rankings (
        rank_1_agent_id,
        rank_2_agent_id,
        rank_3_agent_id,
        ranking_reason
      ),
      new_agent_suggestions (
        has_suggestion,
        agent_name,
        business_scene,
        target_user,
        input_materials,
        expected_output,
        why_customer_pay
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => {
    const scores = Object.fromEntries(
      (row.agent_scores ?? []).map((score) => [
        score.agent_id as AgentId,
        {
          purchaseOrUpsell: score.purchase_or_upsell_score,
          pain: score.pain_score,
          coverage: score.coverage_score,
          frequency: score.frequency_score,
          resultUsability: score.result_usability_score,
          customerExample: score.customer_example ?? "",
          mostImportantStep: score.most_important_step ?? "",
          paidReason: score.paid_reason ?? ""
        }
      ])
    ) as StoredSurveySubmission["scores"];
    const ranking = row.rankings?.[0];
    const suggestion = row.new_agent_suggestions?.[0];

    return {
      id: row.id,
      createdAt: row.created_at,
      respondent: {
        name: row.name
      },
      scores,
      ranking: {
        rank1: ranking?.rank_1_agent_id,
        rank2: ranking?.rank_2_agent_id,
        rank3: ranking?.rank_3_agent_id,
        reason: ranking?.ranking_reason ?? ""
      },
      suggestion: {
        hasSuggestion: Boolean(suggestion?.has_suggestion),
        agentName: suggestion?.agent_name ?? "",
        businessScene: suggestion?.business_scene ?? "",
        targetUser: suggestion?.target_user ?? "",
        inputMaterials: suggestion?.input_materials ?? "",
        expectedOutput: suggestion?.expected_output ?? "",
        whyCustomerPay: suggestion?.why_customer_pay ?? ""
      }
    } as StoredSurveySubmission;
  });
}
