import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TELCHAR as P, FONT, SERIF, GOOGLE_FONTS_URL, TEXT, LIGHT_TEXT, TYPE, CTA, scoreColor, scoreTier, hexToRgb, Diamond, Rule, SecLabel } from "../design/telcharDesign";
import { getReportData, TIER_MAP, REPORT_NOTES } from "../data/reportData";
import HamburgerMenu from "../components/HamburgerMenu";

// ─────────────────────────────────────────────────────────────
// TELCHAR AI · AI Readiness Assessment Report
// Consulting document design system
// Dark navy · Electric blue accent · DM Sans + Instrument Serif
// ─────────────────────────────────────────────────────────────

// ── Mutable report data — populated from shared data adapter ──
// Page components read these module-level variables directly.
// They are set once per render cycle in the App component via getReportData().
let CO, IND, CLIENT_TOOLS, SCORES, WINS, STACK, DATE, BENCH, SUMMARY_NARRATIVE, CATEGORY_ANALYSES, ACTION_PLAN, RISKS, ROADMAP, CATEGORY_TOOL_RECS;
const BENCHMARK_NOTE = "Reference baselines provide comparison context for businesses of similar industry and size. They are not a ceiling on performance or potential value.";


// ── Tier gates ───────────────────────────────────────────────
// FREE: Cover + Score Summary + Quick Wins (1 win) + CTA
// FULL: + all Quick Wins + Impact + 30-Day Action Plan + 5 Categories
//       + 90-Day Roadmap + Risk + Data Infra + Engagement

