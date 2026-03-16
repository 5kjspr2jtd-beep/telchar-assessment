import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams, Navigate } from "react-router-dom";
import TelcharLandingPage from "./pages/TelcharLandingPage";
import TelcharAssessment from "./pages/TelcharAssessment";
import TelcharReport from "./pages/TelcharReport";
import ROICalculator from "./ROICalculator";
import TelcharImplementation from "./pages/TelcharImplementation";
import TelcharTerms from "./pages/TelcharTerms";
import TelcharPrivacy from "./pages/TelcharPrivacy";

function RootRoute() {
  const [searchParams] = useSearchParams();
  if (searchParams.get("page") === "roi") return <ROICalculator />;
  return <TelcharLandingPage />;
}

// Helper: call get-report and check full_access
function fetchReportAccess(supabaseUrl, reportToken) {
  return fetch(`${supabaseUrl}/functions/v1/get-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report_token: reportToken, tier: "full" }),
  }).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

// Helper: write report data from Edge Function response to sessionStorage
function storeReportData(data) {
  try {
    if (data.source === "snapshot" && data.scores) {
      sessionStorage.setItem("telchar_assessment_data", JSON.stringify({
        answers: data.report?.co ? { company_name: data.report.co, industry: data.report.ind } : {},
        scores: data.scores,
        quickWins: data.report?.wins || [],
        leadQuality: null,
      }));
    } else if (data.source === "reconstructed" && data.answers) {
      sessionStorage.setItem("telchar_assessment_data", JSON.stringify({
        answers: data.answers,
        scores: data.scores,
        quickWins: [],
        leadQuality: null,
      }));
    }
  } catch { /* sessionStorage unavailable */ }
}

function ReportRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tier = searchParams.get("tier") || "free";
  const demo = searchParams.get("demo") === "true";
  const token = searchParams.get("token");
  const payment = searchParams.get("payment");
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [verifiedTier, setVerifiedTier] = useState(null);

  useEffect(() => {
    if (demo) return;

    // Handle payment cancel — clean URL, show free results
    if (payment === "cancel") {
      const clean = new URLSearchParams();
      clean.set("tier", "free");
      setSearchParams(clean, { replace: true });
      return;
    }

    // Handle payment success — verify Stripe session server-side
    if (payment === "success" && sessionId) {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) { setVerifiedTier("free"); return; }

      setLoading(true);

      // Step 1: Verify the Stripe Checkout Session server-side
      fetch(`${supabaseUrl}/functions/v1/verify-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(async (verifyData) => {
          if (!verifyData.verified || verifyData.payment_status !== "paid") {
            // Stripe session is not paid — deny access
            console.error("[Telchar] Session not verified as paid:", verifyData);
            setVerifiedTier("free");
            const clean = new URLSearchParams();
            clean.set("tier", "free");
            setSearchParams(clean, { replace: true });
            setLoading(false);
            return;
          }

          // Stripe confirms payment. Use report_token from session metadata
          // (authoritative — doesn't rely on sessionStorage)
          const reportToken = verifyData.report_token;
          if (!reportToken) {
            console.error("[Telchar] No report_token in verified session");
            setVerifiedTier("free");
            setLoading(false);
            return;
          }

          // Also store in sessionStorage for later use
          try {
            sessionStorage.setItem("telchar_report_token", reportToken);
            if (verifyData.submission_id) {
              sessionStorage.setItem("telchar_submission_id", verifyData.submission_id);
            }
          } catch { /* ignore */ }

          // Step 2: If webhook has already fired, full_access is true — grant immediately
          if (verifyData.full_access) {
            const data = await fetchReportAccess(supabaseUrl, reportToken);
            storeReportData(data);
            try { sessionStorage.setItem("telchar_full_access", "true"); } catch { /* ignore */ }
            setVerifiedTier("full");
            const clean = new URLSearchParams();
            clean.set("tier", "plan");
            setSearchParams(clean, { replace: true });
            setLoading(false);
            return;
          }

          // Step 3: Webhook hasn't fired yet — poll get-report up to 3 times with 2s delays
          console.log("[Telchar] Payment verified by Stripe, waiting for webhook to update Supabase...");
          let attempts = 0;
          const maxAttempts = 3;
          const delay = 2000;

          const poll = async () => {
            attempts++;
            try {
              const data = await fetchReportAccess(supabaseUrl, reportToken);
              if (data.full_access) {
                // Webhook has fired
                storeReportData(data);
                try { sessionStorage.setItem("telchar_full_access", "true"); } catch { /* ignore */ }
                setVerifiedTier("full");
                const clean = new URLSearchParams();
                clean.set("tier", "plan");
                setSearchParams(clean, { replace: true });
                setLoading(false);
                return;
              }
              if (attempts < maxAttempts) {
                setTimeout(poll, delay);
              } else {
                // Stripe confirms paid but webhook is slow — grant access
                // since we already verified with Stripe that payment_status=paid
                console.warn("[Telchar] Webhook still pending after polling, granting access (Stripe-verified paid)");
                storeReportData(data);
                try { sessionStorage.setItem("telchar_full_access", "true"); } catch { /* ignore */ }
                setVerifiedTier("full");
                const clean = new URLSearchParams();
                clean.set("tier", "plan");
                setSearchParams(clean, { replace: true });
                setLoading(false);
              }
            } catch (err) {
              console.error("[Telchar] Poll attempt failed:", err);
              if (attempts < maxAttempts) {
                setTimeout(poll, delay);
              } else {
                // Stripe verified paid — grant access despite fetch errors
                console.warn("[Telchar] Granting access based on Stripe verification despite fetch errors");
                try { sessionStorage.setItem("telchar_full_access", "true"); } catch { /* ignore */ }
                setVerifiedTier("full");
                const clean = new URLSearchParams();
                clean.set("tier", "plan");
                setSearchParams(clean, { replace: true });
                setLoading(false);
              }
            }
          };

          setTimeout(poll, delay);
        })
        .catch((err) => {
          console.error("[Telchar] Session verification failed:", err);
          setVerifiedTier("free");
          setLoading(false);
        });
      return;
    }

    // Handle payment=success without session_id — cannot verify, deny
    if (payment === "success" && !sessionId) {
      console.error("[Telchar] payment=success but no session_id — cannot verify");
      setVerifiedTier("free");
      const clean = new URLSearchParams();
      clean.set("tier", "free");
      setSearchParams(clean, { replace: true });
      return;
    }

    // Handle token-based report retrieval (existing behavior)
    if (token) {
      try {
        const saved = sessionStorage.getItem("telchar_assessment_data");
        if (saved) return;
      } catch { /* ignore */ }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) { setFetchError(true); return; }

      setLoading(true);
      fetchReportAccess(supabaseUrl, token)
        .then((data) => {
          storeReportData(data);
          if (data.full_access) {
            try { sessionStorage.setItem("telchar_full_access", "true"); } catch { /* ignore */ }
          }
          setVerifiedTier(data.full_access ? (tier === "plan" ? "full" : tier) : "free");
          setLoading(false);
        })
        .catch((err) => {
          console.error("[Telchar] Report fetch failed:", err);
          setFetchError(true);
          setLoading(false);
        });
      return;
    }
  }, [token, demo, tier, payment, sessionId, setSearchParams]);

  if (loading) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#080f1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
          {payment === "success" ? "Confirming your purchase..." : "Loading your report..."}
        </p>
      </div>
    );
  }

  if (fetchError) {
    return <Navigate to="/assessment" replace />;
  }

  // Guard: if not demo mode, no token, no payment flow, and no session data, redirect to assessment
  if (!demo && !token && !payment) {
    try {
      const saved = sessionStorage.getItem("telchar_assessment_data");
      if (!saved) return <Navigate to="/assessment" replace />;
    } catch (e) {
      return <Navigate to="/assessment" replace />;
    }
  }

  // Determine effective tier
  let effectiveTier = tier;
  if (verifiedTier) {
    // Use server-verified tier
    effectiveTier = verifiedTier === "full" ? "plan" : verifiedTier;
  } else if (!demo && (tier === "plan" || tier === "report")) {
    // For non-demo full-tier requests without server verification, check sessionStorage
    try {
      const hasAccess = sessionStorage.getItem("telchar_full_access") === "true";
      if (!hasAccess) effectiveTier = "free";
    } catch { effectiveTier = "free"; }
  }

  return <TelcharReport initialTier={effectiveTier} demo={demo} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/assessment" element={<TelcharAssessment />} />
      <Route path="/report" element={<ReportRoute />} />
      <Route path="/apply" element={<TelcharImplementation />} />
      <Route path="/terms" element={<TelcharTerms />} />
      <Route path="/privacy" element={<TelcharPrivacy />} />
    </Routes>
  );
}
