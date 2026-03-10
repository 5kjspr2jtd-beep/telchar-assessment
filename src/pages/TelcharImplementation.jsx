import { useState, useEffect, useRef, useCallback } from "react";
import { TELCHAR as P, FONT, SERIF, GOOGLE_FONTS_URL, Diamond, Rule, SecLabel, TEXT, TYPE, CTA } from "../design/telcharDesign";
import HamburgerMenu from "../components/HamburgerMenu";

// ============================================================
// TELCHAR AI — Implementation Support Application
// Screens for mutual fit before implementation leadership
// ============================================================

// ── Responsive hook (matches TelcharReport) ─────────────────
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ── Page shell ──────────────────────────────────────────────
function AppPage({ children }) {
  const w = useWidth();
  const mobile = w < 640;
  return (
    <div style={{
      width: "100%",
      background: "#080f1e",
      position: "relative",
      display: "flex", flexDirection: "column",
      minHeight: "100vh",
    }}>
      {/* Atmosphere layer */}
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
        position: "relative", zIndex: 1,
      }}>
        {/* Left: Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/white_decal.svg" alt="Telchar AI" style={{ height: 18, width: "auto", display: "block" }} />
        </div>
        {/* Right: Application title + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: mobile ? 8 : 20 }}>
          {!mobile && <span style={{
            fontFamily: FONT, fontSize: 12,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            whiteSpace: "nowrap",
          }}>Advisory Services Application</span>}
          <HamburgerMenu currentPage="Advisory Services" navHeight={52} />
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: mobile ? "24px 20px 0" : "44px 36px 0", position: "relative", zIndex: 1 }}>
        {children}
      </div>

      <div style={{ height: 36 }} />

      {/* Footer */}
      <div style={{
        background: "rgba(8,15,30,0.9)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
        padding: "14px 36px",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1,
      }}>
        <span style={{
          fontFamily: FONT, fontSize: 11, fontWeight: 500,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
        }}>TELCHAR AI &middot; CONFIDENTIAL</span>
      </div>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────
function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ margin: "0 auto", maxWidth: 600, padding: "0 24px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 8,
      }}>
        <span style={{ fontFamily: FONT, fontSize: TYPE.micro, color: TEXT.muted, letterSpacing: "0.08em" }}>
          STEP {current} OF {total}
        </span>
        <span style={{ fontFamily: FONT, fontSize: TYPE.micro, color: TEXT.muted }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 3, background: P.linedark, borderRadius: 2 }}>
        <div style={{
          height: 3, background: P.blue, borderRadius: 2,
          width: `${pct}%`, transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}

// ── Shared form primitives ────────────────────────────────────
function FormLabel({ children, required }) {
  return (
    <label style={{
      fontFamily: FONT, fontSize: TYPE.body, fontWeight: 500,
      color: TEXT.primary, display: "block", marginBottom: 8, lineHeight: 1.5,
    }}>
      {children}
      {required && <span style={{ color: P.red, marginLeft: 4 }}>*</span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, multiline, rows }) {
  const shared = {
    fontFamily: FONT, fontSize: TYPE.smallBody, color: TEXT.primary,
    background: P.navy3, border: `1px solid ${P.linedark}`,
    padding: "10px 14px", width: "100%", boxSizing: "border-box",
    borderRadius: 8, outline: "none",
    transition: "border-color 0.15s ease",
  };
  if (multiline) {
    return (
      <textarea value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows || 4}
        style={{ ...shared, resize: "vertical", minHeight: 80 }}
        onFocus={e => { e.target.style.borderColor = P.blue; }}
        onBlur={e => { e.target.style.borderColor = P.linedark; }}
      />
    );
  }
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} style={shared}
      onFocus={e => { e.target.style.borderColor = P.blue; }}
      onBlur={e => { e.target.style.borderColor = P.linedark; }}
    />
  );
}

