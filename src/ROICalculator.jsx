import { useState, useEffect, useRef, useCallback } from "react";

// ── Brand (matches assessment) ────────────────────────────────────────────────
const B = {
  navyDeep: "#0A1628", navy: "#0F1923", navyLight: "#1C2B3D",
  white: "#FFFFFF", gray300: "#D1D5DB", gray400: "#9CA3AF", gray500: "#6B7280",
  gold: "#D9B95E", blue: "#2979FF", blueGlow: "rgba(41,121,255,0.12)",
  green: "#22C55E", amber: "#F59E0B",
};
const F = "'DM Sans', sans-serif";
const MONO = "'DM Mono', 'Courier New', monospace";

// Anvil logo mark (same base64 asset used in assessment and landing page)
const ANVIL_URL = "data:image/png;base64,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";

// ── Pluralize helper ──────────────────────────────────────────────────────────
const pl = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// ── Options ───────────────────────────────────────────────────────────────────
const COST_OPTS = [
  { label: "$25–$35", low: 25, high: 35 },
  { label: "$35–$50", low: 35, high: 50 },
  { label: "$50–$75", low: 50, high: 75 },
  { label: "$75+",    low: 75, high: 95 },
];
const HOUR_OPTS = [
  { label: "<5 hrs",    low: 2,  high: 5 },
  { label: "5–10 hrs",  low: 5,  high: 10 },
  { label: "10–20 hrs", low: 10, high: 20 },
  { label: "20+ hrs",   low: 20, high: 30 },
];
const TEAM_OPTS = [
  { label: "1–3",    factor: 1.0 },
  { label: "4–10",   factor: 0.95 },
  { label: "11–25",  factor: 0.88 },
  { label: "26–50",  factor: 0.80 },
  { label: "51–100", factor: 0.72 },
];
const TOOL_OPTS = [
  { label: "$0",        monthly: 0 },
  { label: "$1–$50",    monthly: 25 },
  { label: "$50–$200",  monthly: 125 },
  { label: "$200–$500", monthly: 350 },
  { label: "$500+",     monthly: 650 },
];
const ADOPT_OPTS = [
  { label: "Low",    factor: 0.55, desc: "Limited buy-in. Manual processes entrenched." },
  { label: "Medium", factor: 0.72, desc: "Open to change. Some automation in place." },
  { label: "High",   factor: 0.88, desc: "Leadership aligned. Team adopts tools quickly." },
];

// ── Efficiency model ──────────────────────────────────────────────────────────
// Conservative scenario: base rate per category
// Optimistic scenario: base + 8pp (capped by category ceiling)
// Range spread target: ~2x low-to-high on annual savings
//
// These rates are assumptions set below published technical maximums.
// See Research basis section for sourcing context.
const DEFAULTS = {
  admin:     { base: 0.28, label: "Admin and Data Entry",  q: "Admin, data entry, invoicing, or scheduling?", min: 0.15, max: 0.45 },
  customer:  { base: 0.22, label: "Customer Follow-up",    q: "Customer follow-up, outreach, or communication?", min: 0.10, max: 0.40 },
  content:   { base: 0.22, label: "Content and Marketing",  q: "Content creation, proposals, or marketing?", min: 0.10, max: 0.40 },
  reporting: { base: 0.32, label: "Reporting and Tracking", q: "Tracking numbers, updating spreadsheets, or putting reports together?", min: 0.15, max: 0.50 },
};
const OPT_BUMP = 0.05; // optimistic scenario adds 5pp to base (tighter range)
const GLOBAL_CAP = 0.25;
const CAT_CAP = 0.35;

