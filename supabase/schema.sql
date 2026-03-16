-- =====================================================
-- Telchar AI Assessment Schema
-- Run this in the Supabase SQL Editor
-- =====================================================

-- Submissions = lead + answers + lead metadata
CREATE TABLE submissions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_token         UUID DEFAULT gen_random_uuid() NOT NULL,
  created_at           TIMESTAMPTZ DEFAULT now(),
  company_name         TEXT NOT NULL,
  contact_name         TEXT NOT NULL,
  contact_email        TEXT NOT NULL,
  industry             TEXT,
  employee_count       TEXT,
  overall_score        NUMERIC,
  scores_data          JSONB,
  lead_quality_score   NUMERIC,
  lead_quality_tier    TEXT CHECK (lead_quality_tier IN ('HIGH','MEDIUM','LOW')),
  contact_consent      BOOLEAN DEFAULT FALSE,
  full_access          BOOLEAN DEFAULT FALSE,
  payment_status       TEXT DEFAULT 'none',
  report_version       TEXT,
  consulting_fit_flag  BOOLEAN DEFAULT FALSE,
  followup_status      TEXT DEFAULT 'pending',
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id   TEXT,
  stripe_customer_id         TEXT
);

-- Submission answers (one row per question per submission)
CREATE TABLE submission_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id   UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  question_id     TEXT NOT NULL,
  answer_value    TEXT NOT NULL,
  answer_label    TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Reports = saved report payload snapshots by tier/version
CREATE TABLE diagnostic_reports (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id          UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  tier                   TEXT NOT NULL CHECK (tier IN ('free','full')),
  report_version         TEXT NOT NULL DEFAULT '2.0',
  scores_json            JSONB,
  benchmark_json         JSONB,
  recommendations_json   JSONB,
  report_json            JSONB,
  created_at             TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_submission_answers_sid ON submission_answers(submission_id);
CREATE INDEX idx_diagnostic_reports_sid ON diagnostic_reports(submission_id);
CREATE INDEX idx_submissions_email ON submissions(contact_email);
CREATE UNIQUE INDEX idx_submissions_report_token ON submissions(report_token);

-- =====================================================
-- Row Level Security — INSERT-only, NO anonymous SELECT
-- =====================================================

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_reports ENABLE ROW LEVEL SECURITY;

-- Anonymous INSERT only (browser can submit data)
CREATE POLICY "anon_insert_submissions" ON submissions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_answers" ON submission_answers
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_diagnostic_reports" ON diagnostic_reports
  FOR INSERT TO anon WITH CHECK (true);

-- NO anonymous SELECT policies on any table.
-- All reads go through the Edge Function using the service_role key.

-- =====================================================
-- Consulting Applications
-- =====================================================

CREATE TABLE consulting_applications (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           TIMESTAMPTZ DEFAULT now(),
  company_name         TEXT NOT NULL,
  contact_email        TEXT NOT NULL,
  industry             TEXT,
  revenue_range        TEXT,
  employee_count       TEXT,
  geography            TEXT,
  answers_data         JSONB NOT NULL,
  fit_score_class      TEXT CHECK (fit_score_class IN ('good','moderate','poor')),
  nda_accepted         BOOLEAN DEFAULT FALSE,
  nda_accepted_at      TIMESTAMPTZ,
  nda_signer_name      TEXT,
  nda_signer_email     TEXT,
  nda_version          TEXT DEFAULT '1.0',
  nda_document_path    TEXT,
  review_status        TEXT DEFAULT 'pending'
);

CREATE INDEX idx_consulting_apps_email ON consulting_applications(contact_email);
CREATE INDEX idx_consulting_apps_status ON consulting_applications(review_status);

ALTER TABLE consulting_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_consulting_apps" ON consulting_applications
  FOR INSERT TO anon WITH CHECK (true);