function SelectInput({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        fontFamily: FONT, fontSize: TYPE.smallBody, color: value ? TEXT.primary : TEXT.muted,
        background: P.navy3, border: `1px solid ${P.linedark}`,
        padding: "10px 14px", width: "100%", boxSizing: "border-box",
        borderRadius: 8, outline: "none", cursor: "pointer",
        appearance: "none", WebkitAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffffff' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
      }}>
      <option value="" disabled>{placeholder || "Select..."}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function RadioGroup({ value, onChange, options, mobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)}
          style={{
            fontFamily: FONT, fontSize: TYPE.smallBody,
            color: value === opt ? "#ffffff" : TEXT.primary,
            textAlign: "left", padding: "14px 20px", cursor: "pointer",
            background: value === opt ? "rgba(37,99,235,0.15)" : "rgba(255,255,255,0.04)",
            border: value === opt ? "2px solid rgba(37,99,235,0.4)" : "1px solid rgba(255,255,255,0.09)",
            borderRadius: 10,
            fontWeight: value === opt ? 600 : 400,
            transition: "all 0.15s ease",
            width: "100%", boxSizing: "border-box",
          }}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{
      fontFamily: FONT, fontSize: TYPE.smallBody, color: TEXT.primary,
      display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
      lineHeight: 1.5,
    }}>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 20, height: 20, minWidth: 20, marginTop: 2,
        border: checked ? `2px solid ${P.blue}` : `1px solid ${P.linedark}`,
        background: checked ? P.blue : P.navy3,
        borderRadius: 4,
        transition: "all 0.15s ease",
      }}
        onClick={e => { e.preventDefault(); onChange(!checked); }}>
        {checked && (
          <svg width="12" height="10" viewBox="0 0 12 10">
            <polyline points="1.5,5 4.5,8 10.5,2" fill="none" stroke="#fff" strokeWidth="2" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </label>
  );
}

// ── NDA Section (simplified click-through) ──────────────────
const NDA_TEXT = `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of the date of electronic acceptance below, by and between Telchar AI ("Company") and the undersigned party ("Applicant"), each individually a "Party" and collectively the "Parties."

1. PURPOSE
The Parties wish to explore a potential engagement related to implementation leadership services. In connection with this evaluation, each Party may disclose Confidential Information to the other.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public information disclosed by either Party to the other, whether orally, in writing, electronically, or by inspection, including but not limited to: business strategies, financial data, operational processes, client information, technology systems, assessment results, pricing structures, proprietary methodologies, and any information marked or reasonably understood to be confidential.

3. EXCLUSIONS
Confidential Information does not include information that:
(a) is or becomes publicly available through no fault of the receiving Party;
(b) was already known to the receiving Party prior to disclosure, as evidenced by written records;
(c) is independently developed by the receiving Party without use of or reference to the disclosing Party's Confidential Information;
(d) is lawfully obtained from a third party without restriction on disclosure.

4. OBLIGATIONS
Each Party agrees to:
(a) hold all Confidential Information in strict confidence;
(b) not disclose Confidential Information to any third party without prior written consent of the disclosing Party;
(c) use Confidential Information solely for the purpose of evaluating the potential engagement;
(d) limit internal access to Confidential Information to those employees, contractors, or advisors who have a need to know and who are bound by obligations of confidentiality no less restrictive than those set forth herein.

5. PERMITTED DISCLOSURE
A Party may disclose Confidential Information if required by law, regulation, or valid court order, provided the disclosing Party is given reasonable prior notice (where legally permissible) and the disclosure is limited to the minimum required.

6. RETURN AND DESTRUCTION OF INFORMATION
Upon written request or termination of discussions, each Party shall promptly return or destroy all Confidential Information in its possession, including copies, summaries, and derivative materials. A certifying officer may be required to confirm destruction in writing.

7. NON-SOLICITATION
During the term of this Agreement and for a period of twelve (12) months following its termination, neither Party shall directly solicit for employment or engagement any employee or contractor of the other Party with whom it had material contact during the course of discussions under this Agreement.

8. DATA PROTECTION
Each Party shall handle any personal data received under this Agreement in compliance with applicable data protection laws. Neither Party shall process personal data beyond what is necessary for the stated purpose without prior written consent.

9. EQUITABLE RELIEF
Each Party acknowledges that a breach of this Agreement may cause irreparable harm for which monetary damages would be inadequate. Accordingly, either Party may seek equitable relief, including injunctive relief and specific performance, in addition to any other remedies available at law or in equity.

10. TERM
This Agreement shall remain in effect for a period of two (2) years from the date of acceptance, unless terminated earlier by written notice from either Party. The obligations of confidentiality shall survive termination for an additional period of two (2) years.

11. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction agreed upon by the Parties at the time of formal engagement, or in the absence of such agreement, the laws of the State of Delaware, United States.

12. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the Parties with respect to its subject matter and supersedes all prior or contemporaneous understandings, agreements, or representations. No modification shall be effective unless made in writing and signed by both Parties.`;

