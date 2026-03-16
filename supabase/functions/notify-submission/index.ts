// Telchar AI — Submission Alert Email
// Sends a notification email to the operator after a successful diagnostic submission.
// Uses Resend for transactional email delivery.
// Env: RESEND_API_KEY (set in Supabase Edge Function secrets)

Deno.serve(async (req) => {
  // CORS — restrict to actual Telchar AI origins
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

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.error("[notify-submission] RESEND_API_KEY not set — skipping email");
    return new Response(
      JSON.stringify({ ok: false, reason: "email_not_configured" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const NOTIFY_TO = "john.powell1791@gmail.com";

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const {
    submission_id,
    report_token,
    submission_time,
    contact_name,
    contact_email,
    company_name,
    industry,
    employee_count,
    overall_score,
    top_priorities,
    lead_quality_tier,
    consulting_fit_flag,
    contact_consent,
    diagnostic_answers,
  } = body as Record<string, unknown>;

  const companyDisplay = company_name || "Unknown Company";
  const subject = `New Telchar AI submission: ${companyDisplay}`;

  // Format top priorities
  const priorities = Array.isArray(top_priorities) && top_priorities.length > 0
    ? top_priorities.map((p: string, i: number) => `  ${i + 1}. ${p}`).join("\n")
    : "  (none available)";

  const reportUrl = report_token
    ? `https://www.telcharai.com/report?token=${report_token}&tier=free`
    : "(no report token)";

  // Build full diagnostic responses section from answers passed by client
  let diagnosticResponsesSection = "";
  if (Array.isArray(diagnostic_answers) && diagnostic_answers.length > 0) {
    const lines = (diagnostic_answers as Array<{ id: string; label: string; value: string }>)
      .map((a) => `Q: ${a.label}\nA: ${a.value || "(no answer)"}`)
      .join("\n\n");
    diagnosticResponsesSection = `\nFull Diagnostic Responses\n-------------------------\n${lines}\n`;
  }

  const textBody = `New Telchar AI Diagnostic Submission
=====================================

Submission Time:    ${submission_time || "N/A"}
Submission ID:      ${submission_id || "N/A"}
Report Token:       ${report_token || "N/A"}

Contact
-------
Name:               ${contact_name || "N/A"}
Email:              ${contact_email || "N/A"}
Company:            ${companyDisplay}
Industry:           ${industry || "N/A"}
Team Size:          ${employee_count || "N/A"}

Results
-------
Overall Score:      ${overall_score != null ? `${overall_score} / 100` : "N/A"}
Top 3 Priorities:
${priorities}

Flags
-----
Lead Quality:       ${lead_quality_tier || "N/A"}
Consulting Fit:     ${consulting_fit_flag ? "Yes" : "No"}
Contact Consent:    ${contact_consent ? "Yes" : "No"}
${diagnosticResponsesSection}
Report URL: ${reportUrl}
`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Telchar AI <alerts@telcharai.com>",
        to: [NOTIFY_TO],
        subject,
        text: textBody,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[notify-submission] Resend API error (${res.status}):`, errText);
      return new Response(
        JSON.stringify({ ok: false, reason: "email_send_failed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await res.json();
    console.log("[notify-submission] Email sent successfully:", result.id);

    return new Response(
      JSON.stringify({ ok: true, email_id: result.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[notify-submission] Email send error:", err);
    return new Response(
      JSON.stringify({ ok: false, reason: "email_send_exception" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
