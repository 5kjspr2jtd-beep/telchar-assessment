import { useState, useEffect } from "react";
import { scoreColor, scoreTier } from "../design/telcharDesign";

// ─────────────────────────────────────────────────────────────
// TELCHAR AI · AI Readiness Assessment Report
// Consulting document design system
// Warm paper · Navy header/footer · IBM Plex Sans
// ─────────────────────────────────────────────────────────────

const HDECAL = "data:image/png;base64,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";

// ── Color system ─────────────────────────────────────────────
const P = {
  paper:      "#F5F0E8",
  paperShade: "#EDE6D6",
  paperRule:  "#CEC4B2",
  navy:       "#0E1B2D",
  navyText:   "#8AACC8",
  navyDim:    "#253848",
  navyFaint:  "#162438",
  gold:       "#B8912A",
  goldLight:  "#CAAA4E",
  goldFaint:  "#E4D5AA",
  ink:        "#1A1714",
  inkMid:     "#3C3530",
  inkLight:   "#6A6055",
  inkFaint:   "#A89C8C",
  green:      "#4E7C45",
  amber:      "#B8912A",
  red:        "#8A2A2A",
};

// ── Score utilities ──────────────────────────────────────────

// Score color + tier labels imported from shared design system (scoreColor, scoreTier)

// ── Data ─────────────────────────────────────────────────────
const CO  = "Meridian Roofing Group";
const IND = "Construction / Trades";
const DATE = new Date().toLocaleDateString("en-US", { month:"long", year:"numeric" });
const BENCHMARK = 51;

// Tools this client uses — drives dynamic Make template links
const CLIENT_TOOLS = ["QuickBooks", "Gmail", "Google Calendar"];

// Build a Make template search URL using their actual tools + weakest category
const getMakeTemplateUrl = () => {
  const weakest = [...SCORES.cats].sort((a,b)=>a.score-b.score)[0];
  const catKeyword = {
    operations:"invoice", sales:"follow-up", data:"reporting",
    content:"content", technology:"automation",
  }[weakest?.key] || "automation";
  const toolQuery = CLIENT_TOOLS.slice(0,2).map(t=>t.replace(/ /g,"+")).join("+");
  return "https://www.make.com/en/templates?page=1&q=" + toolQuery + "+" + catKeyword;
};

const SCORES = {
  overall: 54,
  cats: [
    { key:"operations", label:"Operations Efficiency",          score:48 },
    { key:"sales",      label:"Sales & Customer Experience",    score:52 },
    { key:"data",       label:"Data & Performance Visibility",  score:42 },
    { key:"content",    label:"Content & Knowledge Management", score:58 },
    { key:"technology", label:"Technology Readiness",           score:62 },
  ]
};

const WINS = [
  { n:1, cat:"Data & Performance Visibility", title:"Connect Your Tools into a Single Automated Workflow",
    desc:"Your data lives in QuickBooks, Gmail, and spreadsheets that don't talk to each other. Make connects them and automates the handoffs — job completed triggers invoice, invoice triggers follow-up, data feeds your dashboard. One platform manages all of it. Setup takes a few hours, not weeks.",
    time:"1-2 weeks", tool:"Make", toolCost:"From $9/mo" },
  { n:2, cat:"Operations Efficiency", title:"Automate Job Completion to Invoice to Follow-Up",
    desc:"Every completed job should trigger an invoice and a customer follow-up automatically. Build this once in Make. It runs every time, without supervision. Your crew closes the job in the field. QuickBooks and Gmail handle the rest.",
    time:"1 week", tool:"Make + Claude Pro", toolCost:"~$29/mo total" },
  { n:3, cat:"Sales & Customer Experience", title:"Use Claude to Draft Every Customer-Facing Message",
    desc:"Every quote follow-up, review request, and job summary can be drafted by Claude automatically. Make collects the job details, Claude writes the message, it lands in Gmail ready to send or goes out automatically. Your team stops writing the same emails manually every week.",
    time:"1-2 weeks", tool:"Make + Claude Pro", toolCost:"~$29/mo total" },
];

