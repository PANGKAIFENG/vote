create extension if not exists "pgcrypto";

create table if not exists respondents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text default '',
  role text not null check (
    role in (
      'sales',
      'solution',
      'customer_success',
      'business_owner',
      'product_ops',
      'other'
    )
  ),
  customer_types text[] not null default '{}',
  willing_to_interview boolean,
  created_at timestamptz not null default now()
);

create table if not exists agent_scores (
  id uuid primary key default gen_random_uuid(),
  respondent_id uuid not null references respondents(id) on delete cascade,
  agent_id text not null check (
    agent_id in (
      'email_outreach',
      'marketing_acquisition',
      'customer_development',
      'trend_analysis',
      'style_asset_governance'
    )
  ),
  purchase_or_upsell_score int not null check (purchase_or_upsell_score between 1 and 5),
  pain_score int not null check (pain_score between 1 and 5),
  coverage_score int not null check (coverage_score between 1 and 5),
  frequency_score int not null check (frequency_score between 1 and 5),
  result_usability_score int not null check (result_usability_score between 1 and 5),
  customer_example text default '',
  most_important_step text default '',
  paid_reason text default '',
  created_at timestamptz not null default now(),
  unique (respondent_id, agent_id)
);

create table if not exists rankings (
  id uuid primary key default gen_random_uuid(),
  respondent_id uuid not null references respondents(id) on delete cascade,
  rank_1_agent_id text not null,
  rank_2_agent_id text not null,
  rank_3_agent_id text not null,
  ranking_reason text default '',
  created_at timestamptz not null default now(),
  check (rank_1_agent_id <> rank_2_agent_id),
  check (rank_1_agent_id <> rank_3_agent_id),
  check (rank_2_agent_id <> rank_3_agent_id)
);

create table if not exists new_agent_suggestions (
  id uuid primary key default gen_random_uuid(),
  respondent_id uuid not null references respondents(id) on delete cascade,
  has_suggestion boolean not null,
  agent_name text default '',
  business_scene text default '',
  target_user text default '',
  input_materials text default '',
  expected_output text default '',
  why_customer_pay text default '',
  created_at timestamptz not null default now()
);

create index if not exists agent_scores_respondent_id_idx on agent_scores(respondent_id);
create index if not exists rankings_respondent_id_idx on rankings(respondent_id);
create index if not exists new_agent_suggestions_respondent_id_idx on new_agent_suggestions(respondent_id);

alter table respondents enable row level security;
alter table agent_scores enable row level security;
alter table rankings enable row level security;
alter table new_agent_suggestions enable row level security;

drop policy if exists respondents_anon_insert on respondents;
create policy respondents_anon_insert on respondents for insert to anon with check (true);
drop policy if exists agent_scores_anon_insert on agent_scores;
create policy agent_scores_anon_insert on agent_scores for insert to anon with check (true);
drop policy if exists rankings_anon_insert on rankings;
create policy rankings_anon_insert on rankings for insert to anon with check (true);
drop policy if exists new_agent_suggestions_anon_insert on new_agent_suggestions;
create policy new_agent_suggestions_anon_insert on new_agent_suggestions for insert to anon with check (true);

drop policy if exists respondents_anon_select on respondents;
create policy respondents_anon_select on respondents for select to anon using (true);
drop policy if exists agent_scores_anon_select on agent_scores;
create policy agent_scores_anon_select on agent_scores for select to anon using (true);
drop policy if exists rankings_anon_select on rankings;
create policy rankings_anon_select on rankings for select to anon using (true);
drop policy if exists new_agent_suggestions_anon_select on new_agent_suggestions;
create policy new_agent_suggestions_anon_select on new_agent_suggestions for select to anon using (true);