// ── Helpers ───────────────────────────────────────────────────────────────────
const r50 = (n) => Math.round(n / 50) * 50;
const rH = (n) => Math.round(n * 2) / 2;
const pct = (n) => Math.round(n * 100);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function useMobile(bp = 600) {
  const [m, setM] = useState(typeof window !== "undefined" ? window.innerWidth < bp : false);
  useEffect(() => { const h = () => setM(window.innerWidth < bp); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, [bp]);
  return m;
}

// ── Chip ──────────────────────────────────────────────────────────────────────
function Chip({ label, selected, onClick, small }) {
  const [pr, setPr] = useState(false);
  return (
    <button onClick={onClick} onMouseDown={() => setPr(true)} onMouseUp={() => setPr(false)} onMouseLeave={() => setPr(false)} onTouchStart={() => setPr(true)} onTouchEnd={() => setPr(false)}
      style={{
        fontFamily: F, fontSize: small ? 13 : 14, fontWeight: selected ? 600 : 500,
        padding: "12px 8px", background: selected ? B.blueGlow : pr ? B.navyLight + "CC" : B.navyLight,
        border: `1.5px solid ${selected ? B.blue : B.navyLight}`, borderRadius: 12,
        color: selected ? B.white : B.gray300, cursor: "pointer", transition: "all 0.12s ease",
        display: "flex", alignItems: "center", justifyContent: "center",
        whiteSpace: "nowrap", lineHeight: 1.2, minHeight: 48,
        boxShadow: selected ? `inset 0 0 8px ${B.blue}20, 0 0 10px ${B.blue}12` : "none",
        WebkitTapHighlightColor: "transparent", outline: "none",
      }}
    >{label}</button>
  );
}

function QRow({ label, options, value, onChange, cols = 4, hint, mob: isMob }) {
  const mobileCols = cols <= 3 ? cols : 2;
  const effectiveCols = isMob ? mobileCols : cols;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: B.gray300, marginBottom: 10, lineHeight: 1.4 }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${effectiveCols}, 1fr)`, gap: 8 }}>
        {options.map(o => <Chip key={o.label} label={o.label} selected={value === o.label} onClick={() => onChange(o.label)} small={effectiveCols > 4} />)}
      </div>
      {hint && value && <div style={{ fontFamily: F, fontSize: 11, color: B.gray500, marginTop: 6, lineHeight: 1.35 }}>{hint(value)}</div>}
    </div>
  );
}

// ── Category result row ───────────────────────────────────────────────────────
function CatRow({ label, hLo, hHi, sLo, sHi, rateLo, rateHi, mob }) {
  const w = Math.min(100, Math.round((sHi / 35000) * 100));
  return (
    <div style={{ padding: mob ? "12px 14px" : "14px 18px", background: B.navyLight + "60", borderRadius: 10, marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: B.white }}>{label}</div>
          <div style={{ fontFamily: F, fontSize: 11, color: B.gray500, marginTop: 2 }}>{hLo}–{hHi} hrs/wk recovered at {pct(rateLo)}–{pct(rateHi)}%</div>
        </div>
        <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: B.green, whiteSpace: "nowrap" }}>${sLo.toLocaleString()}–${sHi.toLocaleString()}</div>
      </div>
      <div style={{ height: 3, background: B.navyLight, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: `linear-gradient(90deg, ${B.blue}CC, ${B.green})`, borderRadius: 2, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

// ── Accordion ─────────────────────────────────────────────────────────────────
function Acc({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${B.navyLight}40` }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "14px 0" }}>
        <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: B.gray300 }}>{title}</span>
        <span style={{ fontFamily: F, fontSize: 14, color: B.gray500, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}>{"\u25BE"}</span>
      </div>
      {open && <div style={{ paddingBottom: 16 }}>{children}</div>}
    </div>
  );
}