const STACK = {
  make: {
    name:"Make",
    role:"Central Command — connects your tools",
    url:"https://make.com",
    color:"#6E5FD8",
    pricing:"Free to start · $9/mo for 10,000 runs",
    totalNote:"Start free, upgrade when ready",
    desc:"Make is a visual tool that connects the software you already use — QuickBooks, Gmail, Google Calendar — and automates the handoffs between them. You draw the workflow on screen like a flowchart. No code. No IT help needed. When a job closes in the field, Make triggers the invoice, sends the follow-up, and updates your dashboard. You set it up once. It runs on its own.",
    examples:[
      "Job closed in field → invoice sent → customer follow-up delivered",
      "New lead fills out form → contact added to your list → sequence starts",
      "Every Monday: pull last week's numbers → update dashboard → email summary to you"
    ],
    resources:[
      { label:"What is Make? (official explainer)", url:"https://help.make.com/what-is-make" },
      { label:"Create a free Make account", url:"https://www.make.com/en/register" },
      { label:"See templates built for your tools", url:getMakeTemplateUrl() },
    ]
  },
  claude: {
    name:"Claude",
    role:"AI writing and thinking — inside your workflows",
    url:"https://claude.ai",
    color:"#C96442",
    pricing:"Free to try · $20/mo for Pro (includes Cowork)",
    totalNote:"Make + Claude Pro: ~$29/mo total",
    desc:"Claude is an AI assistant made by Anthropic. Think of it as a very capable employee who reads your job notes and drafts a professional email, writes a social post from a photo you took, or summarizes your week in plain English. Claude works inside your Make automations as a step — it gets the details, writes the output, sends it where it needs to go. You review or it goes automatically.",
    examples:[
      "Job completed → Claude drafts a personalized review request → Gmail sends it",
      "Photo of finished work → Claude writes a social caption → ready for your approval",
      "End of week → Claude reads your numbers → writes a plain-English summary for you"
    ],
    resources:[
      { label:"Try Claude free — no account needed to start", url:"https://claude.ai" },
      { label:"How Claude is different from ChatGPT", url:"https://www.anthropic.com/claude" },
      { label:"How to add Claude as a step in Make", url:"https://www.make.com/en/integrations/anthropic-claude" },
    ]
  },
  cowork: {
    name:"Claude Cowork",
    role:"Your AI operator — runs tasks you ask for",
    url:"https://claude.ai",
    color:"#C9A84C",
    pricing:"Included with Claude Pro ($20/mo)",
    totalNote:"No extra cost — comes with Claude Pro",
    desc:"Cowork is a desktop tool from Anthropic. Once your tools are connected through Make, Cowork lets you operate them by typing what you need in plain language. You do not log into a dashboard or pull a report. You type 'show me open quotes from this week' and it pulls them. Type 'draft follow-ups for jobs we finished yesterday' and it drafts them. It works across your connected tools without you navigating between them.",
    examples:[
      "Type: Show me all open quotes from the last 7 days",
      "Type: Draft follow-ups for jobs completed this week",
      "Type: What did we bill last month vs the month before"
    ],
    resources:[
      { label:"What is Cowork? (Anthropic product page)", url:"https://www.anthropic.com/products/claude-for-work" },
      { label:"Get Claude Pro — Cowork is included", url:"https://claude.ai/upgrade" },
      { label:"See all Claude Pro features", url:"https://www.anthropic.com/claude" },
    ]
  },
  code: {
    name:"Claude Code",
    role:"Custom tools built for your exact process",
    url:"https://claude.ai",
    color:"#22C55E",
    pricing:"Included with Claude Pro or Max",
    totalNote:"No extra cost on Claude Pro",
    desc:"Claude Code builds software tools customized to how your business actually works. A job intake form that feeds directly into QuickBooks. A cost estimator your customers can use on your website. A dashboard that shows your 5 most important numbers, updated automatically. You do not build this yourself. Telchar AI scopes it, Claude Code builds it, and you get a tool that fits your workflow exactly — with no monthly seat fee.",
    examples:[
      "Job intake form that feeds directly into QuickBooks — built once, runs forever",
      "Cost estimator on your website — customers get a number, you get a lead",
      "Internal dashboard showing revenue, close rate, and open jobs — updated daily"
    ],
    resources:[
      { label:"What is Claude Code? (plain-English overview)", url:"https://www.anthropic.com/claude-code" },
      { label:"Examples of what Claude Code has built", url:"https://code.claude.com" },
      { label:"Ask Telchar AI if this fits your business", url:"https://telchar.ai" },
    ]
  }
};


const getCategoryTool = (catKey, score) => {
  const high = score < 55;
  const map = {
    operations: { key:"make",   focus:"Automate job completion → invoice → follow-up. One workflow, runs every time." },
    sales:      { key:"claude", focus:"Claude drafts every follow-up, quote response, and review request inside Make." },
    data:       { key:"make",   focus:"Make pulls your data on a schedule. Cowork reads it. You stop compiling spreadsheets." },
    content:    { key:"claude", focus:"Job photos and notes in → social posts and customer messages out. 20 minutes a week." },
    technology: { key:"cowork", focus:"Cowork operates your connected tools in plain language. No new UI. Start here." },
  };
  const m = map[catKey];
  return { ...m, high, tool: STACK[m.key] };
};


// ── Tier gates ───────────────────────────────────────────────
// FREE:    Cover + Score Summary + Quick Wins (1 win) + CTA
// STARTER: + all 5 Category pages + all 3 Quick Wins + Estimated Impact
// FULL:    + 90-Day Roadmap + Risk + Data Infra + Engagement

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

// ── Telchar design motifs ────────────────────────────────────

function Diamond({ size=8, fill=P.navy, stroke=P.goldLight, sw=1.5, style={} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10"
      style={{ display:"block", flexShrink:0, ...style }}>
      <polygon points="5,0 10,5 5,10 0,5" fill={fill} stroke={stroke} strokeWidth={sw}/>
    </svg>
  );
}

function Rule({ diamond=false, weight=1, style={} }) {
  if (diamond) return (
    <div style={{ display:"flex", alignItems:"center", gap:12, ...style }}>
      <div style={{ flex:1, height:weight, background:P.paperRule }}/>
      <Diamond size={8} fill={P.goldLight} stroke="none" sw={0}/>
      <div style={{ flex:1, height:weight, background:P.paperRule }}/>
    </div>
  );
  return <div style={{ height:weight, background:P.paperRule, ...style }}/>;
}

