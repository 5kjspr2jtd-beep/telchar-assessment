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

export default function TelcharPrivacy() {
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
          }}>Privacy Policy</span>}
          <HamburgerMenu currentPage="Privacy" navHeight={52} />
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
          }}>Privacy Policy</h1>
          <p style={{ ...bodyText, fontSize: 12, color: P.muted, marginBottom: 32 }}>
            Effective March 15, 2026
          </p>

          {/* 1. What We Collect */}
          <div style={sectionHead}>1. What We Collect</div>
          <p style={bodyText}>
            Telchar AI™ collects the information you provide during the AI Readiness Index™ diagnostic:
            your industry, team size, operational assessment responses, company name, your name, and your
            email address. If you check the optional consent box, we also record that preference.
          </p>

          {/* 2. How We Use It */}
          <div style={sectionHead}>2. How We Use It</div>
          <p style={bodyText}>
            All scoring and report generation happens within your browser. A copy of your submission is stored
            on our servers for report retrieval and follow-up. We use your email to deliver your report and
            follow up if you do not complete the Full AI Action Plan. If you opted in, we may contact you about
            Telchar AI™ consulting services. We do not send newsletters, promotional emails, or product updates.
          </p>

          {/* 3. Storage */}
          <div style={sectionHead}>3. Storage</div>
          <p style={bodyText}>
            Your data is stored in two places: (1) Your browser's sessionStorage, which is cleared when you
            close the tab. (2) Our servers via Supabase (hosted on AWS), which stores your submission, answers,
            scores, and consent preference to support report retrieval and follow-up.
          </p>

          {/* 4. Sharing */}
          <div style={sectionHead}>4. Sharing</div>
          <p style={bodyText}>
            We do not sell, rent, or share your information with third parties for marketing purposes. Your data
            is stored on Supabase infrastructure hosted on AWS.
          </p>

          {/* 5. Cookies & Analytics */}
          <div style={sectionHead}>5. Cookies & Analytics</div>
          <p style={bodyText}>
            This site does not use cookies, analytics, or any tracking technologies.
          </p>

          {/* 6. Data Retention */}
          <div style={sectionHead}>6. Data Retention</div>
          <p style={bodyText}>
            Browser data is deleted when you close the tab. Server-side data is retained to support report
            retrieval and follow-up. A data-deletion request process will be available once a contact channel
            is established.
          </p>

          {/* 7. Future Changes */}
          <div style={sectionHead}>7. Future Changes</div>
          <p style={bodyText}>
            Payment processing is handled by Stripe. Stripe collects payment information directly on their
            hosted checkout page; we do not store your card details. If we add analytics or other data
            collection in the future, this policy will be updated before those features go live. Changes will
            be reflected on this page with an updated effective date.
          </p>

          {/* 8. Contact */}
          <div style={sectionHead}>8. Contact</div>
          <p style={bodyText}>
            There is currently no public support or privacy contact channel. This section will be updated when
            one becomes available.
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
