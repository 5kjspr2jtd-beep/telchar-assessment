import { useState, useEffect, useRef, useCallback } from "react";
import { TELCHAR as P, FONT, MONO, GOOGLE_FONTS_URL, Diamond, Rule, SecLabel, TEXT, NAVY_TEXT, TYPE, CTA, OPTION_CARD } from "./design/telcharDesign";

// Anvil logo mark
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

// ── Chip (matches PDF tier tab pattern) ──────────────────────────────────────
function Chip({ label, selected, onClick, small }) {
  return (
    <button onClick={onClick}
      style={{
        fontFamily: FONT, fontSize: small ? 12 : 13, fontWeight: selected ? 600 : 400,
        padding: "10px 8px",
        background: selected ? P.goldFaint : "transparent",
        border: selected ? `2px solid ${P.gold}` : "1px solid #D6CCB8",
        borderLeft: selected ? `3px solid ${P.gold}` : "1px solid #D6CCB8",
        color: selected ? P.ink : P.inkMid,
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
      <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: P.inkMid, marginBottom: 10, lineHeight: 1.4 }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${effectiveCols}, 1fr)`, gap: 8 }}>
        {options.map(o => <Chip key={o.label} label={o.label} selected={value === o.label} onClick={() => onChange(o.label)} small={effectiveCols > 4} />)}
      </div>
      {hint && value && <div style={{ fontFamily: FONT, fontSize: 13, color: P.inkLight, marginTop: 6, lineHeight: 1.35 }}>{hint(value)}</div>}
    </div>
  );
}

// ── Category result row ─────────────────────────────────────────────────────
function CatRow({ label, hLo, hHi, sLo, sHi, rateLo, rateHi, mob }) {
  return (
    <div style={{ padding: mob ? "14px 0" : "16px 0", borderBottom: `1px solid ${P.paperRule}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
        <div>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: P.ink }}>{label}</div>
          <div style={{ fontFamily: FONT, fontSize: 13, color: P.inkLight, marginTop: 3 }}>{hLo}–{hHi} hrs/wk at {pct(rateLo)}–{pct(rateHi)}%</div>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: P.green, whiteSpace: "nowrap" }}>
          ${sLo.toLocaleString()}–${sHi.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// ── Accordion ────────────────────────────────────────────────────────────────
function Acc({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${P.paperRule}` }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "14px 0" }}>
        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: P.inkMid }}>{title}</span>
        <span style={{ fontFamily: FONT, fontSize: 15, color: P.inkLight, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}>{"\u25BE"}</span>
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
              fill={i <= current ? P.gold : "transparent"}
              stroke={i <= current ? P.goldLight : P.inkFaint}
              sw={1.5}
            />
            <span style={{
              fontFamily: FONT, fontSize: 12, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: i <= current ? P.gold : P.inkFaint,
            }}>{l}</span>
          </div>
          {i < labels.length - 1 && (
            <div style={{ width: 32, height: 1, background: i < current ? P.goldLight : P.paperRule, margin: "0 10px" }} />
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
        <span style={{ fontFamily: FONT, fontSize: 12, color: P.inkLight }}>{label}</span>
        <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: P.ink }}>{pctVal}%</span>
      </div>
      <div style={{ position: "relative", height: 28, display: "flex", alignItems: "center" }}>
        <input type="range" min={pctMin} max={pctMax} value={pctVal}
          onChange={(e) => onChange(parseInt(e.target.value) / 100)}
          style={{ width: "100%", height: 4, appearance: "none", WebkitAppearance: "none", background: `linear-gradient(to right, ${P.gold} ${pos}%, ${P.paperRule} ${pos}%)`, outline: "none", cursor: "pointer" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT, fontSize: 12, color: P.inkFaint }}>{pctMin}%</span>
        <span style={{ fontFamily: FONT, fontSize: 12, color: P.inkFaint }}>{pctMax}%</span>
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
  const txt = { fontFamily: FONT, fontSize: 12, color: P.inkLight, lineHeight: 1.6, marginTop: 0 };

  const goResults = () => {
    setStep("results");
    if (!embedded) window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const resetDefaults = () => { setAdopt("Medium"); setTeam("1–3"); setToolSpend("$0"); setIncludeToolCost(true); setRateOverrides({}); setShowRateSliders(false); };
  const resetAll = () => { setCost(null); setHrs({}); resetDefaults(); setShowAdjust(false); setEstimationMode("conservative"); setStep(embedded ? "questions" : "intro"); if (!embedded) window.scrollTo({ top: 0, behavior: "smooth" }); };

  const confColor = confidenceLabel === "Higher" ? P.green : confidenceLabel === "Moderate" ? P.amber : P.inkLight;

  // ── Render ──────────────────────────────────────────────────────────────────
  const contentArea = (
    <div style={{ width: "100%", maxWidth: 680, padding: embedded ? 0 : (mob ? "24px 20px 100px" : "44px 36px 48px"), margin: "0 auto" }}>

      {/* ═══ INTRO ═══ */}
      {!embedded && step === "intro" && (
            <div style={{ paddingTop: mob ? 16 : 32 }}>
              <SecLabel>ROI Calculator</SecLabel>
              <h1 style={{ fontFamily: FONT, fontSize: mob ? 24 : 32, fontWeight: 700, color: P.ink, marginBottom: 12, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                What is manual work costing your business?
              </h1>
              <p style={{ fontFamily: FONT, fontSize: 15, color: P.inkMid, marginBottom: 32, lineHeight: 1.75, maxWidth: 520 }}>
                Answer a few questions about how your team spends time. Get a conservative, transparent estimate of what AI-assisted automation could recover annually.
              </p>

              <button onClick={() => setStep("questions")}
                style={{
                  ...CTA.style,
                  width: mob ? "100%" : CTA.width,
                }}>
                Start Calculator
              </button>

              {!mob && <Rule diamond style={{ marginTop: 36, marginBottom: 28 }} />}
              {mob && <div style={{ height: 28 }} />}

              <p style={{ fontFamily: FONT, fontSize: 13, color: P.inkFaint, marginTop: 0, lineHeight: 1.5 }}>No email required. No data stored. Results update live.</p>
            </div>
          )}

          {/* ═══ QUESTIONS ═══ */}
          {step === "questions" && (
            <>
              <Stepper current={0} labels={["Inputs", "Results"]} />

              <div style={{ background: P.paperShade, borderLeft: `3px solid ${P.goldLight}`, padding: mob ? "20px 18px" : "24px 28px", marginBottom: 24 }}>
                <SecLabel>Your time</SecLabel>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: P.inkMid, marginBottom: 4, lineHeight: 1.5 }}>
                  About how many total hours per week does your business spend on the activities below?
                </div>
                <div style={{ fontFamily: FONT, fontSize: 13, color: P.inkLight, marginBottom: 18, lineHeight: 1.35 }}>
                  Estimate across the whole business, not just you.
                </div>

                {catKeys.map(k => <QRow key={k} label={DEFAULTS[k].q} options={HOUR_OPTS} value={hrs[k]} onChange={v => setHrs(p => ({ ...p, [k]: v }))} mob={mob} />)}

                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: P.inkMid, marginBottom: 4, lineHeight: 1.4 }}>
                    On average, what do you pay per hour for the people doing this work?
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 13, color: P.inkLight, marginBottom: 10, lineHeight: 1.35 }}>
                    Estimate the average hourly cost across everyone who handles these tasks.
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${mob ? 2 : 4}, 1fr)`, gap: 8 }}>
                    {COST_OPTS.map(o => <Chip key={o.label} label={o.label} selected={cost === o.label} onClick={() => setCost(o.label)} />)}
                  </div>
                </div>

                <Rule style={{ marginBottom: 18 }} />
                <SecLabel>Context</SecLabel>
                <QRow label="How many people do this work?" options={TEAM_OPTS} value={team} onChange={setTeam} cols={5} mob={mob} />
                <QRow label="What do you spend per month on software that helps automate this work?" options={TOOL_OPTS} value={toolSpend} onChange={setToolSpend} cols={5} mob={mob} />
                <QRow label="How ready is your team to use new tools?" options={ADOPT_OPTS} value={adopt} onChange={setAdopt} cols={3} mob={mob}
                  hint={(v) => ADOPT_OPTS.find(o => o.label === v)?.desc || ""} />

                {!mob && (
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 8 }}>
                    <button onClick={goResults} disabled={!hrsReady}
                      style={{
                        ...CTA.style,
                        background: hrsReady ? P.gold : P.inkFaint,
                        cursor: hrsReady ? "pointer" : "default",
                        opacity: hrsReady ? 1 : 0.4,
                      }}>
                      Calculate ROI
                    </button>
                    {!embedded && <span onClick={() => setStep("intro")} style={{ fontFamily: FONT, fontSize: 12, color: P.inkLight, cursor: "pointer" }}>Back</span>}
                  </div>
                )}
              </div>

              {mob && (
                <div style={{ position: embedded ? "sticky" : "fixed", bottom: 0, left: 0, right: 0, padding: "10px 16px", background: P.navy, borderTop: `1px solid ${P.navyFaint}`, zIndex: 100 }}>
                  <button onClick={goResults} disabled={!hrsReady}
                    style={{
                      ...CTA.style,
                      width: "100%",
                      margin: 0,
                      background: hrsReady ? P.gold : P.inkFaint,
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
                <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: P.inkFaint, marginBottom: 8 }}>Estimation mode</div>
                <div style={{ display: "flex", gap: 0 }}>
                  {["conservative", "balanced", "aggressive"].map((mode) => {
                    const isActive = estimationMode === mode;
                    return (
                      <button key={mode} onClick={() => setEstimationMode(mode)}
                        style={{
                          fontFamily: FONT, fontSize: 12, fontWeight: isActive ? 600 : 400,
                          padding: "8px 16px", cursor: "pointer",
                          background: isActive ? P.goldFaint : "transparent",
                          border: isActive ? `2px solid ${P.gold}` : "1px solid #D6CCB8",
                          borderLeft: isActive ? `3px solid ${P.gold}` : "1px solid #D6CCB8",
                          color: P.ink,
                          textTransform: "capitalize",
                          outline: "none", WebkitTapHighlightColor: "transparent",
                        }}>
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hero — matches PDF Score Summary structure */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <SecLabel style={{ marginBottom: 0 }}>{estimationMode.charAt(0).toUpperCase() + estimationMode.slice(1)} estimate</SecLabel>
                  <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: P.inkMid, background: P.paperShade, borderLeft: `3px solid ${confColor}`, paddingLeft: 8, padding: "3px 10px 3px 8px" }}>
                    {confidenceLabel} confidence
                  </div>
                </div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: P.inkFaint, marginBottom: 16 }}>
                  Based on {inputCount} of {maxInputs} inputs provided and {adopt} adoption readiness
                </div>

                <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: P.inkFaint, marginBottom: 6 }}>
                  {includeToolCost && results.annToolCost > 0 ? "Estimated Net Annual Savings" : "Estimated Annual Savings"}
                </div>
                <div style={{ fontFamily: FONT, fontSize: mob ? 32 : 48, fontWeight: 700, color: P.gold, lineHeight: 1, letterSpacing: "-0.04em" }}>
                  {includeToolCost && results.annToolCost > 0
                    ? (results.netHi <= 0 ? "No net savings" : `$${Math.max(0, results.netLo).toLocaleString()}–$${results.netHi.toLocaleString()}`)
                    : `$${results.grossLo.toLocaleString()}–$${results.grossHi.toLocaleString()}`
                  }
                </div>
                <div style={{ fontFamily: FONT, fontSize: 15, color: P.inkMid, marginTop: 10 }}>
                  {results.wkLo}–{results.wkHi} hours recovered per week
                </div>

                {/* Sub-stats grid — PDF benchmark comparison pattern */}
                <div style={{ display: "flex", marginTop: 24, paddingTop: 18, borderTop: `1px solid ${P.paperRule}` }}>
                  {[
                    ["Gross savings", `$${results.grossLo.toLocaleString()}–$${results.grossHi.toLocaleString()}`],
                    ...(includeToolCost && results.annToolCost > 0 ? [["Tool cost", `$${results.annToolCost.toLocaleString()}/yr`]] : []),
                    ...(results.payback !== null && includeToolCost ? [["Payback", pl(results.payback, "month")]] : []),
                  ].map(([label, val], i, arr) => (
                    <div key={label} style={{ paddingRight: i < arr.length - 1 ? 20 : 0, paddingLeft: i > 0 ? 20 : 0, borderRight: i < arr.length - 1 ? `1px solid ${P.paperRule}` : "none" }}>
                      <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: P.inkFaint, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: P.ink }}>{val}</div>
                    </div>
                  ))}
                </div>

                {includeToolCost && results.annToolCost > 0 && results.netHi <= 0 && (
                  <div style={{ fontFamily: FONT, fontSize: 13, color: P.inkFaint, marginTop: 12 }}>No payback under these assumptions</div>
                )}
                {results.annToolCost === 0 && (
                  <div style={{ fontFamily: FONT, fontSize: 13, color: P.inkFaint, marginTop: 12 }}>Most teams add tooling as they scale. Adjust below to model costs.</div>
                )}
              </div>

              <Rule diamond style={{ marginBottom: 24 }} />

              {/* Category breakdown */}
              <div style={{ marginBottom: 24 }}>
                <SecLabel>Savings by category</SecLabel>
                {results.bd.map((r, i) => <CatRow key={i} {...r} mob={mob} />)}
              </div>

              {/* Inputs summary — accent block */}
              <div style={{ background: P.paperShade, borderLeft: `3px solid ${P.goldLight}`, padding: mob ? "16px 18px" : "18px 22px", marginBottom: 16 }}>
                <SecLabel>Your inputs</SecLabel>
                <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? "2px 0" : "2px 24px", fontFamily: FONT, fontSize: 12, color: P.inkMid, lineHeight: 1.8 }}>
                  <div><span style={{ color: P.inkLight }}>Labor cost:</span> {results.costLabel}/hr</div>
                  <div><span style={{ color: P.inkLight }}>Team size:</span> {team} employees</div>
                  {catKeys.map(k => <div key={k}><span style={{ color: P.inkLight }}>{DEFAULTS[k].label}:</span> {hrs[k]}</div>)}
                  <div><span style={{ color: P.inkLight }}>Adoption:</span> {adopt} ({pct(results.af)}%)</div>
                  <div><span style={{ color: P.inkLight }}>Tool spend:</span> {toolSpend}/mo</div>
                </div>
              </div>

              {/* ── Adjust assumptions ── */}
              <div style={{ background: P.paperShade, borderLeft: `3px solid ${P.paperRule}`, marginBottom: 16, overflow: "hidden" }}>
                <div onClick={() => setShowAdjust(!showAdjust)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: mob ? "14px 18px" : "14px 22px" }}>
                  <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: P.inkMid }}>Adjust assumptions</span>
                  <span style={{ fontFamily: FONT, fontSize: 15, color: P.inkLight, transform: showAdjust ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}>{"\u25BE"}</span>
                </div>
                {showAdjust && (
                  <div style={{ padding: `0 ${mob ? "18px" : "22px"} 18px` }}>
                    <QRow label="Adoption readiness" options={ADOPT_OPTS} value={adopt} onChange={setAdopt} cols={3} mob={mob}
                      hint={(v) => ADOPT_OPTS.find(o => o.label === v)?.desc || ""} />
                    <QRow label="Employees on these workflows" options={TEAM_OPTS} value={team} onChange={setTeam} cols={5} mob={mob} />
                    <QRow label="Monthly tool spend" options={TOOL_OPTS} value={toolSpend} onChange={setToolSpend} cols={5} mob={mob} />

                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <div onClick={() => setIncludeToolCost(!includeToolCost)}
                        style={{ width: 18, height: 18, border: `1.5px solid ${includeToolCost ? P.gold : P.inkFaint}`, background: includeToolCost ? P.gold : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, color: "#fff", flexShrink: 0 }}>
                        {includeToolCost ? "\u2713" : ""}
                      </div>
                      <span style={{ fontFamily: FONT, fontSize: 12, color: P.inkMid, cursor: "pointer" }} onClick={() => setIncludeToolCost(!includeToolCost)}>Subtract tool cost from savings</span>
                    </div>

                    {/* Rate adjustment */}
                    <div style={{ borderTop: `1px solid ${P.paperRule}`, paddingTop: 14, marginTop: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontFamily: FONT, fontSize: 12, color: P.inkMid }}>Tune time savings assumptions</span>
                        <div onClick={() => setShowRateSliders(!showRateSliders)} style={{ width: 36, height: 20, background: showRateSliders ? P.gold : P.paperRule, border: `1px solid ${showRateSliders ? P.gold : P.inkFaint}`, position: "relative", cursor: "pointer", transition: "all 0.15s ease" }}>
                          <div style={{ width: 16, height: 16, background: showRateSliders ? "#fff" : P.paper, position: "absolute", top: 1, left: showRateSliders ? 18 : 1, transition: "left 0.15s ease" }} />
                        </div>
                      </div>
                      <div style={{ fontFamily: FONT, fontSize: 13, color: P.inkLight, lineHeight: 1.4, marginBottom: showRateSliders ? 10 : 0 }}>
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
                      <span onClick={resetDefaults} style={{ fontFamily: FONT, fontSize: 12, color: P.gold, cursor: "pointer", borderBottom: `1px solid ${P.goldFaint}`, paddingBottom: 1 }}>Reset to defaults</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── How we calculate this ── */}
              <div style={{ marginBottom: 20 }}>
                <Acc title="How we calculate this" defaultOpen={false}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: P.inkMid, marginBottom: 8 }}>Formula</div>
                    <div style={{ fontFamily: MONO, fontSize: 13, color: P.inkMid, lineHeight: 1.6 }}>
                      <div>Recovered Hrs = Entered Hrs × Rate × Adoption × Team Factor</div>
                      <div>Annual Savings = Recovered Hrs/Wk × Cost/Hr × 52</div>
                      <div>Net Savings = Gross Savings − Annual Tool Cost</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: P.inkMid, marginBottom: 8 }}>Expected time savings by category</div>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: P.inkLight, lineHeight: 1.7 }}>
                      {catKeys.map(k => {
                        const d = DEFAULTS[k];
                        const r = getRate(k);
                        const isOverride = rateOverrides[k] !== undefined;
                        return <div key={k}>{d.label}: {pct(r)}%–{pct(Math.min(r + OPT_BUMP, d.max))}% of entered hours{isOverride ? " (custom)" : " (default)"}</div>;
                      })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: P.inkMid, marginBottom: 8 }}>Input definitions</div>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: P.inkLight, lineHeight: 1.7 }}>
                      <div><span style={{ color: P.inkMid }}>Hourly cost:</span> Fully loaded (salary + benefits + overhead)</div>
                      <div><span style={{ color: P.inkMid }}>Hours:</span> Weekly team hours on each task category</div>
                      <div><span style={{ color: P.inkMid }}>Adoption:</span> Multiplier for organizational readiness ({adopt}: {pct(results.af)}%)</div>
                      <div><span style={{ color: P.inkMid }}>Team factor:</span> Coordination discount for larger teams ({team}: {pct(results.tf)}%)</div>
                      <div><span style={{ color: P.inkMid }}>Global cap:</span> Total recovered hours capped at {pct(GLOBAL_CAP)}% of entered hours</div>
                      <div><span style={{ color: P.inkMid }}>Category cap:</span> No category exceeds {pct(CAT_CAP)}% recovery</div>
                    </div>
                  </div>
                </Acc>

                <Acc title="Sources">
                  <div style={{ ...txt }}>
                    <p style={{ marginBottom: 8 }}>The recovery rates in this calculator are internal conservative assumptions. They are calibrated below technical maximums reported in the following published research:</p>
                    <p style={{ marginBottom: 8 }}>
                      <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier" target="_blank" rel="noopener noreferrer" style={{ color: P.gold, borderBottom: `1px solid ${P.goldFaint}`, textDecoration: "none", paddingBottom: 1 }}>McKinsey Global Institute, "The Economic Potential of Generative AI" (June 2023)</a>
                      {" "}— Estimated that current AI and automation technologies could automate activities absorbing 60–70% of employee time.
                    </p>
                    <p style={{ marginBottom: 8 }}>
                      <a href="https://blog.hubspot.com/sales/hubspot-sales-strategy-report" target="_blank" rel="noopener noreferrer" style={{ color: P.gold, borderBottom: `1px solid ${P.goldFaint}`, textDecoration: "none", paddingBottom: 1 }}>HubSpot, "2024 State of Sales Report"</a>
                      {" "}— Found that sales professionals using AI saved approximately two hours per day on manual tasks.
                    </p>
                    <p style={{ marginBottom: 0 }}>
                      <a href="https://zapier.com/blog/state-of-business-automation-2021/" target="_blank" rel="noopener noreferrer" style={{ color: P.gold, borderBottom: `1px solid ${P.goldFaint}`, textDecoration: "none", paddingBottom: 1 }}>Zapier, "2021 State of Business Automation"</a>
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
                        <Diamond size={6} fill={P.inkFaint} stroke="none" sw={0} style={{ marginTop: 4, flexShrink: 0 }} />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </Acc>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <button onClick={() => { setStep("questions"); if (!embedded) window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{
                    ...CTA.style,
                    width: mob ? "100%" : CTA.width,
                  }}>
                  Adjust inputs
                </button>
                <a href="/assessment"
                  style={{ fontFamily: FONT, fontSize: 12, color: P.gold, cursor: "pointer", borderBottom: `1px solid ${P.goldFaint}`, textDecoration: "none", paddingBottom: 1, textAlign: "center" }}>
                  Take the AI Readiness Assessment
                </a>
                <span onClick={resetAll}
                  style={{ fontFamily: FONT, fontSize: 12, color: P.inkLight, cursor: "pointer", borderBottom: `1px solid ${P.paperRule}`, paddingBottom: 1, textAlign: "center" }}>
                  Start over
                </span>
              </div>

              {/* Footer note */}
              <div style={{ paddingTop: 14, borderTop: `1px solid ${P.paperRule}` }}>
                <p style={{ fontFamily: FONT, fontSize: 12, color: P.inkFaint, lineHeight: 1.5 }}>No data stored. No email required. Provided by Telchar AI as a free planning resource.</p>
              </div>
            </div>
          )}
        </div>
  );

  if (embedded) return contentArea;

  return (
    <div style={{ minHeight: "100vh", background: P.paper, fontFamily: FONT, overflowX: "hidden", width: "100%" }}>
      <style>{`
        @import url('${GOOGLE_FONTS_URL}');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{overflow-x:hidden;max-width:100vw;background:${P.paper};}
        button{font-family:inherit;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;background:${P.gold};cursor:pointer;}
        input[type=range]::-moz-range-thumb{width:14px;height:14px;background:${P.gold};border:none;cursor:pointer;}
      `}</style>

      {/* ── Navy header (matches ReportPage pattern) ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 200,
        background: P.navy, height: mob ? 48 : 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: mob ? "0 16px" : "0 36px",
        borderBottom: `1px solid ${P.navyFaint}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={ANVIL_URL} alt="Telchar AI" style={{ height: 14, filter: "brightness(0) invert(1)" }} />
          <div style={{ width: 1, height: 14, background: P.navyFaint }} />
          <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: P.navyText }}>ROI Calculator</span>
        </div>
        <span style={{
          fontFamily: FONT, fontSize: 12, fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "3px 7px",
          background: P.navyDim, color: P.navyText,
          border: `1px solid ${P.navyFaint}`,
        }}>Beta</span>
      </div>

      {/* ── Content area ── */}
      <div style={{ display: "flex", justifyContent: "center", overflowX: "hidden" }}>
        {contentArea}
      </div>
    </div>
  );
}