// Five-segment analytical scale + floating diamond marker
function SegScale({ score }) {
  const col = scoreColor(score);
  return (
    <div style={{ width:"100%" }}>
      <div style={{ position:"relative", marginBottom:5 }}>
        <div style={{
          position:"absolute", top:-9,
          left:`clamp(4px, ${score}%, calc(100% - 4px))`,
          transform:"translateX(-50%)", zIndex:3,
        }}>
          <Diamond size={9} fill={P.navy} stroke={P.goldLight} sw={1.5}/>
        </div>
        <div style={{ display:"flex", gap:3, height:10 }}>
          {Array.from({length:5}).map((_,i) => {
            const from = i/5*100, to = (i+1)/5*100;
            const full = score >= to;
            const part = score > from && score < to;
            return (
              <div key={i} style={{ flex:1, height:"100%", background:P.paperRule, position:"relative", overflow:"hidden" }}>
                {(full||part) && <div style={{
                  position:"absolute", top:0, left:0, bottom:0,
                  width: full ? "100%" : `${((score-from)/(to-from))*100}%`,
                  background: col,
                }}/>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        {[0,20,40,60,80,100].map(n=>(
          <span key={n} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:P.inkFaint }}>{n}</span>
        ))}
      </div>
    </div>
  );
}

function SecLabel({ children, style={} }) {
  return (
    <div style={{
      fontFamily:"'IBM Plex Sans',sans-serif",
      fontSize:12, fontWeight:700,
      letterSpacing:"0.22em", textTransform:"uppercase",
      color:P.inkFaint, marginBottom:14, ...style,
    }}>{children}</div>
  );
}

// ── Page shell ───────────────────────────────────────────────
function ReportPage({ children, pg, total }) {
  const w = useWidth();
  const mobile = w < 640;
  return (
    <div style={{
      width:"100%",
      background:P.paper,
      boxShadow:mobile?"none":"0 8px 48px rgba(0,0,0,0.28)",
      display:"flex", flexDirection:"column",
      minHeight:"100vh",
    }}>
      {/* Header — client-focused, no logo repeat */}
      <div style={{
        background:P.navy, flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 36px", height:56,
      }}>
        <div>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, fontWeight:600, color:"#E6EEF8", lineHeight:1.2 }}>{CO}</div>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:"#9BB1C7", marginTop:2, letterSpacing:"0.04em" }}>{IND}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:P.navyFaint, marginBottom:2 }}>Telchar AI Readiness Index{"\u2122"}</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:"#9BB1C7", letterSpacing:"0.1em" }}>Confidential · {DATE}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, padding:mobile?"24px 20px 0":"44px 36px 0" }}>
        {children}
      </div>

      <div style={{ height:36 }}/>

      {/* Footer */}
      <div style={{
        background:P.navy, height:38, flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 36px",
      }}>
        <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:500, letterSpacing:"0.2em", textTransform:"uppercase", color:"#9BB1C7" }}>Telchar AI · Confidential</span>
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:"#9BB1C7", letterSpacing:"0.1em" }}>Page {pg} of {total}</span>
      </div>
    </div>
  );
}

// ── Paywall block ─────────────────────────────────────────────
function Paywall({ tier, onUpgrade }) {
  const cfg = tier === "free"
    ? { label:"Starter Report — $50", desc:"Unlock detailed category analysis with improvement guidance and benchmarks for all five dimensions.", color:P.gold }
    : { label:"Full Scorecard — $150", desc:"Unlock your 90-day implementation roadmap, risk analysis, data infrastructure plan, and engagement pathway.", color:"#2D6FBA" };
  return (
    <div style={{ background:P.paperShade, borderLeft:`3px solid ${cfg.color}`, padding:"20px 24px", marginTop:32 }}>
      <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:cfg.color, marginBottom:8 }}>{cfg.label}</div>
      <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, color:P.inkMid, lineHeight:1.7, margin:"0 0 14px" }}>{cfg.desc}</p>
      <button onClick={onUpgrade} style={{
        fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700,
        letterSpacing:"0.1em", textTransform:"uppercase",
        padding:"9px 20px", background:cfg.color, color:"#fff", border:"none", cursor:"pointer",
      }}>Unlock Report</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 1 — COVER