function NDASection({ ndaAgreed, setNdaAgreed, onAccept, mobile }) {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef(null);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: mobile ? "0 0" : "0 24px" }}>
      {/* Why we ask section */}
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 14, padding: "24px 28px", marginBottom: 40,
      }}>
        <SecLabel color={P.blue}>Why We Ask for This Information</SecLabel>
        <p style={{
          fontFamily: FONT, fontSize: TYPE.smallBody, color: TEXT.secondary,
          lineHeight: 1.8, margin: "0 0 16px 0",
        }}>
          The information you provide in this application is used solely to determine whether there is a strong mutual fit for implementation leadership. It helps us understand your business context, readiness, and expectations before engaging.
        </p>
        <ul style={{
          fontFamily: FONT, fontSize: TYPE.smallBody, color: TEXT.secondary,
          lineHeight: 1.8, paddingLeft: 20, margin: 0,
        }}>
          <li>Your responses are protected under a mutual NDA</li>
          <li>Data is never shared outside the evaluation process</li>
          <li>You may request deletion of your data at any time</li>
          <li>No information is used for marketing purposes</li>
        </ul>
      </div>

      <SecLabel>Mutual Non-Disclosure Agreement</SecLabel>
      <p style={{
        fontFamily: FONT, fontSize: TYPE.smallBody, color: TEXT.secondary,
        lineHeight: 1.7, marginBottom: 24,
      }}>
        Before proceeding, both parties agree to protect confidential information shared during the evaluation process. Please review the agreement below.
      </p>

      {/* NDA document */}
      <div style={{
        border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.04)",
        borderRadius: 14, marginBottom: 32, overflow: "hidden",
      }}>
        <button onClick={() => setExpanded(!expanded)} style={{
          fontFamily: FONT, fontSize: TYPE.smallBody, fontWeight: 600,
          color: TEXT.primary, background: "transparent",
          border: "none", padding: "14px 20px", width: "100%",
          textAlign: "left", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>Mutual Non-Disclosure Agreement</span>
          <span style={{ fontSize: 12, color: TEXT.muted }}>{expanded ? "COLLAPSE" : "EXPAND TO REVIEW"}</span>
        </button>
        {expanded && (
          <div ref={scrollRef} style={{
            maxHeight: 400, overflowY: "auto", padding: "20px 24px",
            fontFamily: FONT, fontSize: 12, lineHeight: 1.8,
            color: TEXT.secondary, whiteSpace: "pre-wrap",
          }}>
            {NDA_TEXT}
          </div>
        )}
      </div>

      {/* Simplified click-through acknowledgment */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Checkbox
          checked={ndaAgreed}
          onChange={v => setNdaAgreed(v)}
          label="I have reviewed and agree to the mutual confidentiality terms outlined above."
        />

        <button onClick={onAccept} disabled={!ndaAgreed}
          style={{
            ...CTA.style,
            width: mobile ? "100%" : CTA.width,
            opacity: ndaAgreed ? 1 : 0.4,
            cursor: ndaAgreed ? "pointer" : "not-allowed",
          }}>
          ACCEPT AND CONTINUE
        </button>
      </div>
    </div>
  );
}

// ── Questionnaire definition ─────────────────────────────────
const SECTIONS = [
  {
    key: "business", label: "Business Overview", letter: "A",
    fields: [
      { id: "q_company", label: "Company name", type: "text", required: true, placeholder: "Enter your company name" },
      { id: "q_industry", label: "Industry", type: "select", required: true, options: [
        "Professional Services", "Healthcare", "Construction / Trades", "Retail / E-commerce",
        "Food & Beverage", "Real Estate", "Manufacturing", "Logistics / Transportation",
        "Financial Services", "Insurance", "Legal", "Marketing / Creative Agency", "Other",
      ]},
      { id: "q_revenue", label: "Revenue range", type: "select", required: true, options: [
        "Under $500K", "$500K – $1M", "$1M – $5M", "$5M – $10M", "$10M – $25M", "$25M+",
      ]},
      { id: "q_employees", label: "Employee count", type: "select", required: true, options: [
        "1 – 5", "6 – 15", "16 – 50", "51 – 100", "101 – 250", "250+",
      ]},
      { id: "q_geography", label: "Operating geography", type: "text", required: true, placeholder: "e.g. Southeast US, National, Multi-state" },
    ],
  },
  {
    key: "goals", label: "Implementation Goals", letter: "B",
    fields: [
      { id: "q_priorities", label: "Which recommendations from your Telchar report are highest priority?", type: "textarea", required: true, placeholder: "Describe the areas you want to address first" },
      { id: "q_90day", label: "What outcomes do you want to achieve in the next 90 days?", type: "textarea", required: true, placeholder: "Be specific about measurable results you expect" },
      { id: "q_why", label: "Why are you seeking outside implementation leadership?", type: "textarea", required: true, placeholder: "What gap does this fill for your organization?" },
    ],
  },
  {
    key: "decision", label: "Decision Makers", letter: "C",
    fields: [
      { id: "q_sponsor", label: "Executive sponsor name", type: "text", required: true, placeholder: "Name of the executive sponsor" },
      { id: "q_sponsor_title", label: "Executive sponsor title", type: "text", required: true, placeholder: "e.g. CEO, COO, VP Operations" },
      { id: "q_sponsor_involved", label: "Will the executive sponsor participate in implementation reviews?", type: "radio", required: true, options: ["Yes, regularly", "Occasionally", "Unlikely", "Not sure"] },
      { id: "q_decision_authority", label: "Who has final decision authority on this engagement?", type: "text", required: true, placeholder: "Name and title" },
    ],
  },
  {
    key: "capacity", label: "Delivery Capacity", letter: "D",
    fields: [
      { id: "q_internal_pm", label: "Do you currently have project leadership internally?", type: "radio", required: true, options: ["Yes, dedicated project manager", "Someone handles it part-time", "No formal project leadership", "Not sure"] },
      { id: "q_coordinator", label: "Who will coordinate internal execution?", type: "text", required: true, placeholder: "Name or role" },
      { id: "q_technical", label: "Who will perform technical implementation?", type: "radio", required: true, options: ["Internal team", "Contractor", "Software vendor", "Not identified"] },
      { id: "q_participants", label: "How many employees will participate in implementation?", type: "select", required: true, options: ["1 – 2", "3 – 5", "6 – 10", "10+"] },
      { id: "q_departments", label: "What departments will be involved?", type: "textarea", required: false, placeholder: "e.g. Operations, Sales, Finance, IT" },
    ],
  },
  {
    key: "maturity", label: "Operational Maturity", letter: "E",
    fields: [
      { id: "q_workflows", label: "Are your core workflows documented?", type: "radio", required: true, options: ["Yes, well documented", "Partially documented", "Not documented", "Not sure"] },
      { id: "q_systems", label: "Are your systems and tools documented?", type: "radio", required: true, options: ["Yes, with a systems map", "Partially", "No", "Not sure"] },
      { id: "q_past_success", label: "Have you successfully implemented operational improvements before?", type: "radio", required: true, options: ["Yes, multiple times", "Once or twice", "We have tried but struggled", "No"] },
    ],
  },
  {
    key: "commitment", label: "Commitment Readiness", letter: "F",
    fields: [
      { id: "q_timeline", label: "How quickly do you want to begin?", type: "radio", required: true, options: ["Immediately", "Within 2 weeks", "Within 30 days", "Within 60 days", "No specific timeline"] },
      { id: "q_weekly_time", label: "How much weekly time can your team commit to implementation?", type: "radio", required: true, options: ["Less than 2 hours", "2 – 5 hours", "5 – 10 hours", "10+ hours"] },
      { id: "q_process_changes", label: "Are you willing to make process changes based on recommendations?", type: "radio", required: true, options: ["Yes, fully open", "Open with reservations", "Only minor changes", "Prefer to keep current processes"] },
    ],
  },
  {
    key: "engagement", label: "Engagement Expectations", letter: "G",
    fields: [
      { id: "q_style", label: "Preferred engagement style", type: "radio", required: true, options: ["Advisory only", "Weekly implementation leadership", "Short project engagement", "Not sure"] },
    ],
  },
  {
    key: "risk", label: "Risk Signals", letter: "H",
    fields: [
      { id: "q_concerns", label: "What concerns do you have about implementation?", type: "textarea", required: false, placeholder: "Be honest — this helps us evaluate fit" },
      { id: "q_stall", label: "What could stall this effort internally?", type: "textarea", required: false, placeholder: "e.g. budget approval, leadership changes, competing priorities" },
    ],
  },
  {
    key: "confirm", label: "Final Confirmation", letter: "I",
    fields: [
      { id: "q_email", label: "Contact email address", type: "text", required: true, placeholder: "your@email.com" },
      { id: "q_selective", label: "I understand this is a selective engagement and not all applications will be accepted.", type: "checkbox", required: true },
      { id: "q_leadership", label: "I understand this is implementation leadership support — not technical contracting.", type: "checkbox", required: true },
    ],
  },
];

// ── Questionnaire Component ──────────────────────────────────
function Questionnaire({ answers, setAnswers, onSubmit, mobile }) {
  const [currentSection, setCurrentSection] = useState(0);
  const section = SECTIONS[currentSection];

  const updateAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));

  const sectionComplete = section.fields.every(f => {
    if (!f.required) return true;
    const v = answers[f.id];
    if (f.type === "checkbox") return v === true;
    return v && String(v).trim() !== "";
  });

  const isLast = currentSection === SECTIONS.length - 1;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: mobile ? "0" : "0 24px" }}>
      <ProgressBar current={currentSection + 1} total={SECTIONS.length} />

      <div style={{ marginTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{
            fontFamily: FONT, fontSize: TYPE.micro, fontWeight: 600,
            color: P.blue, letterSpacing: "0.06em",
          }}>SECTION {section.letter}</span>
        </div>
        <h2 style={{
          fontFamily: FONT, fontSize: TYPE.section, fontWeight: 300,
          color: TEXT.primary, margin: "0 0 32px 0",
        }}>{section.label}</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {section.fields.map(f => (
            <div key={f.id}>
              {f.type !== "checkbox" && (
                <FormLabel required={f.required}>{f.label}</FormLabel>
              )}

              {f.type === "text" && (
                <TextInput value={answers[f.id] || ""} onChange={v => updateAnswer(f.id, v)}
                  placeholder={f.placeholder} />
              )}
              {f.type === "textarea" && (
                <TextInput value={answers[f.id] || ""} onChange={v => updateAnswer(f.id, v)}
                  placeholder={f.placeholder} multiline rows={4} />
              )}
              {f.type === "select" && (
                <SelectInput value={answers[f.id] || ""} onChange={v => updateAnswer(f.id, v)}
                  options={f.options} placeholder={f.placeholder} />
              )}
              {f.type === "radio" && (
                <RadioGroup value={answers[f.id] || ""} onChange={v => updateAnswer(f.id, v)}
                  options={f.options} mobile={mobile} />
              )}
              {f.type === "checkbox" && (
                <Checkbox checked={answers[f.id] || false}
                  onChange={v => updateAnswer(f.id, v)}
                  label={f.label} />
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{
          display: "flex",
          flexDirection: mobile ? "column-reverse" : "row",
          justifyContent: "space-between", alignItems: mobile ? "stretch" : "center",
          gap: mobile ? 12 : 0,
          marginTop: 48, paddingBottom: 40,
        }}>
          {currentSection > 0 ? (
            <button onClick={() => setCurrentSection(currentSection - 1)}
              style={{
                ...CTA.ghost,
                width: mobile ? "100%" : 140,
                margin: 0,
              }}>
              BACK
            </button>
          ) : <div />}

          {isLast ? (
            <button onClick={onSubmit} disabled={!sectionComplete}
              style={{
                ...CTA.style,
                width: mobile ? "100%" : 220,
                margin: 0,
                opacity: sectionComplete ? 1 : 0.4,
                cursor: sectionComplete ? "pointer" : "not-allowed",
              }}>
              SUBMIT APPLICATION
            </button>
          ) : (
            <button onClick={() => setCurrentSection(currentSection + 1)}
              disabled={!sectionComplete}
              style={{
                ...CTA.style,
                width: mobile ? "100%" : 160,
                margin: 0,
                opacity: sectionComplete ? 1 : 0.4,
                cursor: sectionComplete ? "pointer" : "not-allowed",
              }}>
              CONTINUE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Fit Scoring Logic ────────────────────────────────────────
// Returns: "good" | "moderate" | "poor"
// Score is NEVER shown to the user.
function scoreFit(answers) {
  let score = 0;

  // Executive sponsor presence (0-20 pts)
  const sponsorInvolved = answers.q_sponsor_involved;
  if (sponsorInvolved === "Yes, regularly") score += 20;
  else if (sponsorInvolved === "Occasionally") score += 12;
  else if (sponsorInvolved === "Unlikely") score += 4;
  else score += 0;

  // Internal delivery capacity (0-15 pts)
  const internalPm = answers.q_internal_pm;
  if (internalPm === "Yes, dedicated project manager") score += 15;
  else if (internalPm === "Someone handles it part-time") score += 10;
  else if (internalPm === "No formal project leadership") score += 5;
  else score += 0;

  // Weekly time commitment (0-20 pts)
  const weeklyTime = answers.q_weekly_time;
  if (weeklyTime === "10+ hours") score += 20;
  else if (weeklyTime === "5 – 10 hours") score += 15;
  else if (weeklyTime === "2 – 5 hours") score += 8;
  else score += 2;

  // Identified technical implementers (0-15 pts)
  const technical = answers.q_technical;
  if (technical === "Internal team") score += 15;
  else if (technical === "Software vendor") score += 12;
  else if (technical === "Contractor") score += 10;
  else score += 0; // "Not identified"

  // Clarity of goals (0-15 pts)
  const goalsLength = (answers.q_priorities || "").trim().length + (answers.q_90day || "").trim().length;
  if (goalsLength > 200) score += 15;
  else if (goalsLength > 100) score += 10;
  else if (goalsLength > 30) score += 5;
  else score += 0;

  // Urgency of timeline (0-15 pts)
  const timeline = answers.q_timeline;
  if (timeline === "Immediately") score += 15;
  else if (timeline === "Within 2 weeks") score += 12;
  else if (timeline === "Within 30 days") score += 8;
  else if (timeline === "Within 60 days") score += 4;
  else score += 0;

  // Negative signals (deductions)
  if (!answers.q_sponsor || !String(answers.q_sponsor).trim()) score -= 10;
  if (answers.q_process_changes === "Prefer to keep current processes") score -= 10;
  if (answers.q_style === "Not sure" && weeklyTime === "Less than 2 hours") score -= 5;

  // Normalize
  const normalized = Math.max(0, Math.min(100, score));

  if (normalized >= 60) return "good";
  if (normalized >= 35) return "moderate";
  return "poor";
}

// ── Email / notification stubs ───────────────────────────────
// In production, these would POST to an API endpoint.

function sendApplicantConfirmation(email, companyName) {
  // Stub: In production, POST to /api/email/applicant-confirmation
  console.log("[Email] Applicant confirmation →", email, {
    to: email,
    subject: "Telchar AI — Application Received",
    body: `Your implementation support application for ${companyName} has been received. We will review it and follow up if there is a strong mutual match.`,
  });
}

function sendOwnerNotification(applicationData, fitClassification) {
  // Stub: In production, POST to /api/email/owner-notification
  console.log("[Email] Owner notification →", {
    subject: `New Implementation Application — ${applicationData.q_company} [${fitClassification.toUpperCase()}]`,
    fit: fitClassification,
    company: applicationData.q_company,
    industry: applicationData.q_industry,
    email: applicationData.q_email,
    sponsor: applicationData.q_sponsor,
    timeline: applicationData.q_timeline,
  });
}

function storeApplication(ndaAgreed, answers, fitClassification) {
  // Store in sessionStorage for analytics and downstream use
  const record = {
    submittedAt: new Date().toISOString(),
    ndaAccepted: ndaAgreed,
    fitClassification,
    answers,
  };
  try {
    sessionStorage.setItem("telchar_implementation_data", JSON.stringify(record));
  } catch (e) {
    // Silent fail in environments without sessionStorage
  }
  // Stub: In production, POST to /api/applications
  console.log("[Storage] Application stored →", record);
  return record;
}

// ── Confirmation screen ──────────────────────────────────────
function Confirmation() {
  return (
    <div style={{
      background: "#080f1e", minHeight: "100vh", position: "relative",
      overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* Atmosphere */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 90% 60% at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(13,22,40,0.4) 40%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 85% 60%, rgba(37,99,235,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 10% 70%, rgba(13,22,40,0.6) 0%, transparent 60%)`
      }} />
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.025,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />

      {/* Glass card */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 480, margin: "0 auto", textAlign: "center",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 16, padding: "48px 40px",
        backdropFilter: "blur(20px)",
      }}>
        <Diamond size={28} fill={P.blue} stroke="none" sw={0}
          style={{ margin: "0 auto 20px auto" }} />
        <h2 style={{
          fontFamily: FONT, fontSize: "clamp(28px,5vw,36px)", fontWeight: 300,
          color: "#ffffff", margin: "0 0 16px 0",
        }}>
          Application Received
        </h2>
        <Rule diamond style={{ maxWidth: 200, margin: "0 auto 24px auto", borderColor: "rgba(255,255,255,0.07)" }} />
        <p style={{
          fontFamily: FONT, fontSize: 14, fontWeight: 300,
          color: TEXT.secondary,
          lineHeight: 1.75, maxWidth: 480, margin: "0 auto 16px auto",
        }}>
          We will review fit and follow up if there is a strong mutual match.
        </p>
        <p style={{
          fontFamily: FONT, fontSize: 12, fontWeight: 300,
          color: TEXT.muted,
          lineHeight: 1.75, maxWidth: 480, margin: "0 auto",
        }}>
          A confirmation has been sent to your email address. If you do not see it, please check your spam folder.
        </p>
      </div>
    </div>
  );
}

// ── Prefill from assessment data ─────────────────────────────
function loadAssessmentPrefill() {
  try {
    const raw = sessionStorage.getItem("telchar_assessment_data");
    if (!raw) return {};
    const data = JSON.parse(raw);
    const answers = data.answers || {};
    const prefill = {};

    // Map assessment answer keys to implementation question IDs
    if (answers.company_name) prefill.q_company = answers.company_name;
    if (answers.industry) prefill.q_industry = answers.industry;
    if (answers.employee_count) prefill.q_employees = answers.employee_count;

    return prefill;
  } catch (e) {
    return {};
  }
}

// ── Main page ────────────────────────────────────────────────
// Steps: intro (0), nda (1), questionnaire (2), submitted (3)
export default function TelcharImplementation() {
  const [step, setStep] = useState(0);
  const [ndaAgreed, setNdaAgreed] = useState(false);
  const [answers, setAnswers] = useState({});
  const w = useWidth();
  const mobile = w < 640;

  // Prefill from assessment on mount
  useEffect(() => {
    const prefill = loadAssessmentPrefill();
    if (Object.keys(prefill).length > 0) {
      setAnswers(prev => ({ ...prefill, ...prev }));
    }
  }, []);

  // Scroll to top on step change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const handleSubmit = () => {
    // Compute fit score internally (not shown to user)
    const fit = scoreFit(answers);

    // Store application data
    storeApplication(ndaAgreed, answers, fit);

    // Send applicant confirmation email
    if (answers.q_email) {
      sendApplicantConfirmation(answers.q_email, answers.q_company || "your company");
    }

    // Send owner notification with fit classification
    sendOwnerNotification(answers, fit);

    console.log("Application submitted", { answers, fitClassification: fit });
    setStep(3);
  };

  if (step === 3) return <Confirmation />;

  return (
    <div style={{
      minHeight: "100vh", fontFamily: FONT,
      background: "#080f1e", overflowX: "clip", width: "100%",
      position: "relative", overflow: "hidden",
    }}>
      {/* Atmosphere */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 90% 60% at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(13,22,40,0.4) 40%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 85% 60%, rgba(37,99,235,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 10% 70%, rgba(13,22,40,0.6) 0%, transparent 60%)
        `
      }} />
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.025,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      <style>{`
        @import url('${GOOGLE_FONTS_URL}');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{overflow-x:clip;max-width:100vw;background:${P.navy};}
        button{font-family:inherit;}
      `}</style>

      <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "center", overflowX: "hidden" }}>
        <div style={{ width: "100%", maxWidth: 1100 }}>
          <AppPage>
            {/* ── INTRO ── */}
          {step === 0 && (
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <SecLabel color={P.blue2}>Advisory Services</SecLabel>
              <h1 style={{
                fontFamily: FONT, fontSize: "clamp(28px,5vw,40px)",
                fontWeight: 300, color: TEXT.primary, margin: "0 0 24px 0",
                lineHeight: 1.2,
              }}>
                Apply for Advisory Services
              </h1>
              <Rule diamond style={{ marginBottom: 32 }} />

              <p style={{
                fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.8, marginBottom: 24,
              }}>
                This application determines whether there is a strong mutual fit for implementation leadership support.
              </p>
              <p style={{
                fontFamily: FONT, fontSize: TYPE.body, fontWeight: 300,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.8, marginBottom: 32,
              }}>
                Implementation support focuses on helping businesses execute the recommendations from their Telchar report through structured project and program leadership. This is not technical contracting. This is operational leadership for delivery.
              </p>

              {/* "What Implementation Leadership Includes" — blue glass */}
              <div style={{
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.25)",
                borderLeft: "3px solid #2563eb",
                borderRadius: 14, padding: mobile ? "24px 20px" : "24px 28px", marginBottom: 12,
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.22em",
                  textTransform: "uppercase", color: "#4a80f5", marginBottom: 16, fontFamily: FONT,
                }}>
                  WHAT IMPLEMENTATION LEADERSHIP INCLUDES
                </div>
                {[
                  "Building the implementation roadmap",
                  "Coordinating internal teams and external vendors",
                  "Sequencing automation initiatives by impact",
                  "Ensuring timelines and accountability",
                  "Ensuring measurable ROI at each stage",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <span style={{ color: "#2563eb", fontSize: 9, marginTop: 4, flexShrink: 0 }}>◆</span>
                    <span style={{ fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, fontFamily: FONT }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* "What This Is Not" — gray/muted, intentional contrast */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: "3px solid rgba(255,255,255,0.15)",
                borderRadius: 14, padding: mobile ? "24px 20px" : "24px 28px", marginBottom: 24,
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.22em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 16, fontFamily: FONT,
                }}>
                  WHAT THIS IS NOT
                </div>
                {[
                  "Building every automation personally",
                  "Replacing your IT staff or internal teams",
                  "Acting as a technical contractor",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 9, marginTop: 4, flexShrink: 0 }}>◆</span>
                    <span style={{ fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, fontFamily: FONT }}>{item}</span>
                  </div>
                ))}
              </div>

              <p style={{
                fontFamily: SERIF, fontSize: TYPE.smallBody, fontStyle: "italic",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.7, marginBottom: 32,
              }}>
                This engagement is selective. Not all applications will be accepted. We review each application to determine whether there is a strong mutual fit for leadership support.
              </p>

              <button onClick={() => setStep(1)}
                style={{
                  ...CTA.style,
                  width: mobile ? "100%" : CTA.width,
                }}>
                BEGIN APPLICATION
              </button>
            </div>
          )}

          {/* ── NDA ── */}
          {step === 1 && (
            <NDASection
              ndaAgreed={ndaAgreed}
              setNdaAgreed={setNdaAgreed}
              onAccept={() => setStep(2)}
              mobile={mobile}
            />
          )}

          {/* ── QUESTIONNAIRE ── */}
          {step === 2 && (
            <Questionnaire
              answers={answers}
              setAnswers={setAnswers}
              onSubmit={handleSubmit}
              mobile={mobile}
            />
          )}

          </AppPage>
        </div>
      </div>
    </div>
  );
}
