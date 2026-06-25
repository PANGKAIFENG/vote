"use client";

import clsx from "clsx";
import { FormEvent, useMemo, useState } from "react";
import directionImageUrl from "@/assets/odm建设方向.png";
import { AGENT_IDS, AGENTS, RATING_FIELDS } from "@/lib/survey-data";
import { saveSubmissionToMeooDb } from "@/lib/meoo-db-storage";
import { buildEmptySurveyDraft, validateSurveySubmission } from "@/lib/survey-validation";
import type {
  AgentId,
  NewAgentSuggestionDraft,
  ScoreKey,
  SurveyDraft
} from "@/lib/survey-types";

type FieldErrors = Record<string, string[]>;

const DIRECTION_IMAGE_SRC = directionImageUrl;
const TOTAL_SCORE_COUNT = AGENT_IDS.length * RATING_FIELDS.length;
const GRID_COLUMNS_CLASS = "grid-cols-[minmax(160px,1.15fr)_repeat(4,minmax(130px,1fr))]";

export default function SurveyPage() {
  const [draft, setDraft] = useState<SurveyDraft>(() => buildEmptySurveyDraft());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [directionImageFailed, setDirectionImageFailed] = useState(false);

  const completedScoreCount = useMemo(
    () =>
      AGENT_IDS.reduce(
        (total, agentId) =>
          total +
          RATING_FIELDS.filter((field) => draft.scores[agentId][field.key] !== null).length,
        0
      ),
    [draft.scores]
  );

  const duplicateRanking = useMemo(() => {
    const ranks = [draft.ranking.rank1, draft.ranking.rank2, draft.ranking.rank3].filter(Boolean);
    return ranks.length > 0 && new Set(ranks).size !== ranks.length;
  }, [draft.ranking.rank1, draft.ranking.rank2, draft.ranking.rank3]);

  const selectedRankingValues = useMemo(
    () =>
      [draft.ranking.rank1, draft.ranking.rank2, draft.ranking.rank3].filter(
        (value): value is AgentId => Boolean(value)
      ),
    [draft.ranking.rank1, draft.ranking.rank2, draft.ranking.rank3]
  );

  function updateRespondentName(value: string) {
    setDraft((current) => ({
      ...current,
      respondent: {
        ...current.respondent,
        name: value
      }
    }));
  }

  function updateScore(agentId: AgentId, field: ScoreKey, value: number) {
    setDraft((current) => ({
      ...current,
      scores: {
        ...current.scores,
        [agentId]: {
          ...current.scores[agentId],
          [field]: value
        }
      }
    }));
  }

  function updateScoreText(agentId: AgentId, field: "customerExample" | "mostImportantStep", value: string) {
    setDraft((current) => ({
      ...current,
      scores: {
        ...current.scores,
        [agentId]: {
          ...current.scores[agentId],
          [field]: value
        }
      }
    }));
  }

  function updateRanking<TField extends keyof SurveyDraft["ranking"]>(
    field: TField,
    value: SurveyDraft["ranking"][TField]
  ) {
    setDraft((current) => ({
      ...current,
      ranking: {
        ...current.ranking,
        [field]: value
      }
    }));
  }

  function updateSuggestion<TField extends keyof NewAgentSuggestionDraft>(
    field: TField,
    value: NewAgentSuggestionDraft[TField]
  ) {
    setDraft((current) => ({
      ...current,
      suggestion: {
        ...current.suggestion,
        [field]: value
      }
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    try {
      const result = validateSurveySubmission(draft);

      if (!result.success || !result.data) {
        setFieldErrors(result.fieldErrors);
        setFormError("请检查必填项后再提交。");
        return;
      }

      await saveSubmissionToMeooDb(result.data);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[Survey Submit Error]", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setFormError(`提交失败：${errMsg}。请截图此错误信息并发给项目负责人。`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-5 py-16 text-center">
        <div className="w-full rounded-lg border border-emerald-200 bg-white p-8 shadow-soft">
          <p className="mb-3 text-sm font-semibold text-emerald-700">提交成功</p>
          <h1 className="text-3xl font-semibold tracking-normal text-ink md:text-4xl">
            感谢你的反馈！
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            感谢你的反馈，我们会结合评分和排序确定下一轮 ODM 专家智能体优先级。
          </p>
          <button
            className="mt-8 h-11 rounded-md bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
            onClick={() => {
              setDraft(buildEmptySurveyDraft());
              setSubmitted(false);
            }}
            type="button"
          >
            填写另一份
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
      <header className="mb-6 rounded-lg border border-blue-100 bg-white p-5 shadow-soft md:p-7">
        <p className="mb-3 text-sm font-semibold text-blue-700">预计填写时间：3-5 分钟</p>
        <h1 className="text-3xl font-semibold tracking-normal text-ink md:text-5xl">
          ODM 专家智能体优先级调研
        </h1>
        <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600 md:text-lg">
          当前 ODM 推款 Agent 已在建设中，本次重点判断：推款之外，哪些专家智能体最能促进客户成单、增购和持续使用。
        </p>
      </header>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Section title="ODM Agent 整体方向图" eyebrow="方向图">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            {directionImageFailed ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                方向图加载失败，请刷新重试。
              </p>
            ) : (
              <a
                aria-label="打开 ODM 建设方向图大图"
                className="block overflow-x-auto rounded-md"
                href={DIRECTION_IMAGE_SRC}
                rel="noreferrer"
                target="_blank"
              >
                <img
                  alt="ODM 建设方向图"
                  className="h-auto max-h-[520px] w-full min-w-[720px] rounded-md object-contain md:min-w-0"
                  onError={() => setDirectionImageFailed(true)}
                  src={DIRECTION_IMAGE_SRC}
                />
              </a>
            )}
          </div>
        </Section>

        <Section title="填写人信息" eyebrow="基础信息">
          <div className="max-w-md">
            <TextInput
              error={fieldErrors["respondent.name"]?.[0]}
              label="姓名"
              required
              value={draft.respondent.name}
              onChange={updateRespondentName}
            />
          </div>
        </Section>

        <Section
          title="候选 Agent 评分"
          eyebrow="紧凑评分"
          note="1=价值弱，3=有明确价值，5=强烈建议优先建设。"
        >
          <ScoreMatrixSection
            completedScoreCount={completedScoreCount}
            errors={fieldErrors}
            scores={draft.scores}
            updateScore={updateScore}
            updateScoreText={updateScoreText}
          />
        </Section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Top 3 排序" eyebrow="强制取舍" note="从 5 个候选 Agent 中选择最优先的 3 个。">
            <div className="grid gap-4">
              <RankingSelect
                error={fieldErrors["ranking.rank1"]?.[0]}
                label="第一优先级"
                selectedValues={selectedRankingValues}
                value={draft.ranking.rank1}
                onChange={(value) => updateRanking("rank1", value)}
              />
              <RankingSelect
                error={fieldErrors["ranking.rank2"]?.[0]}
                label="第二优先级"
                selectedValues={selectedRankingValues}
                value={draft.ranking.rank2}
                onChange={(value) => updateRanking("rank2", value)}
              />
              <RankingSelect
                error={fieldErrors["ranking.rank3"]?.[0]}
                label="第三优先级"
                selectedValues={selectedRankingValues}
                value={draft.ranking.rank3}
                onChange={(value) => updateRanking("rank3", value)}
              />
            </div>
            {duplicateRanking ? (
              <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                三个优先级不能选择同一个 Agent。
              </p>
            ) : null}
            <div className="mt-5">
              <TextArea
                label="排序理由"
                placeholder="可以说明你为什么把这些 Agent 放在 Top 3。"
                value={draft.ranking.reason}
                onChange={(value) => updateRanking("reason", value)}
              />
            </div>
          </Section>

          <Section title="新增 Agent 建议" eyebrow="补充想法">
            <FieldLabel label="是否有新增 Agent 建议" required />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <ChoiceButton
                active={draft.suggestion.hasSuggestion === true}
                label="有"
                onClick={() => updateSuggestion("hasSuggestion", true)}
              />
              <ChoiceButton
                active={draft.suggestion.hasSuggestion === false}
                label="没有"
                onClick={() => updateSuggestion("hasSuggestion", false)}
              />
            </div>
            <FieldError message={fieldErrors["suggestion.hasSuggestion"]?.[0]} />

            {draft.suggestion.hasSuggestion ? (
              <div className="mt-6 grid gap-4">
                <TextInput
                  error={fieldErrors["suggestion.agentName"]?.[0]}
                  label="新增 Agent 名称"
                  required
                  value={draft.suggestion.agentName ?? ""}
                  onChange={(value) => updateSuggestion("agentName", value)}
                />
                <TextInput
                  error={fieldErrors["suggestion.businessScene"]?.[0]}
                  label="服务哪个业务场景"
                  required
                  value={draft.suggestion.businessScene ?? ""}
                  onChange={(value) => updateSuggestion("businessScene", value)}
                />
                <TextInput
                  error={fieldErrors["suggestion.targetUser"]?.[0]}
                  label="谁来使用"
                  required
                  value={draft.suggestion.targetUser ?? ""}
                  onChange={(value) => updateSuggestion("targetUser", value)}
                />
                <TextArea
                  error={fieldErrors["suggestion.inputMaterials"]?.[0]}
                  label="输入什么资料"
                  required
                  value={draft.suggestion.inputMaterials ?? ""}
                  onChange={(value) => updateSuggestion("inputMaterials", value)}
                />
                <TextArea
                  error={fieldErrors["suggestion.expectedOutput"]?.[0]}
                  label="希望输出什么结果"
                  required
                  value={draft.suggestion.expectedOutput ?? ""}
                  onChange={(value) => updateSuggestion("expectedOutput", value)}
                />
                <TextArea
                  error={fieldErrors["suggestion.whyCustomerPay"]?.[0]}
                  label="为什么客户会愿意用 / 付费"
                  required
                  value={draft.suggestion.whyCustomerPay ?? ""}
                  onChange={(value) => updateSuggestion("whyCustomerPay", value)}
                />
              </div>
            ) : null}
          </Section>
        </div>

        <div className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              {formError ? (
                <span className="font-semibold text-red-700">{formError}</span>
              ) : (
                `评分进度：${completedScoreCount}/${TOTAL_SCORE_COUNT}，提交后将保存本次评分、排序和新增建议。`
              )}
            </div>
            <button
              className="h-12 rounded-md bg-blue-700 px-7 text-base font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "提交中..." : "提交调研"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

function Section({
  children,
  eyebrow,
  note,
  title
}: {
  children: React.ReactNode;
  eyebrow: string;
  note?: string;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft md:p-6">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal text-ink">{title}</h2>
        </div>
        {note ? <p className="max-w-xl text-sm leading-6 text-slate-600">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

function ScoreMatrixSection({
  completedScoreCount,
  errors,
  scores,
  updateScore,
  updateScoreText
}: {
  completedScoreCount: number;
  errors: FieldErrors;
  scores: SurveyDraft["scores"];
  updateScore: (agentId: AgentId, field: ScoreKey, value: number) => void;
  updateScoreText: (
    agentId: AgentId,
    field: "customerExample" | "mostImportantStep",
    value: string
  ) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-slate-600">
          点击 Agent 名称可展开详细说明和补充题。
        </p>
        <ScoreProgress completedScoreCount={completedScoreCount} />
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <div className="min-w-[960px] overflow-hidden rounded-lg border border-slate-200">
          <div className={clsx("bg-slate-100 text-xs font-semibold text-slate-600", GRID_COLUMNS_CLASS)}>
            <div className="p-3">Agent</div>
            {RATING_FIELDS.map((field) => (
              <div className="flex items-center justify-center gap-1 p-3" key={field.key}>
                <span>{field.label}</span>
                <InfoTooltip text={field.question} />
              </div>
            ))}
          </div>
          {AGENT_IDS.map((agentId) => (
            <CompactAgentRow
              agentId={agentId}
              errors={errors}
              key={agentId}
              score={scores[agentId]}
              updateScore={updateScore}
              updateScoreText={updateScoreText}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 lg:hidden">
        {AGENT_IDS.map((agentId) => (
          <CompactAgentCard
            agentId={agentId}
            errors={errors}
            key={agentId}
            score={scores[agentId]}
            updateScore={updateScore}
            updateScoreText={updateScoreText}
          />
        ))}
      </div>
    </div>
  );
}

function ScoreProgress({ completedScoreCount }: { completedScoreCount: number }) {
  const progress = Math.round((completedScoreCount / TOTAL_SCORE_COUNT) * 100);

  return (
    <div className="min-w-44 rounded-md border border-blue-100 bg-blue-50 px-3 py-2">
      <p className="text-sm font-semibold text-blue-800">
        已完成 {completedScoreCount}/{TOTAL_SCORE_COUNT}
      </p>
      <div className="mt-2 h-2 rounded-full bg-white">
        <div className="h-full rounded-full bg-blue-700" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function CompactAgentRow({
  agentId,
  errors,
  score,
  updateScore,
  updateScoreText
}: {
  agentId: AgentId;
  errors: FieldErrors;
  score: SurveyDraft["scores"][AgentId];
  updateScore: (agentId: AgentId, field: ScoreKey, value: number) => void;
  updateScoreText: (
    agentId: AgentId,
    field: "customerExample" | "mostImportantStep",
    value: string
  ) => void;
}) {
  const agent = AGENTS[agentId];
  const hasError = RATING_FIELDS.some((field) => errors[`scores.${agentId}.${field.key}`]?.[0]);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={clsx("border-t border-slate-200", hasError && "bg-red-50/30")}>
      {/* Score row */}
      <div className={clsx("grid bg-white", GRID_COLUMNS_CLASS)}>
        <div className="p-3">
          <button
            type="button"
            className="flex items-center gap-1 text-left"
            onClick={() => setExpanded((v) => !v)}
          >
            <h3 className="text-base font-semibold text-ink">{agent.shortName}</h3>
            <svg
              className={clsx("h-4 w-4 shrink-0 text-slate-400 transition-transform", expanded && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <p className="mt-1 text-xs leading-5 text-slate-600">{agent.tagline}</p>
        </div>
        {RATING_FIELDS.map((field) => (
          <div className="border-l border-slate-100 p-3" key={field.key}>
            <RatingSegment
              agentId={agentId}
              field={field}
              score={score[field.key]}
              updateScore={updateScore}
            />
            <FieldError compact message={errors[`scores.${agentId}.${field.key}`]?.[0]} />
          </div>
        ))}
      </div>

      {/* Full-width expandable detail section */}
      {expanded ? (
        <div className="border-t border-slate-100 bg-slate-50 p-4">
          <AgentDetailContent
            agentId={agentId}
            score={score}
            updateScoreText={updateScoreText}
          />
        </div>
      ) : null}
    </div>
  );
}

function CompactAgentCard({
  agentId,
  errors,
  score,
  updateScore,
  updateScoreText
}: {
  agentId: AgentId;
  errors: FieldErrors;
  score: SurveyDraft["scores"][AgentId];
  updateScore: (agentId: AgentId, field: ScoreKey, value: number) => void;
  updateScoreText: (
    agentId: AgentId,
    field: "customerExample" | "mostImportantStep",
    value: string
  ) => void;
}) {
  const agent = AGENTS[agentId];
  const completedCount = RATING_FIELDS.filter((field) => score[field.key] !== null).length;

  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">{agent.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{agent.tagline}</p>
        </div>
        <span className="shrink-0 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-blue-700">
          {completedCount}/{RATING_FIELDS.length}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {RATING_FIELDS.map((field) => (
          <div className="rounded-md bg-white p-3" key={field.key}>
            <div className="mb-2 flex flex-col gap-1">
              <FieldLabel label={field.label} required />
              <p className="text-xs leading-5 text-slate-500">{field.question}</p>
            </div>
            <RatingSegment
              agentId={agentId}
              field={field}
              score={score[field.key]}
              updateScore={updateScore}
            />
            <FieldError message={errors[`scores.${agentId}.${field.key}`]?.[0]} />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <details className="group rounded-md border border-slate-200 bg-white p-3">
          <summary className="cursor-pointer text-sm font-semibold text-blue-700">
            说明/补充
          </summary>
          <div className="mt-3">
            <AgentDetailContent
              agentId={agentId}
              score={score}
              updateScoreText={updateScoreText}
            />
          </div>
        </details>
      </div>
    </article>
  );
}

function AgentDetailContent({
  agentId,
  score,
  updateScoreText
}: {
  agentId: AgentId;
  score: SurveyDraft["scores"][AgentId];
  updateScoreText: (
    agentId: AgentId,
    field: "customerExample" | "mostImportantStep",
    value: string
  ) => void;
}) {
  const agent = AGENTS[agentId];

  return (
    <div className="space-y-3 text-sm leading-6 text-slate-600">
      <div className="rounded-md border border-slate-100 bg-white p-3">
        <p className="text-xs font-semibold text-slate-500">典型场景</p>
        <p className="mt-1">{agent.scene}</p>
      </div>
      <AgentWorkflowFlow steps={agent.workflow} />
      <div className="flex flex-wrap gap-2">
        {agent.keywords.map((keyword) => (
          <span
            className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700"
            key={keyword}
          >
            {keyword}
          </span>
        ))}
      </div>
      <TextArea
        compact
        label="你见过哪些客户有类似需求？"
        placeholder="可以简单举例。"
        value={score.customerExample}
        onChange={(value) => updateScoreText(agentId, "customerExample", value)}
      />
      <TextArea
        compact
        label="这个 Agent 最应该解决客户哪一步工作？"
        value={score.mostImportantStep}
        onChange={(value) => updateScoreText(agentId, "mostImportantStep", value)}
      />
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-slate-400 text-[10px] font-bold text-slate-500">
        ?
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 w-48 -translate-x-1/2 rounded-md bg-slate-800 px-3 py-2 text-xs font-normal leading-5 text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}

function AgentWorkflowFlow({ steps }: { steps: string[] }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs font-semibold text-slate-500">工作流</p>
      <div className="grid gap-2">
        {steps.map((step, index) => (
          <div
            className="flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2"
            key={step}
          >
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-700 text-[11px] font-semibold text-white">
              {index + 1}
            </span>
            <span className="text-xs leading-5 text-slate-700">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankingSelect({
  error,
  label,
  onChange,
  selectedValues,
  value
}: {
  error?: string;
  label: string;
  onChange: (value: AgentId | "") => void;
  selectedValues: AgentId[];
  value: AgentId | "";
}) {
  return (
    <div>
      <FieldLabel label={label} required />
      <select
        className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        value={value}
        onChange={(event) => onChange(event.target.value as AgentId | "")}
      >
        <option value="">请选择</option>
        {AGENT_IDS.map((agentId) => (
          <option
            disabled={selectedValues.includes(agentId) && value !== agentId}
            key={agentId}
            value={agentId}
          >
            {AGENTS[agentId].name}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  );
}

function RatingSegment({
  agentId,
  field,
  score,
  updateScore
}: {
  agentId: AgentId;
  field: (typeof RATING_FIELDS)[number];
  score: number | null;
  updateScore: (agentId: AgentId, field: ScoreKey, value: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          aria-label={`${AGENTS[agentId].shortName} ${field.label} ${value} 分`}
          className={clsx(
            "min-h-10 rounded-md border text-sm font-semibold transition",
            score === value
              ? "border-blue-700 bg-blue-700 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
          )}
          key={value}
          onClick={() => updateScore(agentId, field.key, value)}
          type="button"
        >
          {value}
        </button>
      ))}
    </div>
  );
}

function TextInput({
  error,
  label,
  onChange,
  placeholder,
  required,
  value
}: {
  error?: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <input
        className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <FieldError message={error} />
    </div>
  );
}

function TextArea({
  compact,
  error,
  label,
  onChange,
  placeholder,
  required,
  value
}: {
  compact?: boolean;
  error?: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <textarea
        className={clsx(
          "mt-2 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
          compact ? "min-h-20" : "min-h-28"
        )}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <FieldError message={error} />
    </div>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="text-sm font-semibold text-slate-800">
      {label}
      {required ? <span className="ml-1 text-red-600">*</span> : null}
    </label>
  );
}

function FieldError({ compact, message }: { compact?: boolean; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className={clsx("font-medium text-red-700", compact ? "mt-1 text-xs" : "mt-2 text-sm")}>
      {message}
    </p>
  );
}

function ChoiceButton({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={clsx(
        "min-h-11 rounded-md border px-3 py-2 text-sm font-semibold transition",
        active
          ? "border-blue-700 bg-blue-700 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
