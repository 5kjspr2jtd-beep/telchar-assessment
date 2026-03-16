// Telchar AI — Diagnostic Submission Confirmation Email
// Sends a confirmation email to the person who completed the diagnostic.
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
    console.error("[confirm-submission] RESEND_API_KEY not set — skipping email");
    return new Response(
      JSON.stringify({ ok: false, reason: "email_not_configured" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { contact_name, contact_email, company_name, overall_score, report_url } = body;

  if (!contact_email) {
    return new Response(
      JSON.stringify({ ok: false, reason: "no_recipient_email" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const name = (contact_name as string) || "there";
  const company = (company_name as string) || "your company";
  const score = overall_score != null ? `${overall_score} / 100` : "available in your report";
  const link = (report_url as string) || "https://www.telcharai.com";

  const subject = "Your Telchar AI Assessment Results";

  const textBody = `Hi ${name},

Thank you for completing the Telchar AI Operational Diagnostic.

Your overall readiness score is ${score}.

View your diagnostic report here:
${link}

If you'd like the full AI Action Plan with detailed recommendations, you can purchase it from your report page.

— Telchar AI
`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Telchar AI <noreply@telcharai.com>",
        to: [contact_email as string],
        subject,
        text: textBody,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[confirm-submission] Resend API error (${res.status}):`, errText);
      return new Response(
        JSON.stringify({ ok: false, reason: "email_send_failed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await res.json();
    console.log("[confirm-submission] Confirmation email sent:", result.id);

    return new Response(
      JSON.stringify({ ok: true, email_id: result.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[confirm-submission] Email send error:", err);
    return new Response(
      JSON.stringify({ ok: false, reason: "email_send_exception" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