// ── Count-up animation ───────────────────────────────────────
function useCount(target, delay=0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => {
      let t0 = null;
      const tick = ts => {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / 1400, 1);
        setV(Math.round((1 - Math.pow(1 - p, 4)) * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(id);
  }, [target]);
  return v;
}

// ── Responsive hook ──────────────────────────────────────────
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ── Atmosphere layer ─────────────────────────────────────────
function Atmosphere() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 60% at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(13,22,40,0.4) 40%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 60%, rgba(37,99,235,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 10% 70%, rgba(13,22,40,0.6) 0%, transparent 60%)`,
    }}/>
  );
}

// ── Glass card style ─────────────────────────────────────────
const glassCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 14,
  backdropFilter: "blur(20px)",
};

// Five-segment analytical scale + floating diamond marker
function SegScale({ score, compact }) {
  const col = scoreColor(score);
  return (
    <div style={{ width:"100%", minWidth:0 }}>
      <div style={{ position:"relative", marginBottom:5 }}>
        <div style={{
          position:"absolute", top:-9,
          left:`clamp(4px, ${score}%, calc(100% - 4px))`,
          transform:"translateX(-50%)", zIndex:3,
        }}>
          <Diamond size={9} fill="#2563eb" stroke="#2563eb" sw={1.5}/>
        </div>
        <div style={{ display:"flex", gap:3, height:10 }}>
          {Array.from({length:5}).map((_,i) => {
            const from = i/5*100, to = (i+1)/5*100;
            const full = score >= to;
            const part = score > from && score < to;
            return (
              <div key={i} style={{ flex:1, height:"100%", background:"rgba(255,255,255,0.08)", position:"relative", overflow:"hidden" }}>
                {(full||part) && <div style={{
                  position:"absolute", top:0, left:0, bottom:0,
                  width: full ? "100%" : `${((score-from)/(to-from))*100}%`,
                  background: "linear-gradient(90deg, #111e38 0%, #4a80f5 100%)",
                }}/>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        {[0,20,40,60,80,100].map(n=>(
          <span key={n} style={{ fontFamily:FONT, fontSize:compact?10:12, color:P.muted, fontWeight:300 }}>{n}</span>
        ))}
      </div>
    </div>
  );
}


// ── Page shell ───────────────────────────────────────────────
function ReportPage({ children, pg, total }) {
  const w = useWidth();
  const mobile = w < 640;
  return (
    <div style={{
      width: "100%",
      background: "#080f1e",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
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
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.025,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px"
      }} />

      {/* Inner page nav removed — global App shell nav handles branding + navigation */}

      {/* Content area */}
      <div style={{ flex:1, padding:mobile?"28px 20px":"48px 48px 0", position:"relative", zIndex:10 }}>
        {children}
      </div>

      <div style={{ height:40 }}/>

      {/* Footer bar */}
      <div style={{
        background: "rgba(8,15,30,0.9)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        height: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: mobile ? "0 12px" : "0 28px",
        position: "relative", zIndex: 10,
      }}>
        <span style={{ fontFamily:FONT, fontSize:mobile?9:11, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, fontWeight:400 }}>TELCHAR AI · CONFIDENTIAL</span>
        <span style={{ fontFamily:FONT, fontSize:12, color:P.dim }}>{pg}/{total}</span>
      </div>
    </div>
  );
}

// ── Paywall block ─────────────────────────────────────────────
function Paywall({ onUpgrade }) {
  return (
    <div style={{
      background: "rgba(37,99,235,0.08)",
      border: "1px solid rgba(37,99,235,0.25)",
      borderRadius: 12,
      padding: "24px 28px",
      marginTop: 32,
    }}>
      <div style={{ fontFamily:FONT, fontSize:11, color:P.blue2, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>AI Action Plan — Early Access</div>
      <p style={{ fontFamily:FONT, fontSize:13, color:P.dim, fontWeight:300, lineHeight:1.7, margin:"0 0 14px" }}>Preview all priority improvements, 30-day action plan, 90-day roadmap, deep category analysis, risk guidance, tool recommendations, and a downloadable branded PDF.</p>
      <button onClick={onUpgrade} style={{
        fontFamily:FONT, width:280, height:48, display:"flex", alignItems:"center", justifyContent:"center",
        background:"#2563eb", color:"#fff", fontSize:13, fontWeight:600,
        letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer", borderRadius:8, margin:"0 auto",
      }}>Preview AI Action Plan</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 1 — COVER
// ═══════════════════════════════════════════════════════════
function PageCover({ pg, total, onNext }) {
  const w = useWidth();
  const mobile = w < 640;
  const scoreCol = scoreColor(SCORES.overall);
  const scoreW = Math.round((SCORES.overall / 100) * 280);

  return (
    <div style={{
      width: "100%",
      background: "#080f1e",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      <Atmosphere/>

      {/* Content — centered vertically using flex */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: mobile ? "48px 24px 24px" : "64px 48px 24px",
        gap: 0,
        position: "relative",
        zIndex: 10,
        textAlign: "center",
      }}>

        {/* Eyebrow */}
        <div style={{ fontFamily:FONT, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:28 }}>
          TELCHAR AI READINESS INDEX{"\u2122"}
        </div>

        {/* Company name */}
        <div style={{ fontFamily:FONT, fontSize:"clamp(48px,9vw,72px)", fontWeight:300, color:P.white, lineHeight:1.05, letterSpacing:"-0.02em", marginBottom:12 }}>
          {CO}
        </div>

        {/* Industry */}
        <div style={{ fontFamily:FONT, fontSize:15, fontWeight:300, color:P.dim, marginBottom:40 }}>{IND}</div>

        {/* Score number */}
        <div style={{ fontFamily:FONT, fontSize:mobile?"clamp(72px,16vw,96px)":"clamp(96px,18vw,140px)", fontWeight:300, color:scoreCol, lineHeight:0.9, letterSpacing:"-0.05em", marginBottom:12 }}>
          {SCORES.overall}
        </div>

        {/* Tier */}
        <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:scoreCol, marginBottom:6 }}>
          {scoreTier(SCORES.overall)}
        </div>

        {/* out of 100 */}
        <div style={{ fontFamily:FONT, fontSize:12, color:P.muted, marginBottom:24 }}>out of 100</div>

        {/* Score bar */}
        <div style={{ width:280, height:4, background:"rgba(255,255,255,0.07)", borderRadius:2, overflow:"hidden", marginBottom:40 }}>
          <div style={{
            width: scoreW,
            height: "100%",
            background: `linear-gradient(90deg, #111e38 0%, ${scoreCol} 100%)`,
            borderRadius: 2,
          }}/>
        </div>

        {/* Boilerplate */}
        <p style={{ fontFamily:FONT, fontSize:13, color:P.dim, fontWeight:300, maxWidth:480, lineHeight:1.75, marginBottom:48 }}>
          This report presents findings from the Telchar AI Readiness Index{"\u2122"} across five operational dimensions. Scores reflect self-reported data collected via structured questionnaire and facilitated analysis.
        </p>

        {/* 3-column metadata */}
        <div style={{ display:"flex", gap:0, marginBottom:40, flexWrap: mobile ? "wrap" : "nowrap", justifyContent:"center" }}>
          {[["Assessment date", DATE],["Framework","v2.4 · Five Category"],["Classification","Confidential"]].map(([k,v],i)=>(
            <div key={k} style={{
              paddingLeft: mobile ? 12 : (i>0 ? 28 : 0),
              paddingRight: mobile ? 12 : (i<2 ? 28 : 0),
              borderRight: (!mobile && i<2) ? "1px solid rgba(255,255,255,0.07)" : "none",
              textAlign: "center",
              ...(mobile ? { flex:"0 0 auto", marginBottom:8 } : {}),
            }}>
              <div style={{ fontFamily:FONT, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:6 }}>{k}</div>
              <div style={{ fontFamily:FONT, fontSize:mobile?12:13, fontWeight:500, color:P.white }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Begin reading link */}
        {onNext && (
          <div onClick={onNext} style={{ fontFamily:FONT, fontSize:14, color:"#4a80f5", cursor:"pointer", userSelect:"none" }}>
            Begin reading →
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div style={{
        background: "rgba(8,15,30,0.9)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        height: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: mobile ? "0 12px" : "0 28px",
        position: "relative", zIndex: 10,
      }}>
        <span style={{ fontFamily:FONT, fontSize:mobile?9:11, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted }}>TELCHAR AI · CONFIDENTIAL</span>
        <span style={{ fontFamily:FONT, fontSize:12, color:P.dim }}>{pg}/{total}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 2 — SCORE SUMMARY (all tiers)
// ═══════════════════════════════════════════════════════════
function PageSummary({ pg, total, tier, onUpgrade, demo }) {
  const w       = useWidth();
  const mobile  = w < 640;
  const desktop = w >= 900;
  const animated = useCount(SCORES.overall);

  const benchOverall = BENCH?.overall ?? 51;
  const delta   = SCORES.overall - benchOverall;
  const interp  = SUMMARY_NARRATIVE || `A score of ${SCORES.overall} places ${CO} in the ${scoreTier(SCORES.overall)} tier.`;

  return (
    <ReportPage pg={pg} total={total}>
      {/* Section 1: Overall Score */}
      <div style={{ display:desktop?"grid":"block", gridTemplateColumns:desktop?"200px 1fr":undefined, gap:desktop?52:0, marginBottom:36 }}>

        {/* Left: score */}
        <div style={{ marginBottom:desktop?0:32 }}>
          <SecLabel>Overall Score</SecLabel>
          <div style={{ fontFamily:FONT, fontSize:mobile?56:96, fontWeight:300, color:scoreColor(SCORES.overall), lineHeight:1, letterSpacing:"-0.05em", marginBottom:10 }}>{animated}</div>
          <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:scoreColor(SCORES.overall), display:"inline-block", marginBottom:24 }}>{scoreTier(SCORES.overall)}</div>
          <div style={{ borderTop:`1px solid ${P.linedark}` }}>
            {[["Industry",IND],["Categories","5 of 5 scored"],["Reference Baseline",`${benchOverall} / 100`]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"8px 0", borderBottom:`1px solid ${P.linedark}`, gap:8 }}>
                <span style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:P.muted, flexShrink:0 }}>{k}</span>
                <span style={{ fontFamily:FONT, fontSize:13, fontWeight:400, color:P.dim, textAlign:"right" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: interpretation */}
        <div style={{ paddingTop:desktop?30:0 }}>
          <SecLabel>Score interpretation</SecLabel>
          <p style={{ fontFamily:FONT, fontSize:15, fontWeight:300, color:P.dim, lineHeight:1.8, margin:"0 0 28px" }}>{interp}</p>
          {/* Benchmark block */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(37,99,235,0.25)",
            borderLeft: "3px solid #2563eb",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 28,
          }}>
            <div style={{ display:"flex", flexWrap: mobile ? "wrap" : "nowrap", gap: mobile ? "12px 0" : 0 }}>
              {[["YOUR SCORE",SCORES.overall,scoreColor(SCORES.overall)],["REF. BASELINE",benchOverall,"#ffffff"],["DELTA",(delta>=0?"+":"")+delta,delta>=0?"#22c55e":"#ef4444"]].map(([label,val,col],i)=>(
                <div key={label} style={{ paddingRight: mobile ? 16 : (i<2?20:0), paddingLeft: mobile ? (i>0?16:0) : (i>0?20:0), borderRight: (!mobile && i<2) ? `1px solid ${P.linedark}` : "none", ...(mobile ? { flex: "1 0 auto" } : {}) }}>
                  <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", color:"rgba(255,255,255,0.5)", marginBottom:4 }}>{label}</div>
                  <div style={{ fontFamily:FONT, fontSize: mobile ? 28 : 36, fontWeight:300, color:col, lineHeight:1 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Methodology note */}
      <p style={{ fontFamily:FONT, fontSize:11, fontWeight:300, color:P.muted, lineHeight:1.7, margin:"0 0 24px", fontStyle:"italic" }}>
        {BENCHMARK_NOTE}
      </p>

      <Rule diamond={true} style={{ marginBottom:32 }}/>

      {/* Section 2: Category Breakdown */}
      <SecLabel>Category breakdown</SecLabel>
      {!mobile && (
        <div style={{ display:"grid", gridTemplateColumns:"60px 1fr 110px", gap:22, paddingBottom:8, borderBottom:`1px solid ${P.linedark}` }}>
          {["Score","Category & scale","Maturity"].map((h,i)=>(
            <div key={h} style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", color:P.muted, textAlign:i===0?"center":i===2?"right":"left" }}>{h}</div>
          ))}
        </div>
      )}
      {mobile && <div style={{ borderBottom:`1px solid ${P.linedark}`, paddingBottom:0, marginBottom:0 }}/>}
      {SCORES.cats.map(cat=>{
        const col = scoreColor(cat.score);
        return mobile ? (
          <div key={cat.key} style={{ padding:"14px 0 10px", borderBottom:`1px solid ${P.linedark}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:10, minWidth:0 }}>
                <span style={{ fontFamily:FONT, fontSize:26, fontWeight:300, color:col, lineHeight:1, flexShrink:0 }}>{cat.score}</span>
                <span style={{ fontFamily:FONT, fontSize:15, fontWeight:500, color:P.white, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cat.label}</span>
              </div>
              <span style={{ fontFamily:FONT, fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:col, flexShrink:0, marginLeft:8 }}>{scoreTier(cat.score)}</span>
            </div>
            <SegScale score={cat.score} compact/>
          </div>
        ) : (
          <div key={cat.key} style={{ display:"grid", gridTemplateColumns:"60px 1fr 110px", gap:22, padding:"18px 0 12px", borderBottom:`1px solid ${P.linedark}`, alignItems:"start" }}>
            <div style={{ fontFamily:FONT, fontSize:32, fontWeight:300, color:col, textAlign:"center", lineHeight:1, paddingTop:2 }}>{cat.score}</div>
            <div>
              <div style={{ fontFamily:FONT, fontSize:15, fontWeight:500, color:P.white, marginBottom:10 }}>{cat.label}</div>
              <SegScale score={cat.score}/>
            </div>
            <div style={{ fontFamily:FONT, fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:col, textAlign:"right", paddingTop:4 }}>{scoreTier(cat.score)}</div>
          </div>
        );
      })}

      {/* Paywall for free */}
      {!demo && tier === "free" && <Paywall onUpgrade={onUpgrade}/>}
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 3 — QUICK WINS (free: 1 win; full: all 3)
// ═══════════════════════════════════════════════════════════
function PageQuickWins({ pg, total, tier, onUpgrade, demo }) {
  const w = useWidth();
  const mobile = w < 640;
  const visibleWins = (!demo && tier === "free") ? WINS.slice(0,1) : WINS;

  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>Priority improvement areas</SecLabel>
      <div style={{ fontFamily:FONT, fontSize:mobile?13:15, fontWeight:300, color:P.dim, lineHeight:1.8, marginBottom:28 }}>
        Three recommended starting points. Each requires setup, configuration, and testing. Timelines depend on your team's capacity and technical comfort.
      </div>

      {(() => {
        const priorityAccents = [
          { border: "#2563eb", badge: "rgba(37,99,235,0.15)", badgeBorder: "rgba(37,99,235,0.4)", label: "HIGHEST IMPACT", labelColor: "#4a80f5" },
          { border: "#22c55e", badge: "rgba(34,197,94,0.1)",  badgeBorder: "rgba(34,197,94,0.35)", label: "HIGH IMPACT",    labelColor: "#22c55e" },
          { border: "#f59e0b", badge: "rgba(245,158,11,0.1)", badgeBorder: "rgba(245,158,11,0.35)", label: "MEDIUM IMPACT", labelColor: "#f59e0b" },
        ];
        return visibleWins.map((win,i)=>{
          const accent = priorityAccents[i] || priorityAccents[2];
          return (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderLeft: `3px solid ${accent.border}`,
              borderRadius: 10,
              padding: "16px 20px",
              marginBottom: 8,
            }}>
              <div style={{ display:"grid", gridTemplateColumns:"24px 1fr", gap:14 }}>
                <div style={{
                  width:24, height:24, borderRadius:"50%",
                  background: accent.badge, border: `1px solid ${accent.badgeBorder}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:FONT, fontSize:10, fontWeight:700, color:accent.labelColor, marginTop:2,
                }}>0{i+1}</div>
                <div>
                  <div style={{ display:"flex", gap:10, alignItems:"baseline", flexWrap:"wrap", marginBottom:6 }}>
                    <div style={{ fontFamily:FONT, fontSize:15, fontWeight:500, color:P.white }}>{win.title}</div>
                    <span style={{
                      fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.1em",
                      color:accent.labelColor,
                      background: accent.badge, border: `1px solid ${accent.badgeBorder}`,
                      borderRadius:4, padding:"2px 8px",
                    }}>{accent.label}</span>
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <span style={{
                      fontFamily:FONT, fontSize:11, color:accent.labelColor,
                      background: accent.badge, border: `1px solid ${accent.badgeBorder}`,
                      borderRadius:4, padding:"2px 8px",
                    }}>{win.cat}</span>
                  </div>
                  <p style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:P.dim, lineHeight:1.75, margin:"0 0 14px" }}>{win.desc}</p>
                  <div style={{ display:"flex", gap:0, borderTop:`1px solid ${P.linedark}`, paddingTop:10 }}>
                    {[["Built with",win.tool],["Monthly cost",win.toolCost],["Timeline",win.time]].map(([k,v],j)=>(
                      <div key={k} style={{
                        ...glassCard,
                        background: "transparent",
                        border: "none",
                        borderRadius: 0,
                        backdropFilter: "none",
                        paddingRight:j<2?20:0, paddingLeft:j>0?20:0,
                        borderRight:j<2?`1px solid ${P.linedark}`:"none",
                      }}>
                        <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:P.muted, marginBottom:3 }}>{k}</div>
                        <div style={{ fontFamily:FONT, fontSize:12, fontWeight:500, color:P.white }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        });
      })()}

      {!demo && tier === "free" && <Paywall onUpgrade={()=>upgrade("full")}/>}

      {/* Estimated impact — full only */}
      {(demo || tier === "full") && (() => {
        const items = [["Manual hours recovered","12 – 18 hrs / week"],["Estimated annual value","$28,000 – $44,000"],["Estimated payback","Under 90 days"]];
        return (
          <div style={{ marginTop:32 }}>
            <Rule diamond={true} style={{ marginBottom:28 }}/>
            <SecLabel>Estimated impact — 90-day implementation</SecLabel>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:0 }}>
              {items.map(([label,val],i)=>(
                <div key={label} style={{
                  ...glassCard,
                  background: "transparent",
                  border: "none",
                  borderRadius: 0,
                  backdropFilter: "none",
                  paddingRight:i<2?24:0, paddingLeft:i>0?24:0,
                  borderRight:i<2?`1px solid ${P.linedark}`:"none",
                }}>
                  <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:6 }}>{label}</div>
                  <div style={{ fontFamily:FONT, fontSize:15, fontWeight:500, color:P.blue }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, fontFamily:FONT, fontSize:12, fontWeight:300, color:P.muted, lineHeight:1.7 }}>
              Estimates based on modeled expectations for businesses of similar industry and size. Actual results depend on implementation scope and workflow complexity.
            </div>
          </div>
        );
      })()}
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 4 — 30-DAY ACTION PLAN (full only)
// ═══════════════════════════════════════════════════════════
function PageActionPlan({ pg, total }) {
  const w = useWidth();
  const mobile = w < 640;

  // Use engine-generated action plan blocks
  const ACCENT_COLORS = ["#2563eb", "#22c55e", "#f59e0b"];
  const blocks = (ACTION_PLAN || []).map((block, i) => ({
    ...block,
    accentColor: ACCENT_COLORS[i] || ACCENT_COLORS[2],
  }));

  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>30-Day action plan</SecLabel>
      <p style={{ fontFamily:FONT, fontSize:mobile?13:15, fontWeight:300, color:P.dim, lineHeight:1.8, marginBottom:28 }}>
        Your first 30 days, broken into three blocks based on your top three priorities. Each block tells you what to do, what tool to use, and what the result should be. This plan is the first month of the full 90-day roadmap.
      </p>

      {blocks.map((block, i) => (
        <div key={i} style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderLeft: `3px solid ${block.accentColor}`,
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 14,
        }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div style={{
              width:32, height:32, borderRadius:8,
              background: `rgba(${hexToRgb(block.accentColor)},0.12)`,
              border: `1px solid rgba(${hexToRgb(block.accentColor)},0.35)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:FONT, fontSize:11, fontWeight:700, color:block.accentColor,
            }}>0{i+1}</div>
            <div>
              <div style={{ fontFamily:FONT, fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:block.accentColor, marginBottom:2 }}>{block.window}</div>
              <div style={{ fontFamily:FONT, fontSize:17, fontWeight:500, color:P.white }}>{block.label}</div>
            </div>
          </div>

          {/* Objective */}
          <div style={{ fontFamily:SERIF, fontSize:13, fontStyle:"italic", color:"rgba(255,255,255,0.4)", lineHeight:1.6, marginBottom:14, paddingLeft:44 }}>
            {block.objective}
          </div>

          {/* Actions */}
          <div style={{ paddingLeft:44, marginBottom:14 }}>
            {block.actions.map((action, j) => (
              <div key={j} style={{ display:"flex", gap:10, marginBottom:8 }}>
                <Diamond size={9} fill={block.accentColor} stroke="none" sw={0} style={{ marginTop:3, flexShrink:0 }}/>
                <span style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:"rgba(255,255,255,0.7)", lineHeight:1.7 }}>{action}</span>
              </div>
            ))}
          </div>

          {/* Outcome + Tool */}
          <div style={{ paddingLeft:44, borderTop:`1px solid ${P.linedark}`, paddingTop:12, display:"flex", gap:24, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:P.muted, marginBottom:4 }}>Expected Outcome</div>
              <div style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>{block.outcome}</div>
            </div>
            <div style={{ minWidth:120 }}>
              <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:P.muted, marginBottom:4 }}>Primary Tool</div>
              <div style={{ fontFamily:FONT, fontSize:13, fontWeight:500, color:P.white }}>{block.tool}</div>
            </div>
          </div>
        </div>
      ))}
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 5-9 — CATEGORY DEEP DIVE (full only)
// ═══════════════════════════════════════════════════════════
function PageCategory({ catKey, pg, total }) {
  const cat  = SCORES.cats.find(c=>c.key===catKey);
  const rec  = CATEGORY_TOOL_RECS?.[catKey] || {};
  const w    = useWidth();
  const mobile = w < 640;

  const analysis = CATEGORY_ANALYSES?.[catKey] || {};

  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>Category analysis</SecLabel>

      {/* Category header row */}
      <div style={{ display:"flex", gap:mobile?16:32, alignItems:"flex-start", marginBottom:28, paddingBottom:24, borderBottom:`1px solid ${P.linedark}` }}>
        <div style={{ flexShrink:0 }}>
          <div style={{ fontFamily:FONT, fontSize:64, fontWeight:300, color:scoreColor(cat.score), lineHeight:1, letterSpacing:"-0.04em" }}>{cat.score}</div>
          <div style={{ fontFamily:FONT, fontSize:12, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:scoreColor(cat.score), marginTop:4 }}>{scoreTier(cat.score)}</div>
        </div>
        <div style={{ flex:1, paddingTop:8 }}>
          <div style={{ fontFamily:FONT, fontSize:mobile?16:20, fontWeight:500, color:P.white, marginBottom:12 }}>{cat.label}</div>
          <SegScale score={cat.score}/>
        </div>
      </div>

      <Rule diamond={true} style={{ marginBottom:24 }}/>

      {/* Analysis */}
      <SecLabel>Analysis</SecLabel>
      {analysis.diagnosis ? (
        <div style={{ marginBottom:28 }}>
          <p style={{ fontFamily:FONT, fontSize:15, fontWeight:300, color:P.dim, lineHeight:1.9, margin:"0 0 16px" }}>{analysis.diagnosis}</p>
          {[
            ["What is working", analysis.strength],
            ["Clearest gap", analysis.gap],
            ["Why it matters", analysis.implication],
            ["Where to focus next", analysis.focus],
          ].map(([label, text]) => text ? (
            <div key={label} style={{ marginBottom:10 }}>
              <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", color:P.muted, marginBottom:4 }}>{label}</div>
              <p style={{ fontFamily:FONT, fontSize:14, fontWeight:300, color:P.dim, lineHeight:1.8, margin:0 }}>{text}</p>
            </div>
          ) : null)}
        </div>
      ) : (
        <p style={{ fontFamily:FONT, fontSize:15, fontWeight:300, color:P.dim, lineHeight:1.9, marginBottom:28 }}>Category analysis unavailable.</p>
      )}

      {/* Benchmark comparison */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(37,99,235,0.25)",
        borderLeft: "3px solid #2563eb",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 28,
      }}>
        <div style={{ display:"flex" }}>
          {(()=>{ const catBench = BENCH?.categories?.[cat.key] ?? BENCH?.overall ?? 51; const catDelta = cat.score - catBench; return [["YOUR SCORE",cat.score,scoreColor(cat.score)],["REF. BASELINE",catBench,"#ffffff"],["DELTA",(catDelta>=0?"+":"")+catDelta,catDelta>=0?"#22c55e":"#ef4444"]]; })().map(([label,val,col],i)=>(
            <div key={label} style={{ paddingRight:i<2?20:0, paddingLeft:i>0?20:0, borderRight:i<2?`1px solid ${P.linedark}`:"none" }}>
              <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", color:"rgba(255,255,255,0.5)", marginBottom:4 }}>{label}</div>
              <div style={{ fontFamily:FONT, fontSize:36, fontWeight:300, color:col, lineHeight:1 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended approach — engine-driven */}
      <SecLabel>Recommended approach</SecLabel>
      <div style={{
        ...glassCard,
        borderLeft: "3px solid #2563eb",
        borderRadius: 14,
        padding: "18px 20px",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8, flexWrap:"wrap", gap:8 }}>
          <div style={{ fontFamily:FONT, fontSize:18, fontWeight:500, color:P.white }}>{rec.recommendationTitle}</div>
          <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:P.blue2 }}>
            {rec.primaryCapability?.label}{rec.secondaryCapability ? ` + ${rec.secondaryCapability.label}` : ""}
          </div>
        </div>
        <p style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:P.dim, lineHeight:1.75, margin:"0 0 14px" }}>{rec.operationalProblem}</p>

        {/* Why this capability fits */}
        <div style={{ borderTop:`1px solid ${P.linedark}`, paddingTop:12 }}>
          <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:8 }}>WHY THIS APPROACH</div>
          <p style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:P.dim, lineHeight:1.75, margin:"0 0 14px" }}>{rec.whyThisFits}</p>
        </div>

        {/* AI approach steps */}
        <div style={{ borderTop:`1px solid ${P.linedark}`, paddingTop:12 }}>
          <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:8 }}>HOW IT WORKS</div>
          {(rec.aiApproach || []).map((step,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
              <Diamond size={9} fill={P.blue2} stroke="none" sw={0} style={{ marginTop:3 }}/>
              <span style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:P.dim, lineHeight:1.6 }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Expected result */}
        {rec.expectedResult && (
          <div style={{ borderTop:`1px solid ${P.linedark}`, paddingTop:12, marginTop:4 }}>
            <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:6 }}>EXPECTED RESULT</div>
            <p style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:P.dim, lineHeight:1.65, margin:0 }}>{rec.expectedResult}</p>
          </div>
        )}

        {/* Plan fit */}
        {rec.planFit && (
          <div style={{ borderTop:`1px solid ${P.linedark}`, paddingTop:12, marginTop:12 }}>
            <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:6 }}>RECOMMENDED PLAN</div>
            <p style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:P.dim, lineHeight:1.65, margin:0 }}>
              <span style={{ fontWeight:600, color:P.white }}>{rec.planFit.level}</span>
              {" — "}{rec.planFit.rationale}
            </p>
          </div>
        )}

        {/* Start here */}
        {rec.startHere && rec.startHere.length > 0 && (
          <div style={{ borderTop:`1px solid ${P.linedark}`, paddingTop:12, marginTop:12 }}>
            <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:8 }}>START HERE</div>
            {rec.startHere.map((link,i)=>(
              <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
                <span style={{ fontFamily:FONT, fontSize:13, fontWeight:600, color:P.blue2, flexShrink:0 }}>{i+1}.</span>
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily:FONT, fontSize:13, color:"#4a80f5", textDecoration:"none", lineHeight:1.6 }}>{link.step}</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 9 — 90-DAY ROADMAP (full only)
// ═══════════════════════════════════════════════════════════
function PageRoadmap({ pg, total }) {
  const w = useWidth(); const mobile = w < 640;
  const phases = ROADMAP || [];

  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>90-Day implementation roadmap</SecLabel>
      <p style={{ fontFamily:FONT, fontSize:mobile?13:15, fontWeight:300, color:P.dim, lineHeight:1.8, marginBottom:32 }}>
        A 12-week plan broken into five phases: get set up, run your first automation, add more, clean up, and measure results. Each phase builds on the one before it, so nothing changes too fast. Telchar AI works with your team to keep things on track.
      </p>

      {phases.map((ph,i)=>(
        <div key={ph.phaseNum} style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderLeft: `3px solid ${ph.accentColor}`,
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 16,
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "180px 1fr",
          gap: 24,
        }}>
          <div>
            <div style={{
              width:32, height:32, borderRadius:8,
              background: `rgba(${hexToRgb(ph.accentColor)},0.12)`,
              border: `1px solid rgba(${hexToRgb(ph.accentColor)},0.35)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:FONT, fontSize:11, fontWeight:700, color:ph.accentColor, marginBottom:10,
            }}>{ph.phaseNum}</div>
            <div style={{ fontFamily:FONT, fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:ph.accentColor, marginBottom:6 }}>{ph.window}</div>
            <div style={{ fontFamily:FONT, fontSize:17, fontWeight:500, color:P.white, marginBottom:8 }}>{ph.label}</div>
            {ph.goal && <div style={{ fontFamily:SERIF, fontSize:12, fontStyle:"italic", color:"rgba(255,255,255,0.35)", lineHeight:1.6 }}>{ph.goal}</div>}
          </div>
          <div>
            {ph.steps.map((s,j)=>(
              <div key={j} style={{ display:"flex", gap:10, marginBottom:8 }}>
                <Diamond size={9} fill={ph.accentColor} stroke="none" sw={0} style={{ marginTop:3, flexShrink:0 }}/>
                <span style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:"rgba(255,255,255,0.7)", lineHeight:1.7 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 10 — RISK ANALYSIS (full only)
// ═══════════════════════════════════════════════════════════
function PageRisk({ pg, total }) {
  const risks = RISKS || [];
  const sCol = { High:P.red, Medium:P.amber, Low:P.green };
  const riskCount = risks.length;
  const hasHigh = risks.some(r => r.severity === "High");
  const introText = hasHigh
    ? `Based on your answers, we identified ${riskCount} things that could slow down implementation. ${risks.filter(r=>r.severity==="High").length === 1 ? "One needs" : "Some need"} attention early. All of them are manageable — here is what to watch for and what to do about each one.`
    : `Based on your answers, we identified ${riskCount} things that could slow down implementation. None of them are serious, but they are worth knowing about. Here is what to watch for and what to do about each one.`;
  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>Risk analysis</SecLabel>
      <p style={{ fontFamily:FONT, fontSize:15, fontWeight:300, color:P.dim, lineHeight:1.8, marginBottom:28 }}>
        {introText}
      </p>
      {risks.map((r,i)=>(
        <div key={i} style={{
          ...glassCard,
          padding: "20px 24px",
          marginBottom: 12,
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <div style={{ fontFamily:FONT, fontSize:14, fontWeight:500, color:P.white }}>{r.label}</div>
            <div style={{ textAlign:"right", flexShrink:0, marginLeft:16 }}>
              <div style={{ fontFamily:FONT, fontSize:9, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:2 }}>Severity</div>
              <div style={{ fontFamily:FONT, fontSize:13, fontWeight:500, color:sCol[r.severity]||P.white }}>{r.severity}</div>
            </div>
          </div>
          <div style={{ fontFamily:FONT, fontSize:12, fontWeight:400, color:P.dim, lineHeight:1.7, marginBottom:8 }}>
            <span style={{ fontWeight:500, color:"rgba(255,255,255,0.5)" }}>Why it matters: </span>{r.reason}
          </div>
          <div style={{ fontFamily:FONT, fontSize:12, fontWeight:400, color:P.dim, lineHeight:1.7, marginBottom:8 }}>
            <span style={{ fontWeight:500, color:"rgba(255,255,255,0.5)" }}>What to watch: </span>{r.watch}
          </div>
          <div style={{ fontFamily:FONT, fontSize:12, fontWeight:400, color:P.dim, lineHeight:1.7 }}>
            <span style={{ fontWeight:500, color:"rgba(255,255,255,0.5)" }}>Mitigation: </span>{r.mitigation}
          </div>
        </div>
      ))}
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 11 — DATA INFRASTRUCTURE (full only)
// ═══════════════════════════════════════════════════════════
function PageDataInfra({ pg, total }) {
  const layers = [
    { num:"01", title:"Your business tools", accentColor:"#2563eb", accentRgb:"37,99,235",
      desc:"QuickBooks (financial), Gmail (communications), Google Calendar (scheduling). These are the tools where your real data lives. Every automation reads from and writes back to these systems — they stay your single source of truth." },
    { num:"02", title:"Connections between tools", accentColor:"#22c55e", accentRgb:"34,197,94",
      desc:"Make connects your tools and moves data between them automatically — on a schedule or when something happens (like a new order or a completed job). No one has to copy and paste information from one tool to another." },
    { num:"03", title:"AI that reads and writes for you", accentColor:"#a855f7", accentRgb:"168,85,247",
      desc:"Claude gets information from Make (job details, customer records, financial summaries) and produces useful output — drafted emails, summaries, or analysis. The results are sent back through Make to wherever they need to go." },
    { num:"04", title:"A dashboard so you can see what is happening", accentColor:"#f59e0b", accentRgb:"245,158,11",
      desc:"A free dashboard (Looker Studio or similar) pulls from your tools and Make to show you how the business is performing — without anyone having to build a report by hand." },
  ];
  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>Data infrastructure plan</SecLabel>
      <p style={{ fontFamily:FONT, fontSize:15, fontWeight:300, color:P.dim, lineHeight:1.8, marginBottom:28 }}>
        How your tools, automations, AI, and reporting fit together — built on the tools you already use. No new software beyond Make and Claude. Total cost under $30 per month.
      </p>
      {layers.map((l,i)=>(
        <div key={i} style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderLeft: `3px solid ${l.accentColor}`,
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 12,
          display: "flex",
          gap: 20,
          alignItems: "flex-start",
        }}>
          <div style={{
            width:32, height:32, borderRadius:8, flexShrink:0,
            background:`rgba(${l.accentRgb}, 0.12)`,
            border:`1px solid rgba(${l.accentRgb}, 0.3)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:11, fontWeight:700, color:l.accentColor,
            fontFamily:FONT,
          }}>{l.num}</div>
          <div>
            <div style={{ fontFamily:FONT, fontSize:15, fontWeight:500, color:"#ffffff", marginBottom:6 }}>{l.title}</div>
            <div style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:"rgba(255,255,255,0.55)", lineHeight:1.7 }}>{l.desc}</div>
          </div>
        </div>
      ))}
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 12 — ENGAGEMENT PATH (full only)
// ═══════════════════════════════════════════════════════════
function PageEngagement({ pg, total }) {
  const navigate = useNavigate();
  return (
    <ReportPage pg={pg} total={total}>
      <div style={{ maxWidth:720, margin:"0 auto" }}>
        {/* Eyebrow */}
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:"#4a80f5", marginBottom:16, fontFamily:FONT }}>
          NEXT STEPS
        </div>

        {/* Headline — full width */}
        <h2 style={{
          fontSize:"clamp(28px,5vw,42px)", fontWeight:300,
          letterSpacing:"-0.02em", color:"#ffffff",
          lineHeight:1.15, marginBottom:24, fontFamily:FONT,
        }}>
          Do you want project and program leadership support to help implement these recommendations with your team?
        </h2>

        {/* Divider */}
        <div style={{ height:1, background:"rgba(255,255,255,0.07)", marginBottom:28 }} />

        {/* Body paragraphs — full width, not narrow column */}
        <p style={{ fontFamily:FONT, fontSize:15, fontWeight:300, color:"rgba(255,255,255,0.55)", lineHeight:1.8, marginBottom:16 }}>
          Receiving a detailed report with recommendations, tools, and steps is valuable — but many businesses find the gap between knowing what to do and actually doing it difficult to close on their own. That hesitation is common and understandable.
        </p>
        <p style={{ fontFamily:FONT, fontSize:15, fontWeight:300, color:"rgba(255,255,255,0.55)", lineHeight:1.8, marginBottom:40 }}>
          Structured implementation support may be available to help your team move from report to execution — with clear milestones, accountability, and hands-on guidance. Support is selective and fit-based. We work only with businesses where there is a strong mutual fit and a realistic path to meaningful outcomes.
        </p>

        {/* CTA button — centered */}
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <button onClick={()=>navigate("/apply")} style={{
            background:"#2563eb", color:"#ffffff", border:"none",
            padding:"16px 48px", borderRadius:8,
            fontSize:13, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase",
            cursor:"pointer", width:"100%", maxWidth:480, fontFamily:FONT,
          }}>
            APPLY FOR IMPLEMENTATION SUPPORT
          </button>
        </div>

        {/* Fine print */}
        <div style={{ textAlign:"center", fontSize:12, color:"rgba(255,255,255,0.28)", marginBottom:32, fontFamily:FONT }}>
          Availability is limited. We assess mutual fit before any engagement begins.
        </div>

        {/* Italic disclaimer — full width, centered */}
        <div style={{
          textAlign:"center", fontSize:13,
          fontFamily:"'Instrument Serif', Georgia, serif",
          fontStyle:"italic", color:"rgba(255,255,255,0.25)",
          lineHeight:1.6,
        }}>
          Implementation support is informed by program and product leadership experience from large-scale delivery environments, adapted for small business execution.
        </div>
      </div>
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// APP SHELL — tier gate + navigation
// ═══════════════════════════════════════════════════════════
export default function App({ initialTier = "free", demo = false }) {
  // Load report data from shared adapter — populates module-level variables
  // for page components that read CO, IND, SCORES, WINS, STACK, DATE directly.
  const reportData = getReportData(demo);
  CO = reportData.co;
  IND = reportData.ind;
  CLIENT_TOOLS = reportData.clientTools;
  SCORES = reportData.scores;
  WINS = reportData.wins;
  STACK = reportData.stack;
  DATE = reportData.date;
  BENCH = reportData.benchmark;
  SUMMARY_NARRATIVE = reportData.summaryNarrative;
  CATEGORY_ANALYSES = reportData.categoryAnalyses;
  ACTION_PLAN = reportData.actionPlan;
  RISKS = reportData.risks;
  ROADMAP = reportData.roadmap;
  CATEGORY_TOOL_RECS = reportData.categoryToolRecs;

  const mapped = demo ? "full" : (TIER_MAP[initialTier] || "free");
  const [tier, setTier] = useState(mapped);
  const [cur, setCur]   = useState(0);

  const navW = useWidth();
  const navMobile = navW < 640;

  // Ensure report always opens with page 1 fully visible
  useEffect(() => { window.scrollTo(0,0); }, []);

  const upgrade = (newTier) => {
    setTier(newTier);
    setCur(0);
    window.scrollTo(0,0);
  };

  // Build page list based on tier
  const buildPages = (t) => {
    const effectiveTier = demo ? "full" : t;
    const total = effectiveTier==="full" ? 14 : 3;
    const pages = [
      { label:"Cover",              node:<PageCover pg={1} total={total} onNext={()=>{ setCur(1); window.scrollTo(0,0); }}/> },
      { label:"Score Summary",      node:<PageSummary pg={2} total={total} tier={effectiveTier} onUpgrade={()=>upgrade("full")} demo={demo}/> },
      { label:"Quick Wins",         node:<PageQuickWins pg={3} total={total} tier={effectiveTier} onUpgrade={nt=>upgrade(nt)} demo={demo}/> },
    ];
    if (effectiveTier==="full") {
      pages.push(
        { label:"30-Day Action Plan", node:<PageActionPlan pg={4} total={total}/> },
        { label:"Operations",       node:<PageCategory catKey="operations" pg={5} total={total}/> },
        { label:"Sales",            node:<PageCategory catKey="sales"      pg={6} total={total}/> },
        { label:"Data",             node:<PageCategory catKey="data"       pg={7} total={total}/> },
        { label:"Content",          node:<PageCategory catKey="content"    pg={8} total={total}/> },
        { label:"Technology",       node:<PageCategory catKey="technology" pg={9} total={total}/> },
        { label:"90-Day Roadmap",   node:<PageRoadmap    pg={10} total={total}/> },
        { label:"Risk Analysis",    node:<PageRisk       pg={11} total={total}/> },
        { label:"Data Infra",       node:<PageDataInfra  pg={12} total={total}/> },
        { label:"Engagement Path",  node:<PageEngagement pg={13} total={total}/> },
      );
    }
    return pages;
  };

  const pages = buildPages(tier);
  const page  = pages[Math.min(cur, pages.length-1)];

  const prev = () => { setCur(c=>Math.max(0,c-1)); window.scrollTo(0,0); };
  const next = () => { setCur(c=>Math.min(pages.length-1,c+1)); window.scrollTo(0,0); };

  // ── PDF download (native @react-pdf/renderer) ───────────────
  const [pdfBusy, setPdfBusy] = useState(false);

  const handleDownloadPDF = async () => {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      const { generatePdf } = await import("../pdf/generatePdf.jsx");
      await generatePdf({ tier, demo });
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080f1e", fontFamily:FONT, overflowX:"clip", width:"100%" }}>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <style>{`
        @import url('${GOOGLE_FONTS_URL}');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{overflow-x:clip;max-width:100vw;background:#080f1e;}
        button{font-family:inherit;}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      {/* Navigation bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8,15,30,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        height: 52,
        display: "flex", alignItems: "center",
        padding: navMobile ? "0 8px" : "0 20px",
        gap: navMobile ? 6 : 10,
      }}>

        {/* Prev */}
        <button onClick={prev} disabled={cur===0} style={{
          background:"none", border:"none", padding:"4px 2px",
          color: cur===0 ? P.linedark : P.white,
          cursor: cur===0 ? "default" : "pointer",
          fontSize: 18, lineHeight: 1,
          opacity: cur===0 ? 0.25 : 1,
          flexShrink: 0, display:"flex", alignItems:"center",
        }}>‹</button>

        {/* Logo + wordmark */}
        {!navMobile && (
          <>
            <img src="/white_decal.svg" style={{ height: 18, width: "auto", flexShrink: 0 }} alt="Telchar AI" />
            <div style={{ width:1, height:14, background:"rgba(255,255,255,0.12)", flexShrink:0 }}/>
          </>
        )}

        {/* Page label */}
        <span style={{ fontFamily:FONT, fontSize:navMobile?12:13, color:P.dim, fontWeight:400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, minWidth:0 }}>{page.label}</span>

        {/* Tier tabs */}
        <div style={{ display:"flex", gap:navMobile?2:3, flexShrink:0 }}>
          {[["free","Free"],["full","Full"]].map(([t,label])=>(
            <button key={t} onClick={()=>upgrade(t)} style={{
              fontFamily:FONT,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: navMobile ? "0.06em" : "0.08em",
              textTransform: "uppercase",
              padding: navMobile ? "5px 8px" : "5px 12px",
              borderRadius: 5,
              background: tier===t ? "rgba(37,99,235,0.2)" : "transparent",
              color: tier===t ? "#ffffff" : "rgba(255,255,255,0.35)",
              border: tier===t ? "1px solid rgba(37,99,235,0.4)" : "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
            }}>{label}</button>
          ))}
        </div>

        {/* Page counter */}
        <span style={{ fontFamily:FONT, fontSize:12, color:P.dim, flexShrink:0, marginLeft:navMobile?2:4 }}>{cur+1}/{pages.length}</span>

        {/* Next */}
        <button onClick={next} disabled={cur===pages.length-1} style={{
          background:"none", border:"none", padding:"4px 2px",
          color: cur===pages.length-1 ? P.linedark : P.white,
          cursor: cur===pages.length-1 ? "default" : "pointer",
          fontSize: 18, lineHeight: 1,
          opacity: cur===pages.length-1 ? 0.25 : 1,
          flexShrink: 0, display:"flex", alignItems:"center",
        }}>›</button>

        {/* Divider */}
        <div style={{ width:1, height:14, background:"rgba(255,255,255,0.12)", flexShrink:0 }}/>

        {/* Download PDF */}
        <button onClick={handleDownloadPDF} disabled={pdfBusy} title="Download PDF" style={{
          background: pdfBusy ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.2)",
          border: "1px solid rgba(37,99,235,0.4)",
          borderRadius: 5,
          padding: navMobile ? "5px 8px" : "5px 12px",
          color: "#fff",
          cursor: pdfBusy ? "wait" : "pointer",
          fontSize: 12,
          fontWeight: 500,
          fontFamily: FONT,
          letterSpacing: "0.06em",
          display: "flex", alignItems: "center", gap: 5,
          flexShrink: 0,
          opacity: pdfBusy ? 0.6 : 1,
          transition: "opacity 0.2s",
        }}>
          {pdfBusy ? (
            <span style={{ display:"inline-block", width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          )}
          {navMobile ? (pdfBusy ? "…" : "") : (pdfBusy ? "Generating…" : "PDF")}
        </button>

        {/* Divider + Hamburger nav */}
        <div style={{ width:1, height:14, background:"rgba(255,255,255,0.12)", flexShrink:0 }}/>
        <HamburgerMenu currentPage="Sample Report" />

      </div>

      {/* Report page */}
      <div style={{ display:"flex", justifyContent:"center", overflowX:"hidden" }}>
        <div data-pdf-target style={{ width:"100%", maxWidth:1100 }}>
          {page.node}
          {/* Bottom navigation */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: navMobile ? "16px 12px" : "24px 36px",
            background: "rgba(8,15,30,0.9)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            gap: 8,
          }}>
            <span onClick={cur>0?prev:undefined} style={{ fontFamily:FONT, fontSize:navMobile?12:13, fontWeight:300, color:P.dim, cursor:cur>0?"pointer":"default", visibility:cur===0?"hidden":"visible", flexShrink:0 }}>{"\u2190"} {navMobile?"Prev":"Previous section"}</span>
            <span style={{ fontFamily:FONT, fontSize:12, color:P.muted, flexShrink:0 }}>{cur+1}/{pages.length}</span>
            <span onClick={cur<pages.length-1?next:undefined} style={{ fontFamily:FONT, fontSize:navMobile?12:13, fontWeight:300, color:P.dim, cursor:cur<pages.length-1?"pointer":"default", visibility:cur===pages.length-1?"hidden":"visible", flexShrink:0 }}>{navMobile?"Next":"Next section"} {"\u2192"}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
