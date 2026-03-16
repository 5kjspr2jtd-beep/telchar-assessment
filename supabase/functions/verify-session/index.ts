// Telchar AI — Verify Stripe Checkout Session
// Server-side verification of a Stripe Checkout Session.
// Accepts session_id, retrieves the session from Stripe,
// confirms payment_status, and returns report_token + full_access.

import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
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

  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  if (!STRIPE_SECRET_KEY) {
    console.error("[verify-session] Missing STRIPE_SECRET_KEY");
    return new Response(
      JSON.stringify({ verified: false, reason: "not_configured" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ verified: false, reason: "invalid_json" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { session_id } = body;
  if (!session_id) {
    return new Response(
      JSON.stringify({ verified: false, reason: "missing_session_id" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      console.warn("[verify-session] Session not paid:", session.id, session.payment_status);
      return new Response(
        JSON.stringify({ verified: false, reason: "not_paid", payment_status: session.payment_status }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const submissionId = session.metadata?.submission_id || null;
    const reportToken = session.metadata?.report_token || null;

    // Check Supabase full_access state
    let fullAccess = false;
    if (submissionId) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      const { data: sub } = await supabase
        .from("submissions")
        .select("full_access")
        .eq("id", submissionId)
        .single();
      fullAccess = sub?.full_access || false;
    }

    console.log("[verify-session] Verified session:", session.id, "paid:", true, "full_access:", fullAccess);

    return new Response(
      JSON.stringify({
        verified: true,
        payment_status: "paid",
        submission_id: submissionId,
        report_token: reportToken,
        full_access: fullAccess,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[verify-session] Stripe error:", err);
    return new Response(
      JSON.stringify({ verified: false, reason: "stripe_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
