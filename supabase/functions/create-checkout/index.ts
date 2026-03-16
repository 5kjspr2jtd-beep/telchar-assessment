// Telchar AI — Create Stripe Checkout Session
// Server-side only. Uses STRIPE_SECRET_KEY to create a hosted checkout session.
// Returns the Stripe Checkout URL for client redirect.

import Stripe from "npm:stripe@17";

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
  const STRIPE_PRICE_ID = Deno.env.get("STRIPE_PRICE_ID");

  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
    console.error("[create-checkout] Missing STRIPE_SECRET_KEY or STRIPE_PRICE_ID");
    return new Response(
      JSON.stringify({ error: "Payment not configured" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { submission_id, report_token, contact_email } = body;

  if (!submission_id || !report_token) {
    return new Response(
      JSON.stringify({ error: "Missing submission_id or report_token" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });

  const SITE_BASE = "https://www.telcharai.com";

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      metadata: {
        submission_id,
        report_token,
        tier: "full",
      },
      success_url: `${SITE_BASE}/report?tier=plan&payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_BASE}/report?tier=free&payment=cancel`,
    };

    // Pre-fill customer email if available
    if (contact_email) {
      sessionParams.customer_email = contact_email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("[create-checkout] Session created:", session.id, "for submission:", submission_id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[create-checkout] Stripe error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to create checkout session" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