// ── Stepper ───────────────────────────────────────────────────────────────────
function Stepper({ current, labels }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28, gap: 0 }}>
      {labels.map((l, i) => (
        <div key={l} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 13,
              background: i < current ? B.blue : i === current ? B.blue : "transparent",
              border: `2px solid ${i <= current ? B.blue : B.gray500}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: F, fontSize: 11, fontWeight: 600, color: i <= current ? B.white : B.gray500,
              transition: "all 0.2s ease",
            }}>{i < current ? "\u2713" : i + 1}</div>
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: i === current ? 600 : 400, color: i <= current ? B.gray300 : B.gray500 }}>{l}</span>
          </div>
          {i < labels.length - 1 && <div style={{ width: 28, height: 2, background: i < current ? B.blue : B.navyLight, margin: "0 6px", borderRadius: 1 }} />}
        </div>
      ))}
    </div>
  );
}

// ── Rate slider ───────────────────────────────────────────────────────────────
function RateSlider({ label, value, min, max, onChange }) {
  const pctVal = pct(value);
  const pctMin = pct(min);
  const pctMax = pct(max);
  const pos = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: F, fontSize: 12, color: B.gray400 }}>{label}</span>
        <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: B.white }}>{pctVal}%</span>
      </div>
      <div style={{ position: "relative", height: 28, display: "flex", alignItems: "center" }}>
        <input type="range" min={pctMin} max={pctMax} value={pctVal}
          onChange={(e) => onChange(parseInt(e.target.value) / 100)}
          style={{ width: "100%", height: 4, appearance: "none", WebkitAppearance: "none", background: `linear-gradient(to right, ${B.blue} ${pos}%, ${B.navyLight} ${pos}%)`, borderRadius: 2, outline: "none", cursor: "pointer" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: F, fontSize: 10, color: B.gray500 }}>{pctMin}%</span>
        <span style={{ fontFamily: F, fontSize: 10, color: B.gray500 }}>{pctMax}%</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function ROICalculator() {
  const [step, setStep] = useState("intro"); // intro -> questions -> results
  const [cost, setCost] = useState(null);
  const [hrs, setHrs] = useState({});
  const [team, setTeam] = useState("1–3");
  const [toolSpend, setToolSpend] = useState("$0");
  const [adopt, setAdopt] = useState("Medium");
  const [includeToolCost, setIncludeToolCost] = useState(true);
  const [showAdjust, setShowAdjust] = useState(false);
  const [rateOverrides, setRateOverrides] = useState({});
  const [showRateSliders, setShowRateSliders] = useState(false);
  const resultsRef = useRef(null);
  const mob = useMobile();
  const mobBtn = useMobile(480);

  const catKeys = Object.keys(DEFAULTS);
  const hrsReady = cost && catKeys.every(k => hrs[k]);
  const inputCount = (cost ? 1 : 0) + catKeys.filter(k => hrs[k]).length + (team !== "1–3" ? 1 : 0) + (adopt !== "Medium" ? 1 : 0) + (toolSpend !== "$0" ? 1 : 0);
  const maxInputs = 8;

  // Confidence: computed from input completeness + adoption
  const confidenceScore = Math.min(100, Math.round((inputCount / maxInputs) * 70 + (ADOPT_OPTS.find(o => o.label === adopt)?.factor || 0.72) * 30));
  const confidenceLabel = confidenceScore >= 75 ? "Higher" : confidenceScore >= 55 ? "Moderate" : "Lower";

  // Get effective rate for a category (override or default)
  const getRate = useCallback((key) => {
    const d = DEFAULTS[key];
    return rateOverrides[key] !== undefined ? clamp(rateOverrides[key], d.min, d.max) : d.base;
  }, [rateOverrides]);

  // ── Compute ─────────────────────────────────────────────────────────────────
  const compute = useCallback(() => {
    if (!hrsReady) return null;
    const c = COST_OPTS.find(o => o.label === cost);
    const af = ADOPT_OPTS.find(o => o.label === adopt)?.factor || 0.72;
    const tf = TEAM_OPTS.find(o => o.label === team)?.factor || 1.0;
    const ts = TOOL_OPTS.find(o => o.label === toolSpend)?.monthly || 0;
    if (!c) return null;
    const cMid = (c.low + c.high) / 2; // Use midpoint rate to avoid stacking variance

    let tEntMid = 0;
    catKeys.forEach(k => { const h = HOUR_OPTS.find(o => o.label === hrs[k]); if (h) tEntMid += (h.low + h.high) / 2; });

    let tLo = 0, tHi = 0;
    const bd = [];

    catKeys.forEach(k => {
      const d = DEFAULTS[k];
      const h = HOUR_OPTS.find(o => o.label === hrs[k]);
      if (!h) return;
      const baseRate = getRate(k);
      const rateLo = baseRate; // Conservative: base rate
      const rateHi = Math.min(baseRate + OPT_BUMP, d.max); // Optimistic: base + 8pp, capped

      let sLo = h.low * rateLo * af * tf;
      let sHi = h.high * rateHi * af * tf;
      sLo = Math.min(sLo, h.low * CAT_CAP);
      sHi = Math.min(sHi, h.high * CAT_CAP);
      tLo += sLo; tHi += sHi;
      bd.push({ label: d.label, hLo: rH(sLo), hHi: rH(sHi), sLo: r50(sLo * cMid * 52), sHi: r50(sHi * cMid * 52), rateLo, rateHi });
    });

    // Global cap
    const gCap = tEntMid * GLOBAL_CAP;
    if (tHi > gCap) { const sc = gCap / tHi; tHi = gCap; bd.forEach(b => { b.hHi = rH(b.hHi * sc); b.sHi = r50(b.sHi * sc); }); }
    if (tLo > gCap) { const sc = gCap / tLo; tLo = gCap; bd.forEach(b => { b.hLo = rH(b.hLo * sc); b.sLo = r50(b.sLo * sc); }); }

    const grossLo = r50(tLo * cMid * 52);
    const grossHi = r50(tHi * cMid * 52);
    const annToolCost = ts * 12;
    const deduct = includeToolCost ? annToolCost : 0;
    const netLo = grossLo - deduct;
    const netHi = grossHi - deduct;
    let payback = null;
    if (includeToolCost && annToolCost > 0 && grossHi > annToolCost) {
      const avgMonthly = ((grossLo + grossHi) / 2) / 12;
      if (avgMonthly > 0) payback = Math.ceil(annToolCost / avgMonthly);
    }

    return { bd, grossLo, grossHi, netLo, netHi, annToolCost, payback, wkLo: rH(tLo), wkHi: rH(tHi), costLabel: cost, af, tf };
  }, [cost, hrs, adopt, team, toolSpend, includeToolCost, hrsReady, getRate, catKeys]);

  const results = step === "results" ? compute() : null;
  const pad = mob ? "22px 16px" : "32px 28px";
  const cPad = mob ? "14px 16px" : "18px 22px";
  const txt = { fontFamily: F, fontSize: 12, color: B.gray500, lineHeight: 1.6, marginTop: 0 };

  const goResults = () => {
    setStep("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const resetDefaults = () => { setAdopt("Medium"); setTeam("1–3"); setToolSpend("$0"); setIncludeToolCost(true); setRateOverrides({}); setShowRateSliders(false); };
  const resetAll = () => { setCost(null); setHrs({}); resetDefaults(); setShowAdjust(false); setStep("intro"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(170deg, ${B.navyDeep} 0%, ${B.navy} 100%)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`html, body, #root { margin: 0; padding: 0; background: ${B.navyDeep}; overflow-x: hidden; }`}</style>
      <div style={{ width: "100%", maxWidth: 680, margin: "0 auto", padding: mob ? "0 0 100px" : "0 24px 48px" }}>

        {/* ── Sticky header ── */}
        <div style={{ position: "sticky", top: 0, zIndex: 200, background: B.navyDeep + "F0", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: `1px solid ${B.navyLight}`, marginBottom: mob ? 16 : 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: mob ? "14px 16px" : "18px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src={ANVIL_URL} alt="Telchar AI" style={{ height: 24 }} />
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 16, color: B.white, letterSpacing: "0.08em", textTransform: "uppercase" }}>TELCHAR AI</span>
              <span style={{ fontFamily: F, fontSize: 12, color: B.gray500, margin: "0 2px" }}>/</span>
              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: B.gray400 }}>ROI Calculator</span>
            </div>
            <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: B.amber, background: B.amber + "15", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Beta</span>
          </div>
        </div>

        <div style={{ padding: mob ? "0 16px" : 0 }}>

          {/* ═══ INTRO ═══ */}
          {step === "intro" && (
            <div style={{ paddingTop: mob ? 16 : 40, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 620, margin: "0 auto" }}>
              <h1 style={{ fontFamily: F, fontSize: mob ? 24 : 30, fontWeight: 700, color: B.white, marginBottom: 10, marginTop: 0, lineHeight: 1.15 }}>What is manual work costing your business?</h1>
              <p style={{ fontFamily: F, fontSize: 14, color: B.gray400, marginBottom: 28, lineHeight: 1.55, maxWidth: 460 }}>
                Answer a few questions about how your team spends time. Get a conservative, transparent estimate of what AI-assisted automation could recover annually.
              </p>
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <button onClick={() => setStep("questions")}
                  style={{ fontFamily: F, fontSize: 16, fontWeight: 600, padding: "14px 40px", background: B.blue, color: B.white, border: "none", borderRadius: 10, cursor: "pointer", transition: "all 0.15s ease", width: mob ? "100%" : 280, maxWidth: mob ? 420 : 280, boxSizing: "border-box" }}>
                  Start Calculator
                </button>
              </div>
              <div style={{ marginTop: 28, display: "flex", gap: mob ? 20 : 32 }}>
                {[{ n: "8", t: "Questions" }, { n: "4", t: "Categories" }, { n: "~2 min", t: "To complete" }].map(s => (
                  <div key={s.t}>
                    <div style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: B.white }}>{s.n}</div>
                    <div style={{ fontFamily: F, fontSize: 11, color: B.gray500, marginTop: 2 }}>{s.t}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: F, fontSize: 11, color: B.gray500, marginTop: 28 }}>No email required. No data stored. Results update live.</p>
            </div>
          )}

          {/* ═══ QUESTIONS ═══ */}
          {step === "questions" && (
            <>
              <Stepper current={0} labels={["Inputs", "Results"]} />
              <div style={{ background: B.navyLight + "40", borderRadius: 12, border: `1px solid ${B.navyLight}`, padding: pad }}>
                <div style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: B.gray500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Your time</div>
                <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: B.gray300, marginBottom: 4, lineHeight: 1.4 }}>About how many total hours per week does your business spend on the activities below?</div>
                <div style={{ fontFamily: F, fontSize: 11, color: B.gray500, marginBottom: 18, lineHeight: 1.35 }}>Estimate across the whole business, not just you.</div>

                {catKeys.map(k => <QRow key={k} label={DEFAULTS[k].q} options={HOUR_OPTS} value={hrs[k]} onChange={v => setHrs(p => ({ ...p, [k]: v }))} mob={mob} />)}

                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: B.gray300, marginBottom: 4, lineHeight: 1.4 }}>On average, what do you pay per hour for the people doing this work?</div>
                  <div style={{ fontFamily: F, fontSize: 11, color: B.gray500, marginBottom: 10, lineHeight: 1.35 }}>Estimate the average hourly cost across everyone who handles these tasks. Include wages, payroll taxes, and basic benefits.</div>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${mob ? 2 : 4}, 1fr)`, gap: 8 }}>
                    {COST_OPTS.map(o => <Chip key={o.label} label={o.label} selected={cost === o.label} onClick={() => setCost(o.label)} />)}
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${B.navyLight}`, paddingTop: 18, marginTop: 4 }}>
                  <div style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: B.gray500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 18 }}>Context</div>
                  <QRow label="How many people do this work?" options={TEAM_OPTS} value={team} onChange={setTeam} cols={5} mob={mob} />
                  <QRow label="What do you spend per month on software that helps automate this work?" options={TOOL_OPTS} value={toolSpend} onChange={setToolSpend} cols={5} mob={mob} />
                  <QRow label="How ready is your team to use new tools?" options={ADOPT_OPTS} value={adopt} onChange={setAdopt} cols={3} mob={mob}
                    hint={(v) => ADOPT_OPTS.find(o => o.label === v)?.desc || ""} />
                </div>

                {!mob && (
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
                    <button onClick={goResults} disabled={!hrsReady}
                      style={{ fontFamily: F, fontSize: 15, fontWeight: 600, padding: "14px 36px", background: hrsReady ? B.blue : B.gray500, color: B.white, border: "none", borderRadius: 10, cursor: hrsReady ? "pointer" : "default", opacity: hrsReady ? 1 : 0.4, transition: "all 0.2s ease" }}>
                      Calculate ROI
                    </button>
                    <span onClick={() => setStep("intro")} style={{ fontFamily: F, fontSize: 13, color: B.gray500, cursor: "pointer" }}>Back</span>
                  </div>
                )}
              </div>

              {mob && (
                <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "10px 16px", background: B.navyDeep + "F2", borderTop: `1px solid ${B.navyLight}`, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", zIndex: 100 }}>
                  <button onClick={goResults} disabled={!hrsReady}
                    style={{ fontFamily: F, fontSize: 15, fontWeight: 600, width: "100%", padding: "14px 0", background: hrsReady ? B.blue : B.gray500, color: B.white, border: "none", borderRadius: 10, cursor: hrsReady ? "pointer" : "default", opacity: hrsReady ? 1 : 0.4, transition: "all 0.2s ease" }}>
                    Calculate ROI
                  </button>
                </div>
              )}
            </>
          )}

          {/* ═══ RESULTS ═══ */}
          {step === "results" && results && (
            <div ref={resultsRef}>
              <Stepper current={1} labels={["Inputs", "Results"]} />

              {/* Hero */}
              <div style={{ background: `linear-gradient(135deg, ${B.navyLight}CC, ${B.navy})`, borderRadius: 14, border: `1px solid ${B.gold}25`, padding: mob ? "28px 20px" : "36px 32px", textAlign: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: B.gold, textTransform: "uppercase", letterSpacing: "0.06em" }}>Conservative estimate</span>
                  <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: confidenceLabel === "Higher" ? B.green : confidenceLabel === "Moderate" ? B.amber : B.gray500, background: (confidenceLabel === "Higher" ? B.green : confidenceLabel === "Moderate" ? B.amber : B.gray500) + "15", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {confidenceLabel} confidence
                  </span>
                </div>
                <div style={{ fontFamily: F, fontSize: 10, color: B.gray500, marginBottom: 12 }}>Based on {inputCount} of {maxInputs} inputs provided and {adopt} adoption readiness</div>

                <div style={{ fontFamily: F, fontSize: 12, color: B.gray400, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {includeToolCost && results.annToolCost > 0 ? "Estimated Net Annual Savings" : "Estimated Annual Savings"}
                </div>
                <div style={{ fontFamily: F, fontSize: mob ? 34 : 44, fontWeight: 700, color: B.gold, lineHeight: 1 }}>
                  {includeToolCost && results.annToolCost > 0
                    ? (results.netHi <= 0 ? "No net savings" : `$${Math.max(0, results.netLo).toLocaleString()}–$${results.netHi.toLocaleString()}`)
                    : `$${results.grossLo.toLocaleString()}–$${results.grossHi.toLocaleString()}`
                  }
                </div>

                <div style={{ fontFamily: F, fontSize: 14, color: B.gray400, marginTop: 10 }}>
                  {results.wkLo}–{results.wkHi} hours recovered per week
                </div>

                {includeToolCost && results.annToolCost > 0 && (
                  <div style={{ fontFamily: F, fontSize: 12, color: B.gray500, marginTop: 8 }}>
                    Gross: ${results.grossLo.toLocaleString()}–${results.grossHi.toLocaleString()} | Tools: ${results.annToolCost.toLocaleString()}/yr
                  </div>
                )}
                {results.payback !== null && includeToolCost && (
                  <div style={{ fontFamily: F, fontSize: 12, color: B.green, marginTop: 6 }}>Estimated payback: {pl(results.payback, "month")}</div>
                )}
                {includeToolCost && results.annToolCost > 0 && results.netHi <= 0 && (
                  <div style={{ fontFamily: F, fontSize: 12, color: B.gray500, marginTop: 6 }}>No payback under these assumptions</div>
                )}
                {results.annToolCost === 0 && (
                  <div style={{ fontFamily: F, fontSize: 11, color: B.gray500, marginTop: 8 }}>Most teams add tooling as they scale. Adjust below to model costs.</div>
                )}
              </div>

              {/* Category breakdown */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: B.gray500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Savings by category</div>
                {results.bd.map((r, i) => <CatRow key={i} {...r} mob={mob} />)}
              </div>

              {/* Inputs summary */}
              <div style={{ background: B.navyLight + "40", borderRadius: 10, border: `1px solid ${B.navyLight}`, padding: cPad, marginBottom: 12 }}>
                <div style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: B.gray500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Your inputs</div>
                <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? "2px 0" : "2px 24px", fontFamily: F, fontSize: 12, color: B.gray300, lineHeight: 1.8 }}>
                  <div><span style={{ color: B.gray500 }}>Labor cost:</span> {results.costLabel}/hr</div>
                  <div><span style={{ color: B.gray500 }}>Team size:</span> {team} employees</div>
                  {catKeys.map(k => <div key={k}><span style={{ color: B.gray500 }}>{DEFAULTS[k].label}:</span> {hrs[k]}</div>)}
                  <div><span style={{ color: B.gray500 }}>Adoption:</span> {adopt} ({pct(results.af)}%)</div>
                  <div><span style={{ color: B.gray500 }}>Tool spend:</span> {toolSpend}/mo</div>
                </div>
              </div>

              {/* ── Adjust assumptions ── */}
              <div style={{ background: B.navyLight + "40", borderRadius: 10, border: `1px solid ${B.navyLight}`, marginBottom: 12, overflow: "hidden" }}>
                <div onClick={() => setShowAdjust(!showAdjust)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: cPad }}>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: B.gray300 }}>Adjust assumptions</span>
                  <span style={{ fontFamily: F, fontSize: 14, color: B.gray500, transform: showAdjust ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}>{"\u25BE"}</span>
                </div>
                {showAdjust && (
                  <div style={{ padding: `0 ${mob ? "16px" : "22px"} 18px` }}>
                    <QRow label="Adoption readiness" options={ADOPT_OPTS} value={adopt} onChange={setAdopt} cols={3} mob={mob}
                      hint={(v) => ADOPT_OPTS.find(o => o.label === v)?.desc || ""} />
                    <QRow label="Employees on these workflows" options={TEAM_OPTS} value={team} onChange={setTeam} cols={5} mob={mob} />
                    <QRow label="Monthly tool spend" options={TOOL_OPTS} value={toolSpend} onChange={setToolSpend} cols={5} mob={mob} />

                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <div onClick={() => setIncludeToolCost(!includeToolCost)}
                        style={{ width: 20, height: 20, borderRadius: 4, border: `1.5px solid ${includeToolCost ? B.blue : B.gray500}`, background: includeToolCost ? B.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, color: B.white, flexShrink: 0 }}>
                        {includeToolCost ? "\u2713" : ""}
                      </div>
                      <span style={{ fontFamily: F, fontSize: 12, color: B.gray400, cursor: "pointer" }} onClick={() => setIncludeToolCost(!includeToolCost)}>Subtract tool cost from savings</span>
                    </div>

                    {/* Rate adjustment */}
                    <div style={{ borderTop: `1px solid ${B.navyLight}`, paddingTop: 14, marginTop: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontFamily: F, fontSize: 12, color: B.gray400 }}>Tune time savings assumptions</span>
                        <div onClick={() => setShowRateSliders(!showRateSliders)} style={{ width: 36, height: 20, borderRadius: 10, background: showRateSliders ? B.blue : B.navyLight, border: `1px solid ${showRateSliders ? B.blue : B.gray500}`, position: "relative", cursor: "pointer", transition: "all 0.15s ease" }}>
                          <div style={{ width: 16, height: 16, borderRadius: 8, background: B.white, position: "absolute", top: 1, left: showRateSliders ? 18 : 1, transition: "left 0.15s ease" }} />
                        </div>
                      </div>
                      <div style={{ fontFamily: F, fontSize: 11, color: B.gray500, lineHeight: 1.4, marginBottom: showRateSliders ? 10 : 0 }}>
                        {showRateSliders
                          ? "How much of this work AI can realistically take off your plate. Example: 25% means about 15 minutes saved per hour spent."
                          : "Conservative defaults are applied. Toggle on to customize per category."
                        }
                      </div>
                      {showRateSliders && catKeys.map(k => (
                        <RateSlider key={k} label={DEFAULTS[k].label} value={getRate(k)} min={DEFAULTS[k].min} max={DEFAULTS[k].max}
                          onChange={(v) => setRateOverrides(p => ({ ...p, [k]: v }))} />
                      ))}
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <span onClick={resetDefaults} style={{ fontFamily: F, fontSize: 12, color: B.blue, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>Reset to defaults</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── How we calculate this ── */}
              <div style={{ background: B.navyLight + "40", borderRadius: 10, border: `1px solid ${B.navyLight}`, padding: cPad, marginBottom: 16 }}>
                <Acc title="How we calculate this" defaultOpen={false}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: B.gray300, marginBottom: 8 }}>Formula</div>
                    <div style={{ fontFamily: MONO, fontSize: 12, color: B.gray300, lineHeight: 1.6 }}>
                      <div>Recovered Hrs = Entered Hrs x Rate x Adoption x Team Factor</div>
                      <div>Annual Savings = Recovered Hrs/Wk x Cost/Hr x 52</div>
                      <div>Net Savings = Gross Savings - Annual Tool Cost</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: B.gray300, marginBottom: 8 }}>Expected time savings by category</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: B.gray500, lineHeight: 1.7 }}>
                      {catKeys.map(k => {
                        const d = DEFAULTS[k];
                        const r = getRate(k);
                        const isOverride = rateOverrides[k] !== undefined;
                        return <div key={k}>{d.label}: {pct(r)}%–{pct(Math.min(r + OPT_BUMP, d.max))}% of entered hours{isOverride ? " (custom)" : " (default)"}</div>;
                      })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: B.gray300, marginBottom: 8 }}>Input definitions</div>
                    <div style={{ fontFamily: F, fontSize: 12, color: B.gray500, lineHeight: 1.7 }}>
                      <div><span style={{ color: B.gray400 }}>Hourly cost:</span> Fully loaded (salary + benefits + overhead)</div>
                      <div><span style={{ color: B.gray400 }}>Hours:</span> Weekly team hours on each task category</div>
                      <div><span style={{ color: B.gray400 }}>Adoption:</span> Multiplier for organizational readiness ({adopt}: {pct(results.af)}%)</div>
                      <div><span style={{ color: B.gray400 }}>Team factor:</span> Coordination discount for larger teams ({team}: {pct(results.tf)}%)</div>
                      <div><span style={{ color: B.gray400 }}>Global cap:</span> Total recovered hours capped at {pct(GLOBAL_CAP)}% of entered hours</div>
                      <div><span style={{ color: B.gray400 }}>Category cap:</span> No category exceeds {pct(CAT_CAP)}% recovery</div>
                    </div>
                  </div>
                </Acc>

                <Acc title="Sources">
                  <div style={{ ...txt }}>
                    <p style={{ marginBottom: 8 }}>The recovery rates in this calculator are internal conservative assumptions. They are calibrated below technical maximums reported in the following published research:</p>
                    <p style={{ marginBottom: 8 }}>
                      <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier" target="_blank" rel="noopener noreferrer" style={{ color: B.blue, textDecoration: "underline", textUnderlineOffset: "3px" }}>McKinsey Global Institute, "The Economic Potential of Generative AI" (June 2023)</a>
                      {" "}Estimated that current AI and automation technologies could automate activities absorbing 60–70% of employee time, with the highest potential in data processing and admin work.
                    </p>
                    <p style={{ marginBottom: 8 }}>
                      <a href="https://blog.hubspot.com/sales/hubspot-sales-strategy-report" target="_blank" rel="noopener noreferrer" style={{ color: B.blue, textDecoration: "underline", textUnderlineOffset: "3px" }}>HubSpot, "2024 State of Sales Report"</a>
                      {" "}Found that sales professionals using AI and automation saved approximately two hours per day on manual tasks.
                    </p>
                    <p style={{ marginBottom: 0 }}>
                      <a href="https://zapier.com/blog/state-of-business-automation-2021/" target="_blank" rel="noopener noreferrer" style={{ color: B.blue, textDecoration: "underline", textUnderlineOffset: "3px" }}>Zapier, "2021 State of Business Automation"</a>
                      {" "}Survey of 2,000 U.S. knowledge workers at businesses under 250 employees. Found 94% perform repetitive tasks and 38% use automation for data entry.{" "}
                      <a href="https://zapier.com/resources/guides/automation-for-small-businesses/business-automation" target="_blank" rel="noopener noreferrer" style={{ color: B.blue, textDecoration: "underline", textUnderlineOffset: "3px" }}>Gartner research cited in the same guide</a>
                      {" "}found 30% of full-time accounting work recoverable through automation.
                    </p>
                  </div>
                </Acc>

                <Acc title="Limitations">
                  <div style={{ ...txt }}>
                    <div style={{ marginBottom: 6 }}>Does not account for implementation time, training, or workflow redesign costs</div>
                    <div style={{ marginBottom: 6 }}>Actual results depend on tools selected, process quality, and team commitment</div>
                    <div style={{ marginBottom: 6 }}>Recovery rates are assumptions, not guarantees</div>
                    <div>This is a directional planning estimate. It is not a projection or financial commitment.</div>
                  </div>
                </Acc>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: 12, alignItems: mob ? "stretch" : "center", marginBottom: 20 }}>
                <button onClick={() => { setStep("questions"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{ fontFamily: F, fontSize: 14, fontWeight: 600, padding: "13px 24px", background: B.blue, color: B.white, border: "none", borderRadius: 10, cursor: "pointer", textAlign: "center" }}>
                  Adjust inputs
                </button>
                <a href="/assessment"
                  style={{ fontFamily: F, fontSize: 13, color: B.blue, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px", textAlign: mob ? "center" : "left" }}>
                  Take the AI Readiness Assessment
                </a>
                <span onClick={resetAll}
                  style={{ fontFamily: F, fontSize: 13, color: B.gray500, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px", textAlign: mob ? "center" : "left" }}>
                  Start over
                </span>
              </div>

              <div style={{ paddingTop: 14, borderTop: `1px solid ${B.navyLight}` }}>
                <p style={{ fontFamily: F, fontSize: 11, color: B.gray500, lineHeight: 1.4, marginTop: 0 }}>No data stored. No email required. Provided by Telchar AI as a free planning resource.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
