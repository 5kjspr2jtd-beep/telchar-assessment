import { useState, useEffect, useRef, useCallback } from "react";
import { TELCHAR as P, FONT, SERIF, GOOGLE_FONTS_URL, Diamond, Rule, SecLabel, TYPE, CTA } from "./design/telcharDesign";
import HamburgerMenu from "./components/HamburgerMenu";

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
const DEFAULTS = {
  admin:     { base: 0.28, label: "Admin and Data Entry",  q: "Admin, data entry, invoicing, or scheduling?", min: 0.15, max: 0.45 },
  customer:  { base: 0.22, label: "Customer Follow-up",    q: "Customer follow-up, outreach, or communication?", min: 0.10, max: 0.40 },
  content:   { base: 0.22, label: "Content and Marketing",  q: "Content creation, proposals, or marketing?", min: 0.10, max: 0.40 },
  reporting: { base: 0.32, label: "Reporting and Tracking", q: "Tracking numbers, updating spreadsheets, or putting reports together?", min: 0.15, max: 0.50 },
};
const OPT_BUMP = 0.05;
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

// ── Atmosphere layer ──────────────────────────────────────────────────────────
const ATMOSPHERE = `radial-gradient(ellipse 90% 60% at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(13,22,40,0.4) 40%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 60%, rgba(37,99,235,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 10% 70%, rgba(13,22,40,0.6) 0%, transparent 60%)`;

// ── Glass card style ──────────────────────────────────────────────────────────
const GLASS = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 14,
  backdropFilter: "blur(20px)",
};

// ── Nav logo ──────────────────────────────────────────────────────────────────
function NavLogo() {
  return <img src="/white_decal.svg" alt="Telchar AI" style={{ height: 18, width: "auto", display: "block" }} />;
}

// ── Chip component ────────────────────────────────────────────────────────────
function Chip({ label, selected, onClick, small }) {
  return (
    <button onClick={onClick}
      style={{
        fontFamily: FONT, fontSize: small ? 12 : 13,
        fontWeight: selected ? 600 : 400,
        padding: "10px 8px",
        background: selected ? "rgba(37,99,235,0.15)" : "rgba(255,255,255,0.04)",
        border: selected ? "2px solid rgba(37,99,235,0.4)" : "1px solid rgba(255,255,255,0.09)",
        borderRadius: 8,
        color: selected ? "#ffffff" : "rgba(255,255,255,0.5)",
        cursor: "pointer", transition: "all 0.12s ease",
        display: "flex", alignItems: "center", justifyContent: "center",
        whiteSpace: "nowrap", lineHeight: 1.2, minHeight: 44,
        letterSpacing: selected ? "0.04em" : "0",
        WebkitTapHighlightColor: "transparent", outline: "none",
      }}
    >{label}</button>
  );
}

// ── Question row ─────────────────────────────────────────────────────────────
function QRow({ label, options, value, onChange, cols = 4, hint, mob: isMob }) {
  const mobileCols = cols <= 3 ? cols : 2;
  const effectiveCols = isMob ? mobileCols : cols;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.8)", marginBottom: 10, lineHeight: 1.4 }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${effectiveCols}, 1fr)`, gap: 8 }}>
        {options.map(o => <Chip key={o.label} label={o.label} selected={value === o.label} onClick={() => onChange(o.label)} small={effectiveCols > 4} />)}
      </div>
      {hint && value && <div style={{ fontFamily: FONT, fontSize: 13, color: P.muted, marginTop: 6, lineHeight: 1.35 }}>{hint(value)}</div>}
    </div>
  );
}

