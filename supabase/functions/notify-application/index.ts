// Telchar AI — Consulting Application Alert Email
// Sends a notification email to the operator after a consulting application submission.
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
    console.error("[notify-application] RESEND_API_KEY not set — skipping email");
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
    application_id,
    submission_time,
    company_name,
    contact_email,
    industry,
    revenue_range,
    employee_count,
    geography,
    fit_classification,
    nda_accepted,
    nda_accepted_at,
    nda_signer_email,
    nda_version,
    section_answers,
  } = body;

  const companyDisplay = (company_name as string) || "Unknown Company";
  const fitDisplay = ((fit_classification as string) || "unknown").toUpperCase();
  const subject = `New Consulting Application: ${companyDisplay} [${fitDisplay}]`;

  // Build application responses section from structured section_answers
  let responsesSection = "";
  if (Array.isArray(section_answers)) {
    const sectionBlocks = (section_answers as Array<{
      letter: string;
      label: string;
      fields: Array<{ id: string; label: string; value: string }>;
    }>).map((section) => {
      const fieldLines = section.fields
        .map((f) => `  ${f.label}: ${f.value || "(no answer)"}`)
        .join("\n");
      return `Section ${section.letter}: ${section.label}\n${fieldLines}`;
    });
    responsesSection = sectionBlocks.join("\n\n");
  }

  const textBody = `New Telchar AI Consulting Application
=======================================

Submission Time:    ${submission_time || "N/A"}
Application ID:     ${application_id || "N/A"}

Fit Classification: ${fitDisplay}

Company / Contact
-----------------
Company:            ${companyDisplay}
Email:              ${contact_email || "N/A"}
Industry:           ${industry || "N/A"}
Revenue:            ${revenue_range || "N/A"}
Employees:          ${employee_count || "N/A"}
Geography:          ${geography || "N/A"}

NDA Status
----------
NDA Accepted:       ${nda_accepted ? "Yes" : "No"}
NDA Accepted At:    ${nda_accepted_at || "N/A"}
NDA Signer Email:   ${nda_signer_email || "N/A"}
NDA Version:        ${nda_version || "1.0"}
NDA Document:       (no signed artifact — click-through acceptance only)

Full Application Responses
--------------------------
${responsesSection || "(no answers provided)"}
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
      console.error(`[notify-application] Resend API error (${res.status}):`, errText);
      return new Response(
        JSON.stringify({ ok: false, reason: "email_send_failed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await res.json();
    console.log("[notify-application] Email sent successfully:", result.id);

    return new Response(
      JSON.stringify({ ok: true, email_id: result.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[notify-application] Email send error:", err);
    return new Response(
      JSON.stringify({ ok: false, reason: "email_send_exception" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
