// Telchar AI — Stripe Webhook Handler
// Handles checkout.session.completed events.
// Verifies webhook signature, updates Supabase submission row.

import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  // Webhooks come from Stripe servers — no CORS needed, but handle gracefully
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    console.error("[stripe-webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return new Response("Webhook not configured", { status: 503 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });

  // Read raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("[stripe-webhook] Missing stripe-signature header");
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("[stripe-webhook] Received event:", event.type, event.id);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const submissionId = session.metadata?.submission_id;

    if (!submissionId) {
      console.error("[stripe-webhook] No submission_id in session metadata:", session.id);
      return new Response(JSON.stringify({ received: true, warning: "no_submission_id" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: updateErr } = await supabase
      .from("submissions")
      .update({
        payment_status: "paid",
        full_access: true,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null,
        stripe_customer_id: typeof session.customer === "string"
          ? session.customer
          : session.customer?.id || null,
      })
      .eq("id", submissionId);

    if (updateErr) {
      console.error("[stripe-webhook] Supabase update failed for submission:", submissionId, updateErr);
      // Return 500 so Stripe retries
      return new Response("Database update failed", { status: 500 });
    }

    console.log("[stripe-webhook] Payment verified and submission updated:", submissionId);
  }

  // Acknowledge receipt for all event types
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