// ═══════════════════════════════════════════════════════════
function PageCover({ pg, total }) {
  return (
    <div style={{
      width:"100%",
      background:P.navy,
      boxShadow:"0 8px 48px rgba(0,0,0,0.28)",
      minHeight:"100vh",
      display:"flex", flexDirection:"column",
    }}>
      {/* Top strip */}
      <div style={{ height:3, background:P.gold, flexShrink:0 }}/>

      {/* Content */}
      <div style={{ flex:1, padding:"52px 48px 0", display:"flex", flexDirection:"column" }}>
        <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"#9BB1C7", marginBottom:12 }}>Telchar AI Readiness Index{"\u2122"}</div>

        <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:36, fontWeight:700, color:"#E4EEF8", lineHeight:1.1, letterSpacing:"-0.01em", marginBottom:8 }}>
          {CO}
        </div>
        <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:16, color:"#9BB1C7", marginBottom:48 }}>{IND}</div>

        <Rule diamond={false} style={{ borderTop:`1px solid #162438`, height:0, marginBottom:40 }}/>

        {/* Score preview on cover */}
        <div style={{ display:"flex", alignItems:"baseline", gap:16, marginBottom:12 }}>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:80, fontWeight:700, color:scoreColor(SCORES.overall), lineHeight:1, letterSpacing:"-0.04em" }}>{SCORES.overall}</div>
          <div>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:14, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:scoreColor(SCORES.overall), marginBottom:4 }}>{scoreTier(SCORES.overall)}</div>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, color:"#9BB1C7" }}>out of 100</div>
          </div>
        </div>

        <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, color:"#9BB1C7", lineHeight:1.7, maxWidth:520, marginBottom:48 }}>
          This report presents findings from the Telchar AI Readiness Index{"\u2122"} across five operational dimensions. Scores reflect self-reported data collected via structured questionnaire and facilitated analysis.
        </div>

        <div style={{ display:"flex", gap:32 }}>
          {[["Assessment date", DATE],["Framework","v2.4 · Five Category"],["Classification","Confidential"]].map(([k,v])=>(
            <div key={k}>
              <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#9BB1C7", marginBottom:4 }}>{k}</div>
              <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, fontWeight:500, color:"#E6EEF8" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop:`1px solid #162438`, height:38, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 48px", flexShrink:0 }}>
        <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:500, letterSpacing:"0.2em", textTransform:"uppercase", color:"#9BB1C7" }}>Telchar AI · Confidential</span>
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:"#9BB1C7" }}>Page {pg} of {total}</span>
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

  const sorted  = [...SCORES.cats].sort((a,b)=>a.score-b.score);
  const lowest2 = sorted.slice(0,2).map(c=>c.label).join(" and ");
  const delta   = SCORES.overall - BENCHMARK;
  const interp  = `A score of ${SCORES.overall} places ${CO} in the ${scoreTier(SCORES.overall)} tier, ${delta >= 0 ? delta + " points above" : Math.abs(delta) + " points below"} the SMB benchmark of ${BENCHMARK}. ${SCORES.overall < 65 ? "The organization has established operational infrastructure but carries identifiable automation gaps across scheduling, reporting, and customer follow-up." : "The organization demonstrates strong operational foundations with clear opportunity for targeted AI implementation."} ${lowest2} represent the most direct path to measurable improvement within a structured 90-day window.`;

  return (
    <ReportPage pg={pg} total={total}>
      {/* Section 1: Overall Score */}
      <div style={{ display:desktop?"grid":"block", gridTemplateColumns:desktop?"200px 1fr":undefined, gap:desktop?52:0, marginBottom:36 }}>
        
        {/* Left: score */}
        <div style={{ marginBottom:desktop?0:32 }}>
          <SecLabel>Overall Score</SecLabel>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:mobile?88:108, fontWeight:700, color:scoreColor(SCORES.overall), lineHeight:0.88, letterSpacing:"-0.05em", marginBottom:10 }}>{animated}</div>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:scoreColor(SCORES.overall), borderBottom:`2px solid ${scoreColor(SCORES.overall)}44`, paddingBottom:3, display:"inline-block", marginBottom:24 }}>{scoreTier(SCORES.overall)}</div>
          <div style={{ borderTop:`1px solid ${P.paperRule}` }}>
            {[["Industry",IND],["Categories","5 of 5 scored"],["SMB benchmark",`${BENCHMARK} / 100`]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"8px 0", borderBottom:`1px solid ${P.paperRule}`, gap:8 }}>
                <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:P.inkFaint, flexShrink:0 }}>{k}</span>
                <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, fontWeight:500, color:P.inkMid, textAlign:"right" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: interpretation */}
        <div style={{ paddingTop:desktop?30:0 }}>
          <SecLabel>Score interpretation</SecLabel>
          <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:mobile?13.5:14, color:P.inkMid, lineHeight:1.9, margin:"0 0 28px" }}>{interp}</p>
          {/* Benchmark block */}
          <div style={{ background:P.paperShade, borderLeft:`3px solid ${P.goldLight}`, padding:"14px 18px" }}>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:P.inkFaint, marginBottom:12 }}>Score vs. SMB benchmark</div>
            <div style={{ display:"flex" }}>
              {[["Your score",SCORES.overall,P.navy],["SMB average",BENCHMARK,P.inkLight],["Delta",(delta>=0?"+":"")+delta,delta>=0?P.green:P.amber]].map(([label,val,col],i)=>(
                <div key={label} style={{ paddingRight:i<2?20:0, paddingLeft:i>0?20:0, borderRight:i<2?`1px solid ${P.paperRule}`:"none" }}>
                  <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:P.inkFaint, marginBottom:4 }}>{label}</div>
                  <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:22, fontWeight:700, color:col, lineHeight:1 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Rule diamond={true} style={{ marginBottom:32 }}/>

      {/* Section 2: Category Breakdown */}
      <SecLabel>Category breakdown</SecLabel>
      <div style={{ display:"grid", gridTemplateColumns:mobile?"44px 1fr 82px":"60px 1fr 110px", gap:mobile?12:22, paddingBottom:8, borderBottom:`2px solid ${P.ink}` }}>
        {["Score","Category & scale","Maturity"].map((h,i)=>(
          <div key={h} style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:P.inkLight, textAlign:i===0?"center":i===2?"right":"left" }}>{h}</div>
        ))}
      </div>
      {SCORES.cats.map(cat=>{
        const col = scoreColor(cat.score);
        return (
          <div key={cat.key} style={{ display:"grid", gridTemplateColumns:mobile?"44px 1fr 82px":"60px 1fr 110px", gap:mobile?12:22, padding:mobile?"14px 0 10px":"18px 0 12px", borderBottom:`1px solid ${P.paperRule}`, alignItems:"start" }}>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:mobile?26:32, fontWeight:700, color:col, textAlign:"center", lineHeight:1, paddingTop:2 }}>{cat.score}</div>
            <div>
              <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:mobile?12:13.5, fontWeight:500, color:P.ink, marginBottom:10 }}>{cat.label}</div>
              <SegScale score={cat.score}/>
            </div>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:mobile?8:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:col, textAlign:"right", paddingTop:4 }}>{scoreTier(cat.score)}</div>
          </div>
        );
      })}

      {/* Paywall for free */}
      {!demo && tier === "free" && <Paywall tier="free" onUpgrade={onUpgrade}/>}
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 3 — QUICK WINS (free: 1 win; starter+: all 3)
// ═══════════════════════════════════════════════════════════
function PageQuickWins({ pg, total, tier, onUpgrade, demo }) {
  const w = useWidth();
  const mobile = w < 640;
  const visibleWins = (!demo && tier === "free") ? WINS.slice(0,1) : WINS;

  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>Priority improvement areas</SecLabel>
      <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:mobile?13:14, color:P.inkMid, lineHeight:1.8, marginBottom:28 }}>
        Three actions. Each executable within two weeks using Make and Claude. No new platforms required. Total cost under $30 per month.
      </div>

      {visibleWins.map((w,i)=>(
        <div key={i} style={{ marginBottom:28, paddingBottom:28, borderBottom:i<visibleWins.length-1?`1px solid ${P.paperRule}`:"none" }}>
          <div style={{ display:"grid", gridTemplateColumns:"24px 1fr", gap:14 }}>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, color:P.inkFaint, paddingTop:4, letterSpacing:"0.1em" }}>0{i+1}</div>
            <div>
              <div style={{ display:"flex", gap:10, alignItems:"baseline", flexWrap:"wrap", marginBottom:6 }}>
                <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:mobile?13:15, fontWeight:700, color:P.ink }}>{w.title}</div>
                <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:P.goldLight }}>{w.cat}</span>
              </div>
              <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, color:P.inkLight, lineHeight:1.75, margin:"0 0 14px" }}>{w.desc}</p>
              <div style={{ display:"flex", gap:0, borderTop:`1px solid ${P.paperRule}`, paddingTop:10 }}>
                {[["Built with",w.tool],["Monthly cost",w.toolCost],["Timeline",w.time]].map(([k,v],j)=>(
                  <div key={k} style={{ paddingRight:j<2?20:0, paddingLeft:j>0?20:0, borderRight:j<2?`1px solid ${P.paperRule}`:"none" }}>
                    <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:P.inkFaint, marginBottom:3 }}>{k}</div>
                    <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:600, color:P.ink }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {!demo && tier === "free" && <Paywall tier="free" onUpgrade={onUpgrade}/>}

      {/* Estimated impact — starter+ */}
      {(demo || tier !== "free") && (() => {
        const items = [["Manual hours recovered","12 – 18 hrs / week"],["Estimated annual value","$28,000 – $44,000"],["Estimated payback","Under 90 days"]];
        return (
          <div style={{ marginTop:32 }}>
            <Rule diamond={true} style={{ marginBottom:28 }}/>
            <SecLabel>Estimated impact — 90-day implementation</SecLabel>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:0 }}>
              {items.map(([label,val],i)=>(
                <div key={label} style={{ paddingRight:i<2?24:0, paddingLeft:i>0?24:0, borderRight:i<2?`1px solid ${P.paperRule}`:"none" }}>
                  <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:P.inkFaint, marginBottom:6 }}>{label}</div>
                  <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:15, fontWeight:700, color:P.gold }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:P.inkFaint, lineHeight:1.7 }}>
              Estimates based on SMB automation benchmarks across comparable operational profiles. Actual results depend on implementation scope and workflow complexity.
            </div>
            {!demo && tier === "starter" && <Paywall tier="starter" onUpgrade={onUpgrade}/>}
          </div>
        );
      })()}
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 4-8 — CATEGORY DEEP DIVE (starter + full)
// ═══════════════════════════════════════════════════════════
function PageCategory({ catKey, pg, total }) {
  const cat  = SCORES.cats.find(c=>c.key===catKey);
  const rec  = getCategoryTool(catKey, cat.score);
  const tool = rec.tool;
  const w    = useWidth();
  const mobile = w < 640;

  const guidance = {
    operations: "Scheduling, dispatch, and job-to-invoice handoffs are the highest-friction manual processes in this category. A single Make workflow connecting your field tools to QuickBooks eliminates the most common failure points.",
    sales:      "Pipeline leakage between day two and day ten post-quote is recoverable without new lead generation. Claude-drafted follow-up sequences running automatically inside Make address this directly.",
    data:       "Reporting relies on manual compilation. Connecting QuickBooks to a lightweight dashboard layer through Make replaces weekly spreadsheet work with a live view of revenue, margins, and open jobs.",
    content:    "Customer-facing content is produced inconsistently. Claude running inside Make workflows converts job notes and photos into draft social posts and review requests in under a minute per job.",
    technology: "Core tools are in place and the team demonstrates adoption capacity. The gap is integration — tools that do not talk to each other create the manual work that Make is designed to eliminate.",
  };

  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>Category analysis</SecLabel>

      {/* Category header row */}
      <div style={{ display:"flex", gap:mobile?16:32, alignItems:"flex-start", marginBottom:28, paddingBottom:24, borderBottom:`1px solid ${P.paperRule}` }}>
        <div style={{ flexShrink:0 }}>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:72, fontWeight:700, color:scoreColor(cat.score), lineHeight:1, letterSpacing:"-0.04em" }}>{cat.score}</div>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:scoreColor(cat.score), marginTop:4 }}>{scoreTier(cat.score)}</div>
        </div>
        <div style={{ flex:1, paddingTop:8 }}>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:mobile?16:20, fontWeight:700, color:P.ink, marginBottom:12 }}>{cat.label}</div>
          <SegScale score={cat.score}/>
        </div>
      </div>

      <Rule diamond={true} style={{ marginBottom:24 }}/>

      {/* Analysis */}
      <SecLabel>Analysis</SecLabel>
      <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:mobile?13:14, color:P.inkMid, lineHeight:1.9, marginBottom:28 }}>{guidance[catKey]}</p>

      {/* Benchmark comparison */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:0, marginBottom:28, paddingBottom:28, borderBottom:`1px solid ${P.paperRule}` }}>
        {[["Your score",cat.score,scoreColor(cat.score)],["SMB average",BENCHMARK,P.inkLight],["Delta",(cat.score-BENCHMARK>=0?"+":"")+(cat.score-BENCHMARK),cat.score>=BENCHMARK?P.green:P.amber]].map(([label,val,col],i)=>(
          <div key={label} style={{ paddingRight:i<2?20:0, paddingLeft:i>0?20:0, borderRight:i<2?`1px solid ${P.paperRule}`:"none" }}>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:P.inkFaint, marginBottom:4 }}>{label}</div>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:22, fontWeight:700, color:col }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Recommended tool */}
      <SecLabel>Recommended approach</SecLabel>
      <div style={{ background:P.paperShade, borderLeft:`3px solid ${tool.color}`, padding:"18px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8, flexWrap:"wrap", gap:8 }}>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:16, fontWeight:700, color:P.ink }}>{tool.name}</div>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:tool.color }}>{tool.role}</div>
        </div>
        <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:P.inkLight, lineHeight:1.75, margin:"0 0 14px" }}>{rec.focus}</p>
        <div style={{ borderTop:`1px solid ${P.paperRule}`, paddingTop:12 }}>
          <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:P.inkFaint, marginBottom:8 }}>How it applies here</div>
          {tool.examples.map((ex,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
              <Diamond size={6} fill={tool.color} stroke="none" sw={0} style={{ marginTop:3 }}/>
              <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:P.inkMid, lineHeight:1.6 }}>{ex}</span>
            </div>
          ))}
        </div>
      </div>
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE 9 — 90-DAY ROADMAP (full only)
// ═══════════════════════════════════════════════════════════
function PageRoadmap({ pg, total }) {
  const w = useWidth(); const mobile = w < 640;
  const phases = [
    { phase:"Phase 1", label:"Quick Wins", window:"Weeks 1 – 4", color:P.gold,
      steps:["Identify and document the two lowest-scoring workflow areas","Deploy Make account and connect existing tools (QuickBooks, Gmail, Calendar)","Build job-completion-to-invoice automation — the highest-friction handoff","Deploy Claude inside Make for automated customer follow-up drafting","Establish baseline metrics: hours saved, invoices auto-sent, response time"] },
    { phase:"Phase 2", label:"Core Implementation", window:"Weeks 5 – 12", color:P.green,
      steps:["Extend automation to remaining priority categories based on scorecard ranking","Build live performance dashboard connected to QuickBooks and sales data","Implement automated quote follow-up sequence at day 2, day 5, and day 10","Train team on Cowork for plain-language task execution across connected tools","Validate all workflows against defined success metrics before sign-off"] },
    { phase:"Phase 3", label:"Optimization", window:"Months 4 – 6", color:"#2D6FBA",
      steps:["Review 90-day performance data against baseline metrics","Identify compounding opportunities in adjacent workflows","Expand proven systems to additional use cases","Quarterly review cadence established — monthly if on retainer","Identify next implementation phase based on updated scorecard"] },
  ];

  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>90-Day implementation roadmap</SecLabel>
      <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:mobile?13:14, color:P.inkMid, lineHeight:1.8, marginBottom:32 }}>
        Structured as three progressive phases. Each phase builds on the prior without disrupting operational continuity. Implementation is scoped, milestone-driven, and delivered by Telchar AI in collaboration with your team.
      </p>

      {phases.map((ph,i)=>(
        <div key={ph.phase} style={{ marginBottom:28, paddingBottom:28, borderBottom:i<phases.length-1?`1px solid ${P.paperRule}`:"none" }}>
          <div style={{ display:"grid", gridTemplateColumns:mobile?"1fr":"140px 1fr", gap:mobile?12:24, alignItems:"start" }}>
            <div>
              <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:ph.color, marginBottom:4 }}>{ph.phase}</div>
              <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:15, fontWeight:700, color:P.ink, marginBottom:4 }}>{ph.label}</div>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:P.inkFaint, letterSpacing:"0.04em" }}>{ph.window}</div>
            </div>
            <div>
              {ph.steps.map((s,j)=>(
                <div key={j} style={{ display:"flex", gap:10, marginBottom:8 }}>
                  <Diamond size={6} fill={ph.color} stroke="none" sw={0} style={{ marginTop:3, flexShrink:0 }}/>
                  <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:P.inkMid, lineHeight:1.65 }}>{s}</span>
                </div>
              ))}
            </div>
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
  const risks = [
    { label:"Tool integration gaps", severity:"Medium", desc:"Make requires active integrations for each tool in use. If a tool does not have a Make connector, custom API configuration may be needed. Identify all tools in the stack before build begins." },
    { label:"Team adoption friction", severity:"Low", desc:"Cowork operates through natural language, which reduces the learning curve significantly. Brief team orientation on what is automated — and what is not — prevents confusion." },
    { label:"Data quality issues", severity:"Medium", desc:"Automation is only as reliable as the data it processes. Inconsistent job records or duplicate entries in QuickBooks will produce incorrect outputs. A data audit is recommended before automation is deployed at scale." },
    { label:"Scope creep", severity:"Low", desc:"AI capability expands quickly. Attempting to automate too many workflows simultaneously increases risk and reduces quality. The phased roadmap is structured to prevent this by design." },
  ];
  const sCol = { High:P.red, Medium:P.amber, Low:P.green };
  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>Risk analysis</SecLabel>
      <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:14, color:P.inkMid, lineHeight:1.8, marginBottom:28 }}>
        Four implementation risks identified based on assessment findings. All are manageable within a structured engagement. None represent blockers.
      </p>
      {risks.map((r,i)=>(
        <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 80px", gap:20, paddingBottom:18, marginBottom:18, borderBottom:i<risks.length-1?`1px solid ${P.paperRule}`:"none", alignItems:"start" }}>
          <div>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, fontWeight:700, color:P.ink, marginBottom:6 }}>{r.label}</div>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:P.inkLight, lineHeight:1.7 }}>{r.desc}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:P.inkFaint, marginBottom:4 }}>Severity</div>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, fontWeight:700, color:sCol[r.severity]||P.ink }}>{r.severity}</div>
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
    { label:"Source systems", desc:"QuickBooks (financial), Gmail (communications), Google Calendar (scheduling). These are the authoritative data sources. All automation reads from and writes to these systems." },
    { label:"Integration layer", desc:"Make connects the source systems and routes data between them on a defined schedule or trigger. No data is duplicated manually — it flows through Make automatically." },
    { label:"Intelligence layer", desc:"Claude receives structured inputs from Make (job details, customer records, financial summaries) and produces outputs (drafted messages, summaries, analysis). Outputs are delivered back through Make." },
    { label:"Visibility layer", desc:"A lightweight dashboard (Looker Studio or equivalent, cost: $0) pulls from QuickBooks and Make data to provide a live view of business performance without manual compilation." },
  ];
  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>Data infrastructure plan</SecLabel>
      <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:14, color:P.inkMid, lineHeight:1.8, marginBottom:28 }}>
        A four-layer data architecture built on tools already in use. No new software subscriptions beyond Make and Claude Pro. Total infrastructure cost under $30 per month.
      </p>
      {layers.map((l,i)=>(
        <div key={i} style={{ display:"grid", gridTemplateColumns:"24px 1fr", gap:16, marginBottom:22, paddingBottom:22, borderBottom:i<layers.length-1?`1px solid ${P.paperRule}`:"none" }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:P.inkFaint, paddingTop:3, letterSpacing:"0.1em" }}>0{i+1}</div>
          <div>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, fontWeight:700, color:P.ink, marginBottom:6 }}>{l.label}</div>
            <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:P.inkLight, lineHeight:1.7 }}>{l.desc}</div>
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
  return (
    <ReportPage pg={pg} total={total}>
      <SecLabel>Engagement pathway</SecLabel>
      <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:14, color:P.inkMid, lineHeight:1.8, marginBottom:32 }}>
        Telchar AI operates a three-phase engagement model. Every client starts with Discovery. Implementation is scoped from Discovery findings. Retainer ensures ongoing performance.
      </p>

      {[
        { phase:"Discovery", price:"$3,500", window:"2 – 3 weeks", credit:"Full fee credits toward Implementation within 60 days",
          deliverables:["AI Readiness Scorecard","Gap Analysis","Opportunity Map","AI Implementation Roadmap","Executive Summary","Findings presentation (60 min)"] },
        { phase:"Implementation", price:"$10K – $25K", window:"4 – 12 weeks", credit:"Scoped from Discovery findings",
          deliverables:["Solution design and tool selection","Process automation build","Team training and onboarding","Acceptance testing","Defined scope, timeline, and success metric"] },
        { phase:"Retainer", price:"$1,500 – $3,000 / mo", window:"Ongoing", credit:"",
          deliverables:["Monthly performance review","Optimization and new use cases","Quarterly business review","Builds capability, not dependency"] },
      ].map((e,i)=>(
        <div key={e.phase} style={{ marginBottom:28, paddingBottom:28, borderBottom:i<2?`1px solid ${P.paperRule}`:"none" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10, flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:16, fontWeight:700, color:P.ink }}>{e.phase}</div>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:P.inkFaint, letterSpacing:"0.04em", marginTop:2 }}>{e.window}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:15, fontWeight:700, color:P.gold }}>{e.price}</div>
              {e.credit && <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:P.inkFaint, marginTop:2 }}>{e.credit}</div>}
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {e.deliverables.map((d,j)=>(
              <div key={j} style={{ display:"flex", gap:8, width:"100%", marginBottom:4 }}>
                <Diamond size={6} fill={P.goldLight} stroke="none" sw={0} style={{ marginTop:3, flexShrink:0 }}/>
                <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, color:P.inkMid, lineHeight:1.6 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* CTA */}
      <div style={{ background:P.navy, padding:"24px 28px", marginTop:8 }}>
        <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"#9BB1C7", marginBottom:8 }}>Next step</div>
        <div style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:18, fontWeight:700, color:"#E4EEF8", marginBottom:10 }}>Schedule a free 30-minute consultation</div>
        <p style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, color:"#9BB1C7", lineHeight:1.75, margin:"0 0 18px" }}>Review your findings, ask questions, and understand whether a Discovery engagement is the right next step. No obligation.</p>
        <button onClick={()=>alert("Production: opens calendar booking link.")} style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"14px 32px", background:P.gold, color:"#fff", border:"none", cursor:"pointer" }}>Book a Call</button>
      </div>
    </ReportPage>
  );
}

