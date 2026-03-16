import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  // Restrict CORS to actual Telchar AI origins
  const ALLOWED_ORIGINS = ["https://www.telcharai.com", "https://telcharai.com"];
  const origin = req.headers.get("origin") || "";
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const body = await req.json();
  const { report_token, tier: requestedTier = "full" } = body;

  if (!report_token) {
    return new Response(
      JSON.stringify({ error: "Missing report_token" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Fetch submission by report_token (exclude all PII)
  const { data: sub, error: subErr } = await supabase
    .from("submissions")
    .select("id, company_name, industry, employee_count, scores_data, full_access")
    .eq("report_token", report_token)
    .single();

  if (subErr || !sub) {
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Prefer saved report snapshot if one exists for the requested tier
  const { data: savedReport } = await supabase
    .from("diagnostic_reports")
    .select("report_json, scores_json, tier, report_version")
    .eq("submission_id", sub.id)
    .eq("tier", requestedTier)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (savedReport?.report_json) {
    // Return the saved snapshot — no need to reconstruct
    return new Response(JSON.stringify({
      source: "snapshot",
      report: savedReport.report_json,
      scores: savedReport.scores_json,
      tier: savedReport.tier,
      report_version: savedReport.report_version,
      full_access: sub.full_access || false,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Fallback: reconstruct from answers + scores
  const { data: answerRows } = await supabase
    .from("submission_answers")
    .select("question_id, answer_value")
    .eq("submission_id", sub.id);

  const answers: Record<string, string> = {
    company_name: sub.company_name,
    industry: sub.industry,
    employee_count: sub.employee_count,
  };
  for (const row of (answerRows || [])) {
    answers[row.question_id] = row.answer_value;
  }

  return new Response(JSON.stringify({
    source: "reconstructed",
    answers,
    scores: sub.scores_data,
    full_access: sub.full_access || false,
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
