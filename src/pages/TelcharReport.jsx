import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TELCHAR as P, FONT, SERIF, GOOGLE_FONTS_URL, TEXT, LIGHT_TEXT, TYPE, CTA, scoreColor, scoreTier, Diamond, Rule, SecLabel } from "../design/telcharDesign";

// ─────────────────────────────────────────────────────────────
// TELCHAR AI · AI Readiness Assessment Report
// Consulting document design system
// Dark navy · Electric blue accent · DM Sans + Instrument Serif
// ─────────────────────────────────────────────────────────────

// ── Demo / sample data (Meridian Roofing Group) ─────────────
const DEMO_CO  = "Meridian Roofing Group";
const DEMO_IND = "Construction / Trades";
const DEMO_CLIENT_TOOLS = ["QuickBooks", "Gmail", "Google Calendar"];
const DEMO_SCORES = {
  overall: 54,
  cats: [
    { key:"operations", label:"Operations Efficiency",          score:48 },
    { key:"sales",      label:"Sales & Customer Experience",    score:52 },
    { key:"data",       label:"Data & Performance Visibility",  score:42 },
    { key:"content",    label:"Content & Knowledge Management", score:58 },
    { key:"technology", label:"Technology Readiness",           score:62 },
  ]
};
const DEMO_WINS = [
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

// ── Mutable report data — overwritten from sessionStorage for real users ──
let CO  = DEMO_CO;
let IND = DEMO_IND;
let CLIENT_TOOLS = DEMO_CLIENT_TOOLS;
let SCORES = DEMO_SCORES;
let WINS = DEMO_WINS;

const DATE = new Date().toLocaleDateString("en-US", { month:"long", year:"numeric" });
const BENCHMARK = 51;

// Category labels used by the assessment scoring system
const CATEGORY_LABELS = {
  operations: "Operations Efficiency",
  sales:      "Sales & Customer Experience",
  data:       "Data & Performance Visibility",
  content:    "Content & Knowledge Management",
  technology: "Technology Readiness",
};

// Load real assessment data from sessionStorage (called at render time)
function loadAssessmentData() {
  try {
    const saved = sessionStorage.getItem("telchar_assessment_data");
    if (!saved) return false;
    const data = JSON.parse(saved);
    if (!data.scores || !data.scores.overall) return false;

    // Map assessment scores → report SCORES format
    const cats = Object.entries(data.scores.categories || {}).map(([key, cat]) => ({
      key,
      label: cat.label || CATEGORY_LABELS[key] || key,
      score: cat.score,
    }));
    SCORES = { overall: data.scores.overall, cats };

    // Company name and industry from answers
    if (data.answers) {
      CO  = data.answers.company_name || "Your Business";
      IND = data.answers.industry     || "General";
    }

    // Map assessment quick wins → report WINS format
    if (data.quickWins && data.quickWins.length > 0) {
      WINS = data.quickWins.map((w, i) => ({
        n: i + 1,
        cat: w.category || "",
        title: w.title || "",
        desc: w.desc || "",
        time: "2-4 weeks",
        tool: "Make + Claude Pro",
        toolCost: "~$29/mo total",
      }));
    }

    // Derive tools from answers if available
    if (data.answers) {
      const tools = [];
      if (data.answers.performance_tracking === "Accounting software like QuickBooks") tools.push("QuickBooks");
      tools.push("Gmail", "Google Calendar");
      CLIENT_TOOLS = tools;
    }

    return true;
  } catch (e) {
    return false;
  }
}

// Reset to demo data
function loadDemoData() {
  CO = DEMO_CO;
  IND = DEMO_IND;
  CLIENT_TOOLS = DEMO_CLIENT_TOOLS;
  SCORES = DEMO_SCORES;
  WINS = DEMO_WINS;
}

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
    ],
    startHere:[
      { label:"Create a Make account", url:"https://www.make.com/en/register" },
      { label:"Beginner tutorial", url:"https://www.make.com/en/help/getting-started" },
      { label:"How Make works", url:"https://www.make.com/en/how-it-works" },
      { label:"QuickBooks integration", url:"https://www.make.com/en/integrations/quickbooks" },
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
    ],
    startHere:[
      { label:"Claude product page", url:"https://claude.ai" },
      { label:"Claude documentation", url:"https://docs.anthropic.com/claude/docs/introduction" },
      { label:"Prompt examples", url:"https://docs.anthropic.com/claude/docs/prompt-examples" },
      { label:"Getting started / API", url:"https://docs.anthropic.com/claude/reference/getting-started" },
    ]
  },
  cowork: {
    name:"Claude Cowork",
    role:"Your AI assistant — runs tasks you ask for",
    url:"https://claude.ai",
    color:"#4a80f5",
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

// ── Atmosphere layer ─────────────────────────────────────────
function Atmosphere() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 60% at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(13,22,40,0.4) 40%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 60%, rgba(37,99,235,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 10% 70%, rgba(13,22,40,0.6) 0%, transparent 60%)`,
    }}/>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `${r},${g},${b}`;
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
function ReportPage({ children, pg, total, sectionTitle }) {
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

      {/* Top nav bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8,15,30,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 52,
      }}>
        {/* Left: logo + section title */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src="/white_decal.svg" style={{ height: 18, width: "auto", flexShrink: 0 }} alt="Telchar AI" />
          {sectionTitle && (
            <span style={{ fontFamily:FONT, fontSize:12, color:P.muted, fontWeight:400, letterSpacing:"0.04em" }}>{sectionTitle}</span>
          )}
        </div>

        {/* Center: company + industry */}
        <div style={{ textAlign:"center", position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
          <div style={{ fontFamily:FONT, fontSize:13, fontWeight:500, color:P.white, lineHeight:1.2 }}>{CO}</div>
          <div style={{ fontFamily:FONT, fontSize:12, color:P.dim }}>{IND}</div>
        </div>

        {/* Right: empty (tier tabs + counter handled in App shell) */}
        <div/>
      </div>

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
        padding: "0 28px",
        position: "relative", zIndex: 10,
      }}>
        <span style={{ fontFamily:FONT, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, fontWeight:400 }}>TELCHAR AI · CONFIDENTIAL</span>
        <span style={{ fontFamily:FONT, fontSize:12, color:P.dim }}>Page {pg} of {total}</span>
      </div>
    </div>
  );
}

// ── Paywall block ─────────────────────────────────────────────
function Paywall({ tier, onUpgrade }) {
  const cfg = tier === "free"
    ? { label:"Starter Report — $50", desc:"Unlock detailed category analysis with improvement guidance and benchmarks for all five dimensions." }
    : { label:"Full Scorecard — $150", desc:"Unlock your 90-day implementation roadmap, risk analysis, data infrastructure plan, and engagement pathway." };
  return (
    <div style={{
      background: "rgba(37,99,235,0.08)",
      border: "1px solid rgba(37,99,235,0.25)",
      borderRadius: 12,
      padding: "24px 28px",
      marginTop: 32,
    }}>
      <div style={{ fontFamily:FONT, fontSize:11, color:P.blue2, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>{cfg.label}</div>
      <p style={{ fontFamily:FONT, fontSize:13, color:P.dim, fontWeight:300, lineHeight:1.7, margin:"0 0 14px" }}>{cfg.desc}</p>
      <button onClick={onUpgrade} style={{
        fontFamily:FONT, width:280, height:48, display:"flex", alignItems:"center", justifyContent:"center",
        background:"#2563eb", color:"#fff", fontSize:13, fontWeight:600,
        letterSpacing:"0.08em", textTransform:"uppercase", border:"none", cursor:"pointer", borderRadius:8, margin:"0 auto",
      }}>Unlock Report</button>
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
        <div style={{ fontFamily:FONT, fontSize:"clamp(96px,18vw,140px)", fontWeight:300, color:scoreCol, lineHeight:0.9, letterSpacing:"-0.05em", marginBottom:12 }}>
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
        <div style={{ display:"flex", gap:0, marginBottom:40 }}>
          {[["Assessment date", DATE],["Framework","v2.4 · Five Category"],["Classification","Confidential"]].map(([k,v],i)=>(
            <div key={k} style={{
              paddingLeft: i>0 ? 28 : 0,
              paddingRight: i<2 ? 28 : 0,
              borderRight: i<2 ? "1px solid rgba(255,255,255,0.07)" : "none",
              textAlign: "center",
            }}>
              <div style={{ fontFamily:FONT, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:6 }}>{k}</div>
              <div style={{ fontFamily:FONT, fontSize:13, fontWeight:500, color:P.white }}>{v}</div>
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
        padding: "0 28px",
        position: "relative", zIndex: 10,
      }}>
        <span style={{ fontFamily:FONT, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted }}>TELCHAR AI · CONFIDENTIAL</span>
        <span style={{ fontFamily:FONT, fontSize:12, color:P.dim }}>Page {pg} of {total}</span>
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
    <ReportPage pg={pg} total={total} sectionTitle="Score Summary">
      {/* Section 1: Overall Score */}
      <div style={{ display:desktop?"grid":"block", gridTemplateColumns:desktop?"200px 1fr":undefined, gap:desktop?52:0, marginBottom:36 }}>

        {/* Left: score */}
        <div style={{ marginBottom:desktop?0:32 }}>
          <SecLabel>Overall Score</SecLabel>
          <div style={{ fontFamily:FONT, fontSize:mobile?72:96, fontWeight:300, color:scoreColor(SCORES.overall), lineHeight:0.88, letterSpacing:"-0.05em", marginBottom:10 }}>{animated}</div>
          <div style={{ fontFamily:FONT, fontSize:13, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:scoreColor(SCORES.overall), display:"inline-block", marginBottom:24 }}>{scoreTier(SCORES.overall)}</div>
          <div style={{ borderTop:`1px solid ${P.linedark}` }}>
            {[["Industry",IND],["Categories","5 of 5 scored"],["SMB benchmark",`${BENCHMARK} / 100`]].map(([k,v])=>(
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
            <div style={{ display:"flex" }}>
              {[["YOUR SCORE",SCORES.overall,scoreColor(SCORES.overall)],["SMB AVERAGE",BENCHMARK,"#ffffff"],["DELTA",(delta>=0?"+":"")+delta,delta>=0?"#22c55e":"#ef4444"]].map(([label,val,col],i)=>(
                <div key={label} style={{ paddingRight:i<2?20:0, paddingLeft:i>0?20:0, borderRight:i<2?`1px solid ${P.linedark}`:"none" }}>
                  <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", color:"rgba(255,255,255,0.5)", marginBottom:4 }}>{label}</div>
                  <div style={{ fontFamily:FONT, fontSize:36, fontWeight:300, color:col, lineHeight:1 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
    <ReportPage pg={pg} total={total} sectionTitle="Priority Improvements">
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
    <ReportPage pg={pg} total={total} sectionTitle="Category Analysis">
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
      <p style={{ fontFamily:FONT, fontSize:15, fontWeight:300, color:P.dim, lineHeight:1.9, marginBottom:28 }}>{guidance[catKey]}</p>

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
          {[["YOUR SCORE",cat.score,scoreColor(cat.score)],["SMB AVERAGE",BENCHMARK,"#ffffff"],["DELTA",(cat.score-BENCHMARK>=0?"+":"")+(cat.score-BENCHMARK),cat.score>=BENCHMARK?"#22c55e":"#ef4444"]].map(([label,val,col],i)=>(
            <div key={label} style={{ paddingRight:i<2?20:0, paddingLeft:i>0?20:0, borderRight:i<2?`1px solid ${P.linedark}`:"none" }}>
              <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", color:"rgba(255,255,255,0.5)", marginBottom:4 }}>{label}</div>
              <div style={{ fontFamily:FONT, fontSize:36, fontWeight:300, color:col, lineHeight:1 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended tool */}
      <SecLabel>Recommended approach</SecLabel>
      <div style={{
        ...glassCard,
        borderLeft: "3px solid #2563eb",
        borderRadius: 14,
        padding: "18px 20px",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8, flexWrap:"wrap", gap:8 }}>
          <div style={{ fontFamily:FONT, fontSize:18, fontWeight:500, color:P.white }}>{tool.name}</div>
          <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:P.blue2 }}>{tool.role}</div>
        </div>
        <p style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:P.dim, lineHeight:1.75, margin:"0 0 14px" }}>{rec.focus}</p>
        <div style={{ borderTop:`1px solid ${P.linedark}`, paddingTop:12 }}>
          <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:8 }}>HOW IT APPLIES HERE</div>
          {tool.examples.map((ex,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
              <Diamond size={9} fill={P.blue2} stroke="none" sw={0} style={{ marginTop:3 }}/>
              <span style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:P.dim, lineHeight:1.6 }}>{ex}</span>
            </div>
          ))}
        </div>
        {tool.startHere && (
          <div style={{ borderTop:`1px solid ${P.linedark}`, paddingTop:12, marginTop:12 }}>
            <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:8 }}>Start here</div>
            {tool.startHere.map((link,i)=>(
              <div key={i} style={{ marginBottom:6 }}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily:FONT, fontSize:13, color:"#4a80f5", textDecoration:"none", lineHeight:1.6 }}>{link.label}</a>
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
  const phases = [
    { phase:"Week 1–2", label:"Setup and Baseline", window:"Week 1 – 2", color:P.blue, accentColor:"#2563eb", phaseNum:"01",
      goal:"Accounts configured, tools connected, priority list locked.",
      steps:[
        "Audit all manual workflows across operations, sales, content, and data categories",
        "Log time spent per task to establish baseline hours (use a shared tracker or spreadsheet)",
        "Rank workflows by frequency × time cost to identify top 3 automation candidates",
        "Create Make.com account, connect primary tools (CRM, email, invoicing, file storage)",
        "Verify API access and permissions for each connected tool",
        "Define success metrics for each candidate workflow (time saved, error rate, throughput)",
      ] },
    { phase:"Week 3–4", label:"First Pilot Live", window:"Week 3 – 4", color:P.blue, accentColor:"#22c55e", phaseNum:"02",
      goal:"One automated workflow running in production with error handling.",
      steps:[
        "Build the highest-priority Make scenario end-to-end in a test environment",
        "Add error handling: retry logic, fallback notifications, dead-letter logging",
        "Run 5–10 test cycles with real data, validate outputs match manual process",
        "Deploy to production with a monitoring dashboard (Make execution logs + alerts)",
        "Train 1–2 team members: what triggers it, how to check status, when to escalate",
        "Track pilot performance daily for the first week, then weekly",
      ] },
    { phase:"Week 5–8", label:"Expand and Validate", window:"Week 5 – 8", color:P.green, accentColor:"#f59e0b", phaseNum:"03",
      goal:"Three workflows automated, measurable time recovery confirmed.",
      steps:[
        "Deploy second automation scenario using lessons from the pilot build",
        "Deploy third scenario — prioritize a cross-functional workflow (e.g., sales → operations handoff)",
        "Integrate Claude for at least one content or communication workflow (drafting, summarization, or classification)",
        "Compare actual time savings against Week 1–2 baseline for all three workflows",
        "Identify and fix edge cases or failure modes surfaced during the first 4 weeks of operation",
        "Document each workflow: trigger, steps, expected output, error handling, owner",
      ] },
    { phase:"Week 9–10", label:"Stabilize and Harden", window:"Week 9 – 10", color:"#2D6FBA", accentColor:"#a855f7", phaseNum:"04",
      goal:"All workflows stable, team operating independently, documentation complete.",
      steps:[
        "Review 30-day execution logs for each automation — flag error rates above 2%",
        "Refine scenarios: tighten filters, improve data validation, reduce false triggers",
        "Finalize team documentation: runbooks, escalation paths, troubleshooting guides",
        "Conduct a team walkthrough so all stakeholders understand what is automated and what is not",
        "Ensure at least one team member can modify or pause any scenario without outside help",
      ] },
    { phase:"Week 11–12", label:"Measure and Plan Next Phase", window:"Week 11 – 12", color:"#2D6FBA", accentColor:"#4a80f5", phaseNum:"05",
      goal:"Clear ROI data, next automation candidates identified, practice self-sustaining.",
      steps:[
        "Calculate total hours recovered per week across all automated workflows",
        "Compare actual ROI against the estimates in this report",
        "Identify the next 2–3 automation candidates based on updated workflow audit",
        "Assess whether additional tool integrations or Claude use cases are warranted",
        "Produce a one-page summary: what was automated, hours saved, cost impact, next steps",
      ] },
  ];

  return (
    <ReportPage pg={pg} total={total} sectionTitle="90-Day Roadmap">
      <SecLabel>90-Day implementation roadmap</SecLabel>
      <p style={{ fontFamily:FONT, fontSize:mobile?13:15, fontWeight:300, color:P.dim, lineHeight:1.8, marginBottom:32 }}>
        Structured as five progressive phases: setup, pilot, expansion, stabilization, and measurement. Each phase builds on the prior without disrupting operational continuity. Implementation is scoped, milestone-driven, and delivered by Telchar AI in collaboration with your team.
      </p>

      {phases.map((ph,i)=>(
        <div key={ph.phase} style={{
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
            <div style={{ fontFamily:FONT, fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:ph.accentColor, marginBottom:6 }}>{ph.phase}</div>
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
  const risks = [
    { label:"Tool integration gaps", severity:"Medium", desc:"Make requires active integrations for each tool in use. If a tool does not have a Make connector, custom API configuration may be needed. Identify all tools in the stack before build begins." },
    { label:"Team adoption friction", severity:"Low", desc:"Cowork operates through natural language, which reduces the learning curve significantly. Brief team orientation on what is automated — and what is not — prevents confusion." },
    { label:"Data quality issues", severity:"Medium", desc:"Automation is only as reliable as the data it processes. Inconsistent job records or duplicate entries in QuickBooks will produce incorrect outputs. A data audit is recommended before automation is deployed at scale." },
    { label:"Scope creep", severity:"Low", desc:"AI capability expands quickly. Attempting to automate too many workflows simultaneously increases risk and reduces quality. The phased roadmap is structured to prevent this by design." },
  ];
  const sCol = { High:P.red, Medium:P.amber, Low:P.green };
  return (
    <ReportPage pg={pg} total={total} sectionTitle="Risk Analysis">
      <SecLabel>Risk analysis</SecLabel>
      <p style={{ fontFamily:FONT, fontSize:15, fontWeight:300, color:P.dim, lineHeight:1.8, marginBottom:28 }}>
        Four implementation risks identified based on assessment findings. All are manageable within a structured engagement. None represent blockers.
      </p>
      {risks.map((r,i)=>(
        <div key={i} style={{
          ...glassCard,
          display: "grid",
          gridTemplateColumns: "1fr 80px",
          gap: 20,
          padding: "20px 24px",
          marginBottom: 12,
          alignItems: "start",
        }}>
          <div>
            <div style={{ fontFamily:FONT, fontSize:13, fontWeight:500, color:P.white, marginBottom:6 }}>{r.label}</div>
            <div style={{ fontFamily:FONT, fontSize:12, fontWeight:300, color:P.dim, lineHeight:1.7 }}>{r.desc}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:FONT, fontSize:10, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:P.muted, marginBottom:4 }}>Severity</div>
            <div style={{ fontFamily:FONT, fontSize:13, fontWeight:500, color:sCol[r.severity]||P.white }}>{r.severity}</div>
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
    { num:"01", title:"Source systems", accentColor:"#2563eb", accentRgb:"37,99,235",
      desc:"QuickBooks (financial), Gmail (communications), Google Calendar (scheduling). These are the authoritative data sources. All automation reads from and writes to these systems." },
    { num:"02", title:"Integration layer", accentColor:"#22c55e", accentRgb:"34,197,94",
      desc:"Make connects the source systems and routes data between them on a defined schedule or trigger. No data is duplicated manually — it flows through Make automatically." },
    { num:"03", title:"Intelligence layer", accentColor:"#a855f7", accentRgb:"168,85,247",
      desc:"Claude receives structured inputs from Make (job details, customer records, financial summaries) and produces outputs (drafted messages, summaries, analysis). Outputs are delivered back through Make." },
    { num:"04", title:"Visibility layer", accentColor:"#f59e0b", accentRgb:"245,158,11",
      desc:"A lightweight dashboard (Looker Studio or equivalent, cost: $0) pulls from QuickBooks and Make data to provide a live view of business performance without manual compilation." },
  ];
  return (
    <ReportPage pg={pg} total={total} sectionTitle="Data Infrastructure">
      <SecLabel>Data infrastructure plan</SecLabel>
      <p style={{ fontFamily:FONT, fontSize:15, fontWeight:300, color:P.dim, lineHeight:1.8, marginBottom:28 }}>
        A four-layer data architecture built on tools already in use. No new software subscriptions beyond Make and Claude Pro. Total infrastructure cost under $30 per month.
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
    <ReportPage pg={pg} total={total} sectionTitle="Next Steps">
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
// Map URL tier params to internal tier names
const TIER_MAP = { free:"free", report:"starter", plan:"full" };

export default function App({ initialTier = "free", demo = false }) {
  // Load the correct data source: demo uses Meridian sample, real uses sessionStorage
  if (demo) {
    loadDemoData();
  } else {
    const hasRealData = loadAssessmentData();
    if (!hasRealData) {
      // No assessment data found and not in demo mode — show report with whatever defaults exist
      // This handles direct /report?tier=free links without a completed assessment
      loadDemoData();
    }
  }

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
    const total = effectiveTier==="full" ? 12 : effectiveTier==="starter" ? 8 : 3;
    const pages = [
      { label:"Cover",              node:<PageCover pg={1} total={total} onNext={()=>{ setCur(1); window.scrollTo(0,0); }}/> },
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
    <div style={{ minHeight:"100vh", background:"#080f1e", fontFamily:FONT, overflowX:"clip", width:"100%" }}>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <style>{`
        @import url('${GOOGLE_FONTS_URL}');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{overflow-x:clip;max-width:100vw;background:#080f1e;}
        button{font-family:inherit;}
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
          {[["free","Free"],["starter","$50"],["full","$150"]].map(([t,label])=>(
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
      </div>

      {/* Report page */}
      <div style={{ display:"flex", justifyContent:"center", overflowX:"hidden" }}>
        <div style={{ width:"100%", maxWidth:1100 }}>
          {page.node}
          {/* Bottom navigation */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "24px 36px",
            background: "rgba(8,15,30,0.9)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
          }}>
            <span onClick={cur>0?prev:undefined} style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:P.dim, cursor:cur>0?"pointer":"default", visibility:cur===0?"hidden":"visible" }}>{"\u2190"} Previous section</span>
            <span style={{ fontFamily:FONT, fontSize:12, color:P.muted }}>Page {cur+1} of {pages.length}</span>
            <span onClick={cur<pages.length-1?next:undefined} style={{ fontFamily:FONT, fontSize:13, fontWeight:300, color:P.dim, cursor:cur<pages.length-1?"pointer":"default", visibility:cur===pages.length-1?"hidden":"visible" }}>Next section {"\u2192"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
