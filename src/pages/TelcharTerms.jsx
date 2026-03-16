import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TELCHAR as P, FONT, GOOGLE_FONTS_URL } from "../design/telcharDesign";
import HamburgerMenu from "../components/HamburgerMenu";

function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

const sectionHead = {
  fontFamily: FONT, fontSize: 11, fontWeight: 600,
  letterSpacing: "0.18em", textTransform: "uppercase",
  color: P.blue, marginBottom: 10, marginTop: 36,
};

const bodyText = {
  fontFamily: FONT, fontSize: 14, fontWeight: 300,
  color: P.dim, lineHeight: 1.7, marginBottom: 16,
};

export default function TelcharTerms() {
  const w = useWidth();
  const mobile = w < 640;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{
      width: "100%", background: "#080f1e", position: "relative",
      display: "flex", flexDirection: "column", minHeight: "100vh",
    }}>
      {/* Atmosphere */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(13,22,40,0.4) 40%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 60%, rgba(37,99,235,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 10% 70%, rgba(13,22,40,0.6) 0%, transparent 60%)",
      }} />

      {/* Header */}
      <div style={{
        background: "rgba(8,15,30,0.9)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        height: 52, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: mobile ? "0 20px" : "0 36px",
        position: "relative", zIndex: 10,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/white_decal.svg" alt="Telchar AI" style={{ height: 18, width: "auto", display: "block" }} />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 8 : 20 }}>
          {!mobile && <span style={{
            fontFamily: FONT, fontSize: 12,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap",
          }}>Terms of Use</span>}
          <HamburgerMenu currentPage="Terms" navHeight={52} />
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, padding: mobile ? "24px 20px 0" : "44px 36px 0",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{
            fontFamily: FONT, fontSize: mobile ? 22 : 28, fontWeight: 600,
            color: "#fff", marginBottom: 8, letterSpacing: "-0.01em",
          }}>Terms of Use</h1>
          <p style={{ ...bodyText, fontSize: 12, color: P.muted, marginBottom: 32 }}>
            Effective March 15, 2026 (Updated)
          </p>

          {/* 1. Overview */}
          <div style={sectionHead}>1. Overview</div>
          <p style={bodyText}>
            Telchar AI™ provides the AI Readiness Index™ diagnostic and AI Action Plan — tools designed to help
            small and mid-size businesses evaluate their readiness for AI adoption and identify high-impact
            implementation opportunities. By using this site, you agree to these terms.
          </p>

          {/* 2. Informational Use Only */}
          <div style={sectionHead}>2. Informational Use Only</div>
          <p style={bodyText}>
            All content provided by Telchar AI™ — including diagnostic scores, recommendations, implementation
            guidance, and the AI Action Plan — is informational guidance only. It does not constitute professional
            advice of any kind, including but not limited to legal, tax, accounting, financial, or investment advice.
            You should consult qualified professionals before making business decisions based on any output from
            this tool.
          </p>

          {/* 3. No Guarantee of Results */}
          <div style={sectionHead}>3. No Guarantee of Results</div>
          <p style={bodyText}>
            Recommendations are generated based on the information you provide during the assessment. Actual results
            will vary depending on your business context, execution, team capacity, and other factors outside the
            control of Telchar AI™. We make no guarantees regarding specific outcomes, savings, or performance
            improvements.
          </p>

          {/* 4. User Responsibility */}
          <div style={sectionHead}>4. User Responsibility</div>
          <p style={bodyText}>
            You are solely responsible for all decisions made based on information provided by Telchar AI™. This
            includes decisions related to technology adoption, vendor selection, resource allocation, and any other
            business operations. Telchar AI™ provides guidance — you decide what to act on and how.
          </p>

          {/* 5. Payment Terms */}
          <div style={sectionHead}>5. Payment Terms</div>
          <p style={bodyText}>
            The AI Readiness Index™ diagnostic is free. The Full AI Action Plan is available as a one-time
            purchase of $150. It is a digital product delivered immediately upon purchase. Pricing is subject to
            change.
          </p>

          {/* 6. Refund Policy */}
          <div style={sectionHead}>6. Refund Policy</div>
          <p style={bodyText}>
            All sales are final. Because the Full AI Action Plan is a digital product delivered immediately after
            purchase, no refunds will be issued.
          </p>

          {/* 7. Intellectual Property */}
          <div style={sectionHead}>7. Intellectual Property</div>
          <p style={bodyText}>
            The Telchar AI™ framework, scoring methodology, AI Readiness Index™, report structure, implementation
            guide, and all associated proprietary materials are the intellectual property of Telchar AI. You may
            not copy, redistribute, resell, scrape, or commercially reuse any part of these materials without
            prior written permission.
          </p>

          {/* 8. Limitation of Liability */}
          <div style={sectionHead}>8. Limitation of Liability</div>
          <p style={bodyText}>
            To the fullest extent permitted by law, Telchar AI™ and its affiliates, officers, and employees shall
            not be liable for any indirect, incidental, consequential, or special damages arising from your use of
            the diagnostic, report, or AI Action Plan. This includes but is not limited to lost profits, business
            interruption, or any outcomes resulting from decisions made using our tools.
          </p>

          {/* 9. Governing Law */}
          <div style={sectionHead}>9. Governing Law</div>
          <p style={bodyText}>
            These terms shall be governed by and construed in accordance with the laws of the State of Delaware,
            without regard to conflict of law principles.
          </p>

          {/* 10. Changes to Terms */}
          <div style={sectionHead}>10. Changes to Terms</div>
          <p style={bodyText}>
            Telchar AI™ reserves the right to update these terms at any time. Changes will be reflected on this
            page with an updated effective date. Continued use of the site after changes are posted constitutes
            acceptance of the revised terms.
          </p>

          {/* 11. Contact */}
          <div style={sectionHead}>11. Contact</div>
          <p style={bodyText}>
            There is currently no public support or contact channel. This section will be updated when one
            becomes available.
          </p>
        </div>
      </div>

      <div style={{ height: 36 }} />

      {/* Footer */}
      <div style={{
        background: "rgba(8,15,30,0.9)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0, padding: "14px 36px",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1,
      }}>
        <span style={{
          fontFamily: FONT, fontSize: 11, fontWeight: 500,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
        }}>TELCHAR AI&trade;</span>
      </div>
    </div>
  );
}