// ═══════════════════════════════════════════════════════════
// APP SHELL — tier gate + navigation
// ═══════════════════════════════════════════════════════════
// Map URL tier params to internal tier names
const TIER_MAP = { free:"free", report:"starter", plan:"full" };

export default function App({ initialTier = "free", demo = false }) {
  const mapped = demo ? "full" : (TIER_MAP[initialTier] || "free");
  const [tier, setTier] = useState(mapped);
  const [cur, setCur]   = useState(0);

  const upgrade = (newTier) => {
    setTier(newTier);
    setCur(0);
    window.scrollTo(0,0);
  };

  // Build page list based on tier
  const buildPages = (t) => {
    const effectiveTier = demo ? "full" : t;
    const total = effectiveTier==="full" ? 12 : effectiveTier==="starter" ? 8 : 3;
    const pages = [
      { label:"Cover",              node:<PageCover pg={1} total={total}/> },
      { label:"Score Summary",      node:<PageSummary pg={2} total={total} tier={effectiveTier} onUpgrade={()=>upgrade("starter")} demo={demo}/> },
      { label:"Quick Wins",         node:<PageQuickWins pg={3} total={total} tier={effectiveTier} onUpgrade={nt=>upgrade(nt)} demo={demo}/> },
    ];
    if (effectiveTier==="starter"||effectiveTier==="full") {
      pages.push(
        { label:"Operations",       node:<PageCategory catKey="operations" pg={4} total={total}/> },
        { label:"Sales",            node:<PageCategory catKey="sales"      pg={5} total={total}/> },
        { label:"Data",             node:<PageCategory catKey="data"       pg={6} total={total}/> },
        { label:"Content",          node:<PageCategory catKey="content"    pg={7} total={total}/> },
        { label:"Technology",       node:<PageCategory catKey="technology" pg={8} total={total}/> },
      );
    }
    if (effectiveTier==="full") {
      pages.push(
        { label:"90-Day Roadmap",   node:<PageRoadmap    pg={9}  total={total}/> },
        { label:"Risk Analysis",    node:<PageRisk       pg={10} total={total}/> },
        { label:"Data Infra",       node:<PageDataInfra  pg={11} total={total}/> },
        { label:"Engagement Path",  node:<PageEngagement pg={12} total={total}/> },
      );
    }
    return pages;
  };

  const pages = buildPages(tier);
  const page  = pages[Math.min(cur, pages.length-1)];

  const prev = () => { setCur(c=>Math.max(0,c-1)); window.scrollTo(0,0); };
  const next = () => { setCur(c=>Math.min(pages.length-1,c+1)); window.scrollTo(0,0); };

  return (
    <div style={{ minHeight:"100vh", background:P.paper, fontFamily:"'IBM Plex Sans','Helvetica Neue',Arial,sans-serif", overflowX:"clip", width:"100%" }}>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{overflow-x:clip;max-width:100vw;background:#F5F0E8;}
        button{font-family:inherit;}
      `}</style>

      {/* Navigation bar */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:P.navy, height:48, display:"flex", alignItems:"center", padding:"0 16px", gap:10, borderBottom:`1px solid ${P.navyFaint}`, boxShadow:"0 2px 10px rgba(0,0,0,0.15)" }}>

        {/* Prev — minimal text button */}
        <button onClick={prev} disabled={cur===0} style={{
          background:"none", border:"none", padding:"4px 2px",
          color:cur===0?P.navyFaint:P.goldLight,
          cursor:cur===0?"default":"pointer",
          fontSize:18, lineHeight:1,
          opacity:cur===0?0.25:1,
          flexShrink:0, display:"flex", alignItems:"center",
        }}>‹</button>

        {/* Logo */}
        <img src={HDECAL} style={{ height:14, width:"auto", filter:"brightness(0) invert(1)", flexShrink:0 }} alt="Telchar AI"/>

        <div style={{ width:1, height:12, background:P.navyFaint, flexShrink:0 }}/>

        {/* Page label — truncates gracefully */}
        <span style={{ fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, color:"#E6EEF8", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, minWidth:0 }}>{page.label}</span>

        {/* Tier tabs */}
        <div style={{ display:"flex", gap:3, flexShrink:0 }}>
          {[["free","Free"],["starter","$50"],["full","$150"]].map(([t,label])=>(
            <button key={t} onClick={()=>upgrade(t)} style={{
              fontFamily:"'IBM Plex Sans',sans-serif", fontSize:12, fontWeight:700,
              letterSpacing:"0.12em", textTransform:"uppercase",
              padding:"3px 7px",
              background:tier===t?P.gold+"22":"transparent",
              color:tier===t?P.goldLight:"#9BB1C7",
              border:`1px solid ${tier===t?P.gold+"55":P.navyFaint}`,
              cursor:"pointer",
            }}>{label}</button>
          ))}
        </div>

        {/* Page counter */}
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:"#9BB1C7", flexShrink:0, marginLeft:4 }}>{cur+1}/{pages.length}</span>

        {/* Next — minimal text button */}
        <button onClick={next} disabled={cur===pages.length-1} style={{
          background:"none", border:"none", padding:"4px 2px",
          color:cur===pages.length-1?P.navyFaint:P.goldLight,
          cursor:cur===pages.length-1?"default":"pointer",
          fontSize:18, lineHeight:1,
          opacity:cur===pages.length-1?0.25:1,
          flexShrink:0, display:"flex", alignItems:"center",
        }}>›</button>
      </div>

      {/* Report page — seamless paper background, no padding gap on mobile */}
      <div style={{ display:"flex", justifyContent:"center", overflowX:"hidden" }}>
        <div style={{ width:"100%", maxWidth:1100 }}>
          {page.node}
          {/* Bottom navigation */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"24px 36px", borderTop:"1px solid rgba(255,255,255,0.08)", background:P.navy }}>
            <span onClick={cur>0?prev:undefined} style={{ fontFamily:"'IBM Plex Sans', sans-serif", fontSize:13, color:"#9BB1C7", cursor:cur>0?"pointer":"default", visibility:cur===0?"hidden":"visible" }}>{"\u2190"} Previous section</span>
            <span style={{ fontFamily:"'IBM Plex Sans', sans-serif", fontSize:13, color:"#9BB1C7" }}>Page {cur+1} of {pages.length}</span>
            <span onClick={cur<pages.length-1?next:undefined} style={{ fontFamily:"'IBM Plex Sans', sans-serif", fontSize:13, color:"#9BB1C7", cursor:cur<pages.length-1?"pointer":"default", visibility:cur===pages.length-1?"hidden":"visible" }}>Next section {"\u2192"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