// ── Category result row ──────────────────────────────────────────────────────
function CatRow({ label, hLo, hHi, sLo, sHi, rateLo, rateHi, mob }) {
  return (
    <div style={{ padding: mob ? "14px 0" : "16px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: P.dim }}>{label}</div>
        <div style={{ fontFamily: FONT, fontSize: 13, color: P.muted, marginTop: 3 }}>{hLo}–{hHi} hrs/wk at {pct(rateLo)}–{pct(rateHi)}%</div>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#22c55e", whiteSpace: "nowrap" }}>
        ${sLo.toLocaleString()}–${sHi.toLocaleString()}
      </div>
    </div>
  );
}

// ── Accordion ────────────────────────────────────────────────────────────────
function Acc({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "14px 0" }}>
        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: P.dim }}>{title}</span>
        <span style={{ fontFamily: FONT, fontSize: 15, color: P.muted, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}>{"\u25BE"}</span>
      </div>
      {open && <div style={{ paddingBottom: 16 }}>{children}</div>}
    </div>
  );
}

// ── Stepper (Diamond motifs) ─────────────────────────────────────────────────
function Stepper({ current, labels }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28, gap: 0 }}>
      {labels.map((l, i) => (
        <div key={l} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Diamond
              size={12}
              fill={i < current ? P.blue : i === current ? "transparent" : "transparent"}
              stroke={i <= current ? P.blue : P.muted}
              sw={i === current ? 1.5 : 1}
            />
            <span style={{
              fontFamily: FONT, fontSize: 12, fontWeight: 600,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: i <= current ? "#ffffff" : P.muted,
            }}>{l}</span>
          </div>
          {i < labels.length - 1 && (
            <div style={{ width: 32, height: 2, background: i < current ? "#4a80f5" : "rgba(74,128,245,0.25)", margin: "0 10px", borderRadius: 1 }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Rate slider ──────────────────────────────────────────────────────────────
function RateSlider({ label, value, min, max, onChange }) {
  const pctVal = pct(value);
  const pctMin = pct(min);
  const pctMax = pct(max);
  const pos = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: FONT, fontSize: 12, color: P.muted }}>{label}</span>
        <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#ffffff" }}>{pctVal}%</span>
      </div>
      <div style={{ position: "relative", height: 28, display: "flex", alignItems: "center" }}>
        <input type="range" min={pctMin} max={pctMax} value={pctVal}
          onChange={(e) => onChange(parseInt(e.target.value) / 100)}
          style={{ width: "100%", height: 4, appearance: "none", WebkitAppearance: "none", background: `linear-gradient(to right, #2563eb ${pos}%, rgba(255,255,255,0.07) ${pos}%)`, outline: "none", cursor: "pointer", borderRadius: 2 }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT, fontSize: 12, color: P.muted }}>{pctMin}%</span>
        <span style={{ fontFamily: FONT, fontSize: 12, color: P.muted }}>{pctMax}%</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function ROICalculator({ embedded = false }) {
  const [step, setStep] = useState(embedded ? "questions" : "intro");
  const [cost, setCost] = useState(null);
  const [hrs, setHrs] = useState({});
  const [team, setTeam] = useState(null);
  const [toolSpend, setToolSpend] = useState(null);
  const [adopt, setAdopt] = useState(null);
  const [includeToolCost, setIncludeToolCost] = useState(true);
  const [showAdjust, setShowAdjust] = useState(false);
  const [rateOverrides, setRateOverrides] = useState({});
  const [showRateSliders, setShowRateSliders] = useState(false);
  const [estimationMode, setEstimationMode] = useState("conservative");
  const resultsRef = useRef(null);
  const [scrollToResults, setScrollToResults] = useState(false);
  const mob = useMobile();
  const mobBtn = useMobile(480);

  const catKeys = Object.keys(DEFAULTS);
  const hrsReady = cost && catKeys.every(k => hrs[k]);
  const inputCount = (cost ? 1 : 0) + catKeys.filter(k => hrs[k]).length + (team ? 1 : 0) + (adopt ? 1 : 0) + (toolSpend ? 1 : 0);
  const maxInputs = 8;

  const confidenceScore = Math.min(100, Math.round((inputCount / maxInputs) * 70 + (ADOPT_OPTS.find(o => o.label === adopt)?.factor || 0.72) * 30));
  // Confidence label tracks estimation mode — conservative is most reliable
  const modeConfidence = estimationMode === "conservative" ? "Higher" : estimationMode === "balanced" ? "Moderate" : "Lower";
  const confidenceLabel = modeConfidence;
  const modeMult = estimationMode === "conservative" ? 1.0 : estimationMode === "balanced" ? 1.35 : 1.7;

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
    const cMid = (c.low + c.high) / 2;

    let tEntMid = 0;
    catKeys.forEach(k => { const h = HOUR_OPTS.find(o => o.label === hrs[k]); if (h) tEntMid += (h.low + h.high) / 2; });

    let tLo = 0, tHi = 0;
    const bd = [];

    catKeys.forEach(k => {
      const d = DEFAULTS[k];
      const h = HOUR_OPTS.find(o => o.label === hrs[k]);
      if (!h) return;
      const baseRate = getRate(k);
      const rateLo = baseRate;
      const rateHi = Math.min(baseRate + OPT_BUMP, d.max);

      let sLo = h.low * rateLo * af * tf;
      let sHi = h.high * rateHi * af * tf;
      sLo = Math.min(sLo, h.low * CAT_CAP);
      sHi = Math.min(sHi, h.high * CAT_CAP);
      tLo += sLo; tHi += sHi;
      bd.push({ label: d.label, hLo: rH(sLo), hHi: rH(sHi), sLo: r50(sLo * cMid * 52), sHi: r50(sHi * cMid * 52), rateLo, rateHi });
    });

    const gCap = tEntMid * GLOBAL_CAP;
    if (tHi > gCap) { const sc = gCap / tHi; tHi = gCap; bd.forEach(b => { b.hHi = rH(b.hHi * sc); b.sHi = r50(b.sHi * sc); }); }
    if (tLo > gCap) { const sc = gCap / tLo; tLo = gCap; bd.forEach(b => { b.hLo = rH(b.hLo * sc); b.sLo = r50(b.sLo * sc); }); }

    bd.forEach(b => { b.sLo = r50(b.sLo * modeMult); b.sHi = r50(b.sHi * modeMult); });
    const grossLo = r50(tLo * cMid * 52 * modeMult);
    const grossHi = r50(tHi * cMid * 52 * modeMult);
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
  }, [cost, hrs, adopt, team, toolSpend, includeToolCost, hrsReady, getRate, catKeys, modeMult]);

  const results = step === "results" ? compute() : null;
  const txt = { fontFamily: FONT, fontSize: 12, fontWeight: 300, color: P.muted, lineHeight: 1.6, marginTop: 0 };

  const goResults = () => {
    setStep("results");
    setScrollToResults(true);
  };

  useEffect(() => {
    if (scrollToResults && step === "results" && resultsRef.current) {
      const el = resultsRef.current;
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      setScrollToResults(false);
    }
  }, [scrollToResults, step]);
  const resetDefaults = () => { setAdopt("Medium"); setTeam("1–3"); setToolSpend("$0"); setIncludeToolCost(true); setRateOverrides({}); setShowRateSliders(false); };
  const resetAll = () => { setCost(null); setHrs({}); resetDefaults(); setShowAdjust(false); setEstimationMode("conservative"); setStep(embedded ? "questions" : "intro"); if (!embedded) window.scrollTo({ top: 0, behavior: "smooth" }); };

  const confColor = confidenceLabel === "Higher" ? P.green : confidenceLabel === "Moderate" ? P.amber : P.muted;

  // ── Render ──────────────────────────────────────────────────────────────────
  const contentArea = (
    <div style={{ width: "100%", maxWidth: 720, padding: embedded ? 0 : (mob ? "24px 20px 100px" : "100px 32px 64px"), margin: "0 auto" }}>

      {/* ═══ INTRO ═══ */}
      {!embedded && step === "intro" && (
        <div style={{ paddingTop: mob ? 16 : 0 }}>
          {/* Eyebrow */}
          <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.blue2, marginBottom: 16 }}>
            ROI Calculator
          </div>
          <h1 style={{
            fontFamily: FONT,
            fontSize: "clamp(32px,6vw,52px)",
            fontWeight: 300,
            color: "#ffffff",
            marginBottom: 16,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}>
            What is manual work{" "}
            <span style={{ fontFamily: SERIF, fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>
              costing your business?
            </span>
          </h1>
          <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: P.dim, marginBottom: 40, lineHeight: 1.75, maxWidth: 520 }}>
            Answer a few questions about how your team spends time. Get a conservative, transparent estimate of what AI-assisted automation could recover annually.
          </p>

          <button onClick={() => setStep("questions")}
            style={{
              ...CTA.style,
              width: mob ? "100%" : CTA.width,
              minWidth: 240,
            }}>
            Start Calculator
          </button>

          {!mob && <Rule diamond style={{ marginTop: 40, marginBottom: 28 }} />}
          {mob && <div style={{ height: 28 }} />}

          <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.muted, marginTop: 0, lineHeight: 1.5, textAlign: "center" }}>No email required. No data stored. Results update live.</p>
        </div>
      )}

      {/* ═══ QUESTIONS ═══ */}
      {step === "questions" && (
        <>
          <Stepper current={0} labels={["Inputs", "Results"]} />

          {/* Eyebrow */}
          <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.blue2, marginBottom: 12 }}>
            ROI Calculator
          </div>
          <h1 style={{
            fontFamily: FONT,
            fontSize: "clamp(32px,6vw,52px)",
            fontWeight: 300,
            color: "#ffffff",
            marginBottom: 8,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}>
            What is manual work{" "}
            <span style={{ fontFamily: SERIF, fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>
              costing your business?
            </span>
          </h1>
          <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: P.dim, marginBottom: 32, lineHeight: 1.6 }}>
            Answer a few questions about how your team spends time.
          </p>

          {/* Input panel — glass card */}
          <div style={{
            ...GLASS,
            borderRadius: 16,
            padding: mob ? "24px 20px 20px" : "32px 32px 24px",
            marginBottom: 24,
          }}>
            {/* Sub-section label */}
            <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, marginBottom: 16 }}>
              Your time
            </div>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.8)", marginBottom: 4, lineHeight: 1.5 }}>
              About how many total hours per week does your business spend on the activities below?
            </div>
            <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.muted, marginBottom: 24, lineHeight: 1.35 }}>
              Estimate across the whole business, not just you.
            </div>

            {catKeys.map(k => <QRow key={k} label={DEFAULTS[k].q} options={HOUR_OPTS} value={hrs[k]} onChange={v => setHrs(p => ({ ...p, [k]: v }))} mob={mob} />)}

            <div style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.8)", marginBottom: 4, lineHeight: 1.4 }}>
                On average, what do you pay per hour for the people doing this work?
              </div>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.muted, marginBottom: 10, lineHeight: 1.35 }}>
                Estimate the average hourly cost across everyone who handles these tasks.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${mob ? 2 : 4}, 1fr)`, gap: 8 }}>
                {COST_OPTS.map(o => <Chip key={o.label} label={o.label} selected={cost === o.label} onClick={() => setCost(o.label)} />)}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 24 }} />

            {/* Sub-section label */}
            <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, marginBottom: 16 }}>
              Context
            </div>
            <QRow label="How many people do this work?" options={TEAM_OPTS} value={team} onChange={setTeam} cols={5} mob={mob} />
            <QRow label="What do you spend per month on software that helps automate this work?" options={TOOL_OPTS} value={toolSpend} onChange={setToolSpend} cols={5} mob={mob} />
            <QRow label="How ready is your team to use new tools?" options={ADOPT_OPTS} value={adopt} onChange={setAdopt} cols={3} mob={mob}
              hint={(v) => ADOPT_OPTS.find(o => o.label === v)?.desc || ""} />

            {!mob && (
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 8 }}>
                <button onClick={goResults} disabled={!hrsReady}
                  style={{
                    ...CTA.style,
                    minWidth: 240,
                    background: hrsReady ? P.blue : "rgba(255,255,255,0.1)",
                    cursor: hrsReady ? "pointer" : "default",
                    opacity: hrsReady ? 1 : 0.4,
                  }}>
                  Calculate ROI
                </button>
                {!embedded && <span onClick={() => setStep("intro")} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: P.muted, cursor: "pointer" }}>Back</span>}
              </div>
            )}
          </div>

          {mob && (
            <div style={{ position: embedded ? "sticky" : "fixed", bottom: 0, left: 0, right: 0, padding: "10px 16px", background: "rgba(8,15,30,0.95)", borderTop: "1px solid rgba(255,255,255,0.07)", zIndex: 100, backdropFilter: "blur(20px)" }}>
              <button onClick={goResults} disabled={!hrsReady}
                style={{
                  ...CTA.style,
                  width: "100%",
                  margin: 0,
                  background: hrsReady ? P.blue : "rgba(255,255,255,0.1)",
                  cursor: hrsReady ? "pointer" : "default",
                  opacity: hrsReady ? 1 : 0.4,
                }}>
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

          {/* Estimation mode toggle */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, marginBottom: 8 }}>Estimation mode</div>
            <div style={{ display: "flex", gap: 0 }}>
              {["conservative", "balanced", "aggressive"].map((mode) => {
                const isActive = estimationMode === mode;
                return (
                  <button key={mode} onClick={() => setEstimationMode(mode)}
                    style={{
                      fontFamily: FONT, fontSize: 12, fontWeight: isActive ? 600 : 400,
                      padding: "10px 16px", cursor: "pointer",
                      background: isActive ? "rgba(37,99,235,0.15)" : "rgba(255,255,255,0.04)",
                      border: isActive ? "2px solid rgba(37,99,235,0.4)" : "1px solid rgba(255,255,255,0.09)",
                      borderRadius: 8,
                      color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                      textTransform: "capitalize",
                      outline: "none", WebkitTapHighlightColor: "transparent",
                      minHeight: 44,
                      marginRight: 8,
                    }}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hero savings card */}
          <div style={{ ...GLASS, borderRadius: 16, padding: mob ? "24px 20px" : "32px 32px", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.blue2 }}>
                {estimationMode.charAt(0).toUpperCase() + estimationMode.slice(1)} estimate
              </div>
              <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: confColor, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 4, padding: "2px 8px" }}>
                {confidenceLabel} confidence
              </div>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: P.muted, marginBottom: 20 }}>
              Based on {inputCount} of {maxInputs} inputs provided and {adopt} adoption readiness
            </div>

            <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, marginBottom: 8 }}>
              {includeToolCost && results.annToolCost > 0 ? "Estimated Net Annual Savings" : "Estimated Annual Savings"}
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: "clamp(36px,7vw,56px)", color: "#2563eb", lineHeight: 1, letterSpacing: "-0.04em" }}>
              {includeToolCost && results.annToolCost > 0
                ? (results.netHi <= 0 ? "No net savings" : `$${Math.max(0, results.netLo).toLocaleString()}–$${results.netHi.toLocaleString()}`)
                : `$${results.grossLo.toLocaleString()}–$${results.grossHi.toLocaleString()}`
              }
            </div>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: P.dim, marginTop: 10 }}>
              {results.wkLo}–{results.wkHi} hours recovered per week
            </div>

            {/* Sub-stats grid */}
            <div style={{ display: "flex", marginTop: 24, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                ["Gross savings", `$${results.grossLo.toLocaleString()}–$${results.grossHi.toLocaleString()}`],
                ...(includeToolCost && results.annToolCost > 0 ? [["Tool cost", `$${results.annToolCost.toLocaleString()}/yr`]] : []),
                ...(results.payback !== null && includeToolCost ? [["Payback", pl(results.payback, "month")]] : []),
              ].map(([label, val], i, arr) => (
                <div key={label} style={{ paddingRight: i < arr.length - 1 ? 20 : 0, paddingLeft: i > 0 ? 20 : 0, borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                  <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#ffffff" }}>{val}</div>
                </div>
              ))}
            </div>

            {includeToolCost && results.annToolCost > 0 && results.netHi <= 0 && (
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.muted, marginTop: 12 }}>No payback under these assumptions</div>
            )}
            {results.annToolCost === 0 && (
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.muted, marginTop: 12 }}>Most teams add tooling as they scale. Adjust below to model costs.</div>
            )}
          </div>

          <Rule diamond style={{ marginBottom: 24 }} />

          {/* Category breakdown */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, marginBottom: 16 }}>
              Savings by category
            </div>
            {results.bd.map((r, i) => <CatRow key={i} {...r} mob={mob} />)}
          </div>

          {/* Inputs summary — glass card */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: mob ? "16px 18px" : "20px 24px", marginBottom: 16 }}>
            <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, marginBottom: 12 }}>
              Your inputs
            </div>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? "4px 0" : "4px 24px" }}>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.dim, lineHeight: 1.8 }}><span style={{ color: P.muted }}>Labor cost:</span> {results.costLabel}/hr</div>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.dim, lineHeight: 1.8 }}><span style={{ color: P.muted }}>Team size:</span> {team} employees</div>
              {catKeys.map(k => <div key={k} style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.dim, lineHeight: 1.8 }}><span style={{ color: P.muted }}>{DEFAULTS[k].label}:</span> {hrs[k]}</div>)}
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.dim, lineHeight: 1.8 }}><span style={{ color: P.muted }}>Adoption:</span> {adopt} ({pct(results.af)}%)</div>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.dim, lineHeight: 1.8 }}><span style={{ color: P.muted }}>Tool spend:</span> {toolSpend}/mo</div>
            </div>
          </div>

          {/* Adjust assumptions — glass card accordion */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
            <div onClick={() => setShowAdjust(!showAdjust)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: mob ? "14px 18px" : "14px 22px" }}>
              <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: P.dim }}>Adjust assumptions</span>
              <span style={{ fontFamily: FONT, fontSize: 15, color: P.muted, transform: showAdjust ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}>{"\u25BE"}</span>
            </div>
            {showAdjust && (
              <div style={{ padding: `0 ${mob ? "18px" : "22px"} 18px` }}>
                <QRow label="Adoption readiness" options={ADOPT_OPTS} value={adopt} onChange={setAdopt} cols={3} mob={mob}
                  hint={(v) => ADOPT_OPTS.find(o => o.label === v)?.desc || ""} />
                <QRow label="Employees on these workflows" options={TEAM_OPTS} value={team} onChange={setTeam} cols={5} mob={mob} />
                <QRow label="Monthly tool spend" options={TOOL_OPTS} value={toolSpend} onChange={setToolSpend} cols={5} mob={mob} />

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div onClick={() => setIncludeToolCost(!includeToolCost)}
                    style={{ width: 18, height: 18, border: `1.5px solid ${includeToolCost ? P.blue : P.muted}`, borderRadius: 3, background: includeToolCost ? P.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, color: "#fff", flexShrink: 0 }}>
                    {includeToolCost ? "\u2713" : ""}
                  </div>
                  <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: P.dim, cursor: "pointer" }} onClick={() => setIncludeToolCost(!includeToolCost)}>Subtract tool cost from savings</span>
                </div>

                {/* Rate adjustment */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, marginTop: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: P.dim }}>Tune time savings assumptions</span>
                    <div onClick={() => setShowRateSliders(!showRateSliders)} style={{ width: 36, height: 20, background: showRateSliders ? P.blue : "rgba(255,255,255,0.07)", border: `1px solid ${showRateSliders ? P.blue : "rgba(255,255,255,0.09)"}`, borderRadius: 10, position: "relative", cursor: "pointer", transition: "all 0.15s ease" }}>
                      <div style={{ width: 16, height: 16, background: showRateSliders ? "#fff" : "rgba(255,255,255,0.4)", borderRadius: "50%", position: "absolute", top: 1, left: showRateSliders ? 18 : 1, transition: "left 0.15s ease" }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.muted, lineHeight: 1.4, marginBottom: showRateSliders ? 10 : 0 }}>
                    {showRateSliders
                      ? "How much of this work AI can realistically take off your plate."
                      : "Conservative defaults are applied. Toggle on to customize per category."
                    }
                  </div>
                  {showRateSliders && catKeys.map(k => (
                    <RateSlider key={k} label={DEFAULTS[k].label} value={getRate(k)} min={DEFAULTS[k].min} max={DEFAULTS[k].max}
                      onChange={(v) => setRateOverrides(p => ({ ...p, [k]: v }))} />
                  ))}
                </div>

                <div style={{ marginTop: 12 }}>
                  <span onClick={resetDefaults} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: P.blue, cursor: "pointer", borderBottom: `1px solid ${P.blueglow}`, paddingBottom: 1 }}>Reset to defaults</span>
                </div>
              </div>
            )}
          </div>

          {/* How we calculate this */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, marginBottom: 28, overflow: "hidden" }}>
            <div style={{ padding: mob ? "0 18px" : "0 22px" }}>
              <Acc title="How we calculate this" defaultOpen={false}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: P.dim, marginBottom: 8 }}>Formula</div>
                  <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.dim, lineHeight: 1.6 }}>
                    <div>Recovered Hrs = Entered Hrs × Rate × Adoption × Team Factor</div>
                    <div>Annual Savings = Recovered Hrs/Wk × Cost/Hr × 52</div>
                    <div>Net Savings = Gross Savings − Annual Tool Cost</div>
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: P.dim, marginBottom: 8 }}>Expected time savings by category</div>
                  <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: P.muted, lineHeight: 1.7 }}>
                    {catKeys.map(k => {
                      const d = DEFAULTS[k];
                      const r = getRate(k);
                      const isOverride = rateOverrides[k] !== undefined;
                      return <div key={k}>{d.label}: {pct(r)}%–{pct(Math.min(r + OPT_BUMP, d.max))}% of entered hours{isOverride ? " (custom)" : " (default)"}</div>;
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: P.dim, marginBottom: 8 }}>Input definitions</div>
                  <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: P.muted, lineHeight: 1.7 }}>
                    <div><span style={{ color: P.dim }}>Hourly cost:</span> Fully loaded (salary + benefits + overhead)</div>
                    <div><span style={{ color: P.dim }}>Hours:</span> Weekly team hours on each task category</div>
                    <div><span style={{ color: P.dim }}>Adoption:</span> Multiplier for organizational readiness ({adopt}: {pct(results.af)}%)</div>
                    <div><span style={{ color: P.dim }}>Team factor:</span> Coordination discount for larger teams ({team}: {pct(results.tf)}%)</div>
                    <div><span style={{ color: P.dim }}>Global cap:</span> Total recovered hours capped at {pct(GLOBAL_CAP)}% of entered hours</div>
                    <div><span style={{ color: P.dim }}>Category cap:</span> No category exceeds {pct(CAT_CAP)}% recovery</div>
                  </div>
                </div>
              </Acc>

              <Acc title="Sources">
                <div style={{ ...txt }}>
                  <p style={{ marginBottom: 8, fontWeight: 300 }}>The recovery rates in this calculator are internal conservative assumptions. They are calibrated below technical maximums reported in the following published research:</p>
                  <p style={{ marginBottom: 8 }}>
                    <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier" target="_blank" rel="noopener noreferrer" style={{ color: P.blue, borderBottom: `1px solid ${P.blueglow}`, textDecoration: "none", paddingBottom: 1 }}>McKinsey Global Institute, "The Economic Potential of Generative AI" (June 2023)</a>
                    {" "}— Estimated that current AI and automation technologies could automate activities absorbing 60–70% of employee time.
                  </p>
                  <p style={{ marginBottom: 8 }}>
                    <a href="https://blog.hubspot.com/sales/hubspot-sales-strategy-report" target="_blank" rel="noopener noreferrer" style={{ color: P.blue, borderBottom: `1px solid ${P.blueglow}`, textDecoration: "none", paddingBottom: 1 }}>HubSpot, "2024 State of Sales Report"</a>
                    {" "}— Found that sales professionals using AI saved approximately two hours per day on manual tasks.
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    <a href="https://zapier.com/blog/state-of-business-automation-2021/" target="_blank" rel="noopener noreferrer" style={{ color: P.blue, borderBottom: `1px solid ${P.blueglow}`, textDecoration: "none", paddingBottom: 1 }}>Zapier, "2021 State of Business Automation"</a>
                    {" "}— 94% of workers perform repetitive tasks; 30% of full-time accounting work recoverable through automation.
                  </p>
                </div>
              </Acc>

              <Acc title="Limitations">
                <div style={{ ...txt }}>
                  {[
                    "Does not account for implementation time, training, or workflow redesign costs",
                    "Actual results depend on tools selected, process quality, and team commitment",
                    "Recovery rates are assumptions, not guarantees",
                    "This is a directional planning estimate. It is not a projection or financial commitment.",
                  ].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < 3 ? 6 : 0 }}>
                      <Diamond size={6} fill={P.muted} stroke="none" sw={0} style={{ marginTop: 4, flexShrink: 0 }} />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </Acc>
            </div>
          </div>

          {/* Actions — CTA centered */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <button onClick={() => { setStep("questions"); if (!embedded) window.scrollTo({ top: 0, behavior: "smooth" }); }}
              style={{
                ...CTA.style,
                width: mob ? "100%" : "auto",
                minWidth: 240,
              }}>
              Adjust inputs
            </button>
            <a href="/assessment"
              style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: P.blue, cursor: "pointer", borderBottom: `1px solid ${P.blueglow}`, textDecoration: "none", paddingBottom: 1, textAlign: "center" }}>
              Take the AI Readiness Diagnostic
            </a>
            <span onClick={resetAll}
              style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: P.muted, cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 1, textAlign: "center" }}>
              Start over
            </span>
          </div>

          {/* Footer note */}
          <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: P.muted, lineHeight: 1.5 }}>No data stored. No email required. Provided by Telchar AI as a free planning resource.</p>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) return (
    <div style={{ background: "#080f1e", position: "relative", overflow: "hidden" }}>
      {/* Atmosphere */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: ATMOSPHERE }} />
      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.025,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />
      <div style={{ position: "relative", zIndex: 10 }}>{contentArea}</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080f1e", fontFamily: FONT, overflowX: "hidden", width: "100%", position: "relative" }}>
      <style>{`
        @import url('${GOOGLE_FONTS_URL}');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{overflow-x:hidden;max-width:100vw;background:#080f1e;}
        button{font-family:inherit;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;background:#2563eb;border-radius:50%;cursor:pointer;border:none;}
        input[type=range]::-moz-range-thumb{width:14px;height:14px;background:#2563eb;border-radius:50%;border:none;cursor:pointer;}
        input[type=range]{border-radius:2px;}
      `}</style>

      {/* Atmosphere */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: ATMOSPHERE, pointerEvents: "none", zIndex: 0 }} />
      {/* Grid overlay */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: "none", opacity: 0.025,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />

      {/* Fixed glass nav */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 36px", height: 64,
        background: "rgba(8,15,30,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <NavLogo />
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.12)", marginLeft: 4 }} />
          <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 400, color: P.dim }}>ROI Calculator</span>
          <span style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "3px 8px",
            background: "rgba(255,255,255,0.04)",
            color: P.dim,
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 4,
          }}>Beta</span>
        </div>
        <HamburgerMenu currentPage="ROI Calculator" />
      </div>

      {/* Content area */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "center", overflowX: "hidden" }}>
        {contentArea}
      </div>
    </div>
  );
}
