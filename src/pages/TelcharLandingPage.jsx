import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TELCHAR as P,
  FONT,
  SERIF,
  GOOGLE_FONTS_URL,
  scoreColor,
  Diamond,
  Rule,
  SecLabel,
  TEXT,
  LIGHT_TEXT,
  TYPE,
  CTA,
  OPTION_CARD,
} from '../design/telcharDesign';
import ROICalculator from '../ROICalculator';
import HamburgerMenu from '../components/HamburgerMenu';

// ─────────────────────────────────────────────────────────────
// TELCHAR AI · Landing Page
// Canonical design system v3 — dark navy + electric blue
// DM Sans / Instrument Serif · Navy shell + Offwhite content · Diamond motifs
// ─────────────────────────────────────────────────────────────

// ── Shared components ─────────────────────────────────────────
function LogoMark({ variant = "header" }) {
  const h = variant === "footer" ? 16 : 20;
  return <img src="/white_decal.svg" alt="Telchar AI" style={{ height: h, width: "auto", display: "block" }} />;
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

// ════════════════════════════════════════════════════════════════
// HERO SCORE CARD PROFILES
// ════════════════════════════════════════════════════════════════
const HERO_PROFILES = [
  { label: "Fragile",     labelColor: "#ef4444", overall: 28, ops: 24, sales: 30, data: 26, content: 20, tech: 38 },
  { label: "Developing",  labelColor: "#f59e0b", overall: 48, ops: 45, sales: 52, data: 42, content: 40, tech: 58 },
  { label: "Progressing", labelColor: "#3b82f6", overall: 62, ops: 65, sales: 58, data: 60, content: 55, tech: 72 },
  { label: "Advancing",   labelColor: "#22c55e", overall: 76, ops: 82, sales: 72, data: 74, content: 68, tech: 84 },
  { label: "Leading",     labelColor: "#8b5cf6", overall: 91, ops: 94, sales: 88, data: 90, content: 87, tech: 95 },
];

function heroBarColor(score) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

// ════════════════════════════════════════════════════════════════
// HERO (navy shell — like PDF cover page)
// ════════════════════════════════════════════════════════════════
function HeroSection({ onCTA }) {
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();
  const [profileIndex, setProfileIndex] = useState(2); // start on "Progressing"
  const [cardVisible, setCardVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCardVisible(false);
      setTimeout(() => {
        setProfileIndex(i => (i + 1) % HERO_PROFILES.length);
        setCardVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const profile = HERO_PROFILES[profileIndex];
  const categories = [
    { name: 'Operations Efficiency', score: profile.ops },
    { name: 'Sales & CX', score: profile.sales },
    { name: 'Data Visibility', score: profile.data },
    { name: 'Content & Knowledge', score: profile.content },
    { name: 'Tech Readiness', score: profile.tech },
  ];

  return (
    <section
      style={{
        minHeight: '100vh',
        color: P.white,
        background: P.navy,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Atmosphere overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(13,22,40,0.4) 40%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 60%, rgba(37,99,235,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 10% 70%, rgba(13,22,40,0.6) 0%, transparent 60%)',
        }}
      />
      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.025,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Nav bar — v3: fixed, blurred glass */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 64,
          background: 'rgba(8,15,30,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 64,
            padding: isMobile ? '0 16px' : '0 36px',
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
          }}
        >
          <LogoMark variant="header" />
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 28 }}>
            {!isMobile && (
              <>
                <Link
                  to="/assessment"
                  style={{
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 400,
                    color: P.dim,
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                >
                  Diagnostic
                </Link>
                <a
                  href="/?page=roi"
                  style={{
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 400,
                    color: P.dim,
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                >
                  ROI Calculator
                </a>
                <Link
                  to="/report?demo=true"
                  style={{
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 400,
                    color: P.dim,
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                >
                  Sample Report
                </Link>
                <a
                  href="#about"
                  style={{
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 400,
                    color: P.dim,
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                >
                  About
                </a>
              </>
            )}
            <button
              onClick={onCTA}
              style={{
                fontFamily: FONT,
                fontSize: isMobile ? 11 : 12,
                fontWeight: 600,
                letterSpacing: '0.04em',
                height: isMobile ? 32 : 36,
                padding: isMobile ? '8px 16px' : '10px 24px',
                lineHeight: 1,
                background: P.blue,
                color: P.white,
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              Start Free
            </button>
            <HamburgerMenu currentPage="Back Home" />
          </div>
        </div>

        {/* Dropdown handled by HamburgerMenu component */}
      </nav>

      {/* Hero content — two-column layout */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
          justifyContent: 'center',
          gap: isMobile ? 40 : 64,
          padding: isMobile ? '100px 20px 48px' : '72px 36px 60px',
          paddingBottom: 80,
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
          animation: 'fade-up 1s 0.05s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        {/* Left column */}
        <div style={{ maxWidth: 560, flex: 1 }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: P.blue }} />
            <span
              style={{
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: P.dim,
              }}
            >
              AI Advisory · 5 to 100 Employees
            </span>
          </div>

          <h1
            style={{
              fontFamily: FONT,
              fontSize: 'clamp(42px, 9vw, 72px)',
              fontWeight: 300,
              color: P.white,
              lineHeight: 1.1,
              marginBottom: 20,
              letterSpacing: '-0.03em',
            }}
          >
            Find the gaps that are costing you{' '}
            <em style={{ fontFamily: SERIF, fontStyle: 'italic', color: 'rgba(255,255,255,0.45)' }}>time and money</em>
          </h1>

          <p
            style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 300,
              color: P.dim,
              marginBottom: 32,
              maxWidth: 400,
              lineHeight: 1.7,
            }}
          >
            A practical AI readiness diagnostic for small business owners and executives. Five minutes, real results on screen, no sales call required.
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <button
              onClick={onCTA}
              style={{
                fontFamily: FONT,
                height: 44,
                padding: '0 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: P.blue,
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Start Free Diagnostic
            </button>
            <Link
              to="/report?tier=plan&demo=true"
              style={{
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 400,
                color: P.dim,
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'color 0.15s ease',
              }}
            >
              View sample report →
            </Link>
          </div>
        </div>

        {/* Right column — Score card */}
        <div style={{ maxWidth: 420, width: '100%' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 16,
              padding: isMobile ? 24 : 32,
              animation: 'float 6s ease-in-out infinite',
              opacity: cardVisible ? 1 : 0,
              transform: cardVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: P.muted,
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  Overall Score
                </span>
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 56,
                    fontWeight: 300,
                    color: P.white,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {profile.overall}
                </span>
              </div>
              <div
                style={{
                  background: `${profile.labelColor}22`,
                  border: `1px solid ${profile.labelColor}44`,
                  borderRadius: 20,
                  padding: '6px 14px',
                }}
              >
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 600,
                    color: profile.labelColor,
                    letterSpacing: '0.06em',
                  }}
                >
                  {profile.label}
                </span>
              </div>
            </div>

            {/* Category bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {categories.map((cat, i) => {
                const barColor = heroBarColor(cat.score);
                return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: FONT, fontSize: 11, color: P.dim }}>{cat.name}</span>
                    <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: P.dim }}>{cat.score}</span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.06)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${cat.score}%`,
                        height: '100%',
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
                );
              })}
            </div>

            {/* Pills row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'Free', value: '$0' },
                { label: 'Time', value: '~5min' },
                { label: 'Categories', value: '5' },
                { label: 'Login', value: 'None' },
              ].map((pill, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 6,
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ fontFamily: FONT, fontSize: 9, color: P.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {pill.label}
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: P.white }}>
                    {pill.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Mini CTA card */}
            <div
              style={{
                background: P.blueglow,
                border: `1px solid ${P.bluebrd}`,
                borderRadius: 8,
                padding: '12px 16px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: P.blue2, letterSpacing: '0.02em' }}>
                Get your personalized score in ~5 minutes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          borderTop: `1px solid ${P.linedark}`,
          padding: isMobile ? '28px 20px' : '36px 36px',
          clear: 'both',
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            textAlign: 'center',
          }}
        >
          {[
            { num: '5', sup: '', desc: 'Categories scored' },
            { num: '2', sup: '', desc: 'Report options to match your depth' },
            { num: '~5', sup: '', desc: 'Minutes to complete' },
          ].map((stat, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 'clamp(32px, 6vw, 48px)',
                  fontWeight: 300,
                  color: P.white,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {stat.num}{stat.sup && <sup style={{ fontSize: '0.5em', verticalAlign: 'super' }}>{stat.sup}</sup>}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 400,
                  color: P.dim,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator — hidden, was overlapping stats strip */}
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// STEPS / HOW IT WORKS (light section)
// ════════════════════════════════════════════════════════════════
function StepsSection() {
  const isMobile = useIsMobile();
  const steps = [
    { num: '01', title: 'Answer a few focused questions', desc: 'About 5 minutes. No preparation needed.' },
    {
      num: '02',
      title: 'Get your readiness results',
      desc: 'Your overall score, category breakdown, maturity tier, and top starting point — on screen immediately, free.',
    },
    {
      num: '03',
      title: 'Preview the full plan',
      desc: 'Access the AI Action Plan for priority improvements, a 30-day action plan, 90-day roadmap, category analysis, risk guidance, and a downloadable PDF.',
    },
  ];

  return (
    <section
      style={{
        background: P.offwhite,
        color: LIGHT_TEXT.primary,
        padding: isMobile ? '56px 20px' : '96px 36px',
      }}
    >
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 56 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: P.blue,
              marginBottom: 16,
            }}
          >
            How it works
          </div>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: 'clamp(36px, 7vw, 56px)',
              fontWeight: 300,
              color: LIGHT_TEXT.primary,
              marginTop: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.035em',
            }}
          >
            What happens <em style={{ fontFamily: SERIF, fontStyle: 'italic', color: 'rgba(10,15,30,0.5)' }}>next</em>
          </h2>
        </div>

        {/* Steps with numbered rows and borders between */}
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: isMobile ? 16 : 24,
                padding: isMobile ? '20px 0' : '28px 0',
                borderTop: i === 0 ? `1px solid ${P.linelight}` : 'none',
                borderBottom: `1px solid ${P.linelight}`,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 500,
                  color: P.blue,
                  letterSpacing: '0.1em',
                  minWidth: 32,
                  paddingTop: 2,
                }}
              >
                {s.num}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: FONT,
                    fontSize: 15,
                    fontWeight: 600,
                    color: LIGHT_TEXT.primary,
                    marginBottom: 6,
                    lineHeight: 1.3,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 300,
                    color: LIGHT_TEXT.secondary,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 300,
            color: LIGHT_TEXT.muted,
            textAlign: 'center',
            marginTop: 28,
            letterSpacing: '0.04em',
          }}
        >
          No signup required to see your free score.
        </p>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// WHAT YOU GET (dark section — navy2)
// ════════════════════════════════════════════════════════════════
function ProofSection({ onCTA }) {
  const isMobile = useIsMobile();

  const offerings = [
    {
      title: 'Scored across 5 categories',
      desc: 'Operations, Sales & CX, Data Visibility, Content & Knowledge, and Technology Readiness.',
    },
    {
      title: 'Priority improvements with tools',
      desc: 'Your highest-impact actions with specific tool recommendations, cost estimates, and timelines.',
    },
    {
      title: '30-day action plan and 90-day roadmap',
      desc: 'A structured first-month plan plus a phased 90-day implementation sequence with risk and infrastructure guidance.',
    },
  ];

  return (
    <section
      style={{
        background: P.navy2,
        color: P.white,
        padding: isMobile ? '56px 20px' : '96px 36px',
      }}
    >
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 56 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: P.blue2,
              marginBottom: 16,
            }}
          >
            What you get
          </div>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: 'clamp(36px, 7vw, 56px)',
              fontWeight: 300,
              color: P.white,
              marginTop: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.035em',
            }}
          >
            A scored report across five areas{' '}
            <em style={{ fontFamily: SERIF, fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>that matter</em>
          </h2>
        </div>

        {/* 3 offering rows with borders */}
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {offerings.map((o, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: isMobile ? 16 : 24,
                padding: isMobile ? '20px 0' : '28px 0',
                borderTop: i === 0 ? `1px solid ${P.linedark}` : 'none',
                borderBottom: `1px solid ${P.linedark}`,
                alignItems: 'flex-start',
              }}
            >
              <Diamond size={8} fill={P.blue2} stroke="none" sw={0} style={{ marginTop: 6, flexShrink: 0 }} />
              <div>
                <h3
                  style={{
                    fontFamily: FONT,
                    fontSize: 19,
                    fontWeight: 400,
                    color: '#ffffff',
                    marginBottom: 6,
                    lineHeight: 1.3,
                  }}
                >
                  {o.title}
                </h3>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {o.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            onClick={onCTA}
            style={{
              fontFamily: FONT,
              height: 44,
              padding: '0 32px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: P.blue,
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Start Free Diagnostic
          </button>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// TIER COMPARISON (light section)
// ════════════════════════════════════════════════════════════════
function TierSection({ onCTA }) {
  const isMobile = useIsMobile();
  const tiers = [
    {
      name: 'Free AI Readiness Diagnostic',
      price: 'Free',
      priceNote: null,
      featured: true,
      items: [
        'Overall AI Readiness Score',
        'Category breakdown across 5 dimensions',
        'Maturity tier and score interpretation',
        'Your top starting point',
        'On-screen results, instant',
      ],
    },
    {
      name: 'AI Action Plan',
      price: 'Early Access',
      priceNote: 'free during test',
      featured: false,
      intent: 'Built for small business owners and executives ready to act.',
      items: [
        'Three priority improvements with tool recommendations',
        '30-day action plan tied to your top priorities',
        '90-day implementation roadmap',
        'Deep category analysis across all 5 dimensions',
        'Risk analysis and data infrastructure guidance',
        'Downloadable branded PDF report',
      ],
    },
  ];

  return (
    <section
      style={{
        background: P.offwhite,
        color: LIGHT_TEXT.primary,
        padding: isMobile ? '56px 20px' : '96px 36px',
      }}
    >
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 56 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: P.blue,
              marginBottom: 16,
            }}
          >
            Two options
          </div>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: 'clamp(36px, 7vw, 56px)',
              fontWeight: 300,
              color: LIGHT_TEXT.primary,
              marginTop: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.035em',
            }}
          >
            Every diagnostic starts free
          </h2>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 300,
              color: LIGHT_TEXT.secondary,
              marginTop: 14,
              lineHeight: 1.7,
              margin: '14px 0 0',
            }}
          >
            Start free. Preview the full AI Action Plan when you're ready to go deeper.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: 16,
            alignItems: 'stretch',
          }}
        >
          {tiers.map((tier, i) => (
            <div
              key={i}
              style={{
                background: P.white,
                border: `1px solid ${P.linelight}`,
                borderRadius: 14,
                padding: isMobile ? 24 : 32,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontSize: 16,
                      fontWeight: 600,
                      color: LIGHT_TEXT.primary,
                      margin: 0,
                    }}
                  >
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 10,
                        fontWeight: 600,
                        color: P.blue2,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        background: P.blue + '15',
                        padding: '3px 8px',
                        borderRadius: 4,
                      }}
                    >
                      Start here
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 32,
                      fontWeight: 300,
                      color: tier.featured ? P.blue : LIGHT_TEXT.secondary,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {tier.price}
                  </span>
                  {tier.priceNote && (
                    <span style={{ fontFamily: FONT, fontSize: 12, color: LIGHT_TEXT.muted }}>{tier.priceNote}</span>
                  )}
                </div>
              </div>

              <div style={{ flex: 1, marginBottom: tier.intent ? 16 : 24 }}>
                {tier.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <Diamond
                      size={6}
                      fill={tier.featured ? P.blue2 : LIGHT_TEXT.muted}
                      stroke="none"
                      sw={0}
                      style={{ marginTop: 4 }}
                    />
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 13,
                        fontWeight: 300,
                        color: LIGHT_TEXT.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {tier.intent && (
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 300,
                    color: LIGHT_TEXT.muted,
                    lineHeight: 1.5,
                    marginBottom: 0,
                    fontStyle: 'italic',
                  }}
                >
                  {tier.intent}
                </p>
              )}

              {tier.featured && (
                <button
                  onClick={onCTA}
                  style={{
                    fontFamily: FONT,
                    width: '100%',
                    maxWidth: 320,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: P.blue,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    margin: '24px auto 0',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Start Free Diagnostic
                </button>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            maxWidth: 560,
            margin: '36px auto 0',
            padding: '18px 22px',
            background: P.white,
            borderRadius: 14,
            border: `1px solid ${P.linelight}`,
          }}
        >
          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 600,
              color: LIGHT_TEXT.primary,
              marginBottom: 6,
            }}
          >
            Is the full plan free right now?
          </p>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 300,
              color: LIGHT_TEXT.secondary,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Yes. During early access, the full AI Action Plan is available at no cost. Complete the free diagnostic, see your results,
            and preview the full plan — priority improvements, 30-day action plan, 90-day roadmap, and a downloadable PDF report.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link
            to="/report?tier=plan&demo=true"
            style={{
              fontFamily: FONT, fontSize: 13, fontWeight: 400, color: LIGHT_TEXT.muted,
              textDecoration: 'none', letterSpacing: '0.02em',
            }}
          >
            View full sample report →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// ROI CALCULATOR (uses full standalone component in embedded mode)
// ════════════════════════════════════════════════════════════════

function ROICalculatorSection() {
  const [open, setOpen] = useState(false);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [mob, setMob] = useState(typeof window !== 'undefined' ? window.innerWidth < 600 : false);
  useEffect(() => {
    const h = () => setMob(window.innerWidth < 600);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const handleToggle = () => {
    setOpen((o) => !o);
    if (!open && contentRef.current)
      setTimeout(() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#080f1e',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Atmosphere overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 90% 60% at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(13,22,40,0.4) 40%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 85% 60%, rgba(37,99,235,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 10% 70%, rgba(13,22,40,0.6) 0%, transparent 60%)`
      }} />
      {/* Grid overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Centered column for header + content */}
      <div style={{ maxWidth: 980, width: '100%', position: 'relative', zIndex: 10 }}>
        <div
          onClick={handleToggle}
          style={{
            padding: mob ? '28px 20px' : '36px 36px',
            cursor: 'pointer',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#4a80f5',
                marginBottom: 10,
              }}
            >
              ROI Calculator
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 'clamp(36px, 7vw, 56px)',
                fontWeight: 300,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '-0.035em',
              }}
            >
              What is manual work costing your business?
            </h2>
            {!open && (
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: 14,
                  marginBottom: 0,
                  lineHeight: 1.7,
                }}
              >
                Conservative estimate. No email required.
              </p>
            )}
          </div>
          {!open && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#2563eb', color: '#ffffff',
                  border: 'none', borderRadius: 8,
                  padding: '14px 32px',
                  fontFamily: FONT,
                  fontSize: 13, fontWeight: 600, letterSpacing: '0.03em',
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.15s',
                }}
              >
                Calculate My Savings
                <span style={{ fontSize: 16 }}>→</span>
              </button>
            </div>
          )}
        </div>

        <div
          ref={contentRef}
          style={{
            overflow: 'hidden',
            maxHeight: open ? '9999px' : '0px',
            transition: 'max-height 0.4s ease',
          }}
        >
          <div
            style={{
              borderTop: `1px solid ${P.linedark}`,
              padding: mob ? '32px 20px 48px' : '40px 36px 64px',
            }}
          >
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <ROICalculator embedded />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// WHO IT'S FOR (light section — 2x2 grid)
// ════════════════════════════════════════════════════════════════
function WhoSection() {
  const isMobile = useIsMobile();
  const fits = [
    'You have 5 to 100 employees and run day-to-day operations',
    'You know AI matters but want a clear starting point before spending money',
    'You want specific, prioritized actions you can act on this week',
    'You value practical guidance over theory and hype',
  ];
  const notFits = [
    'Enterprise companies with dedicated AI or IT teams',
    'Solo freelancers with no team to coordinate',
    'Businesses looking for someone to build it for them',
  ];

  return (
    <section
      id="who"
      style={{
        background: P.offwhite,
        color: LIGHT_TEXT.primary,
        padding: isMobile ? '48px 20px' : '72px 36px',
      }}
    >
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 40 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: P.blue,
              marginBottom: 16,
            }}
          >
            Who this is for
          </div>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: 'clamp(36px, 7vw, 56px)',
              fontWeight: 300,
              color: LIGHT_TEXT.primary,
              marginTop: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.035em',
            }}
          >
            Built for small business owners and executives
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 16,
          }}
        >
          {/* Good fit card */}
          <div
            style={{
              background: P.white,
              padding: 28,
              borderRadius: 14,
              border: `1px solid ${P.linelight}`,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: P.green,
                marginBottom: 18,
              }}
            >
              Good fit
            </div>
            {fits.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <Diamond size={6} fill={P.green} stroke="none" sw={0} style={{ marginTop: 4 }} />
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 300,
                    color: LIGHT_TEXT.secondary,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {f}
                </p>
              </div>
            ))}
          </div>

          {/* Not best fit card */}
          <div
            style={{
              background: P.white,
              padding: 28,
              borderRadius: 14,
              border: `1px solid ${P.linelight}`,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: P.red,
                marginBottom: 18,
              }}
            >
              Not the best fit
            </div>
            {notFits.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <Diamond size={6} fill={P.red} stroke="none" sw={0} style={{ marginTop: 4 }} />
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 300,
                    color: LIGHT_TEXT.muted,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {f}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// REPORT PREVIEW (trust-building inline previews)
// ════════════════════════════════════════════════════════════════
function ReportPreviewSection() {
  const isMobile = useIsMobile();
  const previews = [
    {
      label: 'Score Summary',
      desc: 'Overall score, category breakdown across five dimensions, reference baseline comparison, and maturity interpretation.',
    },
    {
      label: '30-Day Action Plan + 90-Day Roadmap',
      desc: 'A structured first-month plan with weekly milestones, plus a phased 90-day implementation sequence.',
    },
    {
      label: 'Category Analysis',
      desc: 'Deep analysis for each dimension with tool recommendations, risk guidance, and implementation sequence.',
    },
  ];

  return (
    <section
      style={{
        background: P.navy,
        color: P.white,
        padding: isMobile ? '56px 20px' : '96px 36px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 60%)'
      }} />
      <div style={{ maxWidth: 980, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 56 }}>
          <div style={{
            fontFamily: FONT, fontSize: 12, fontWeight: 600, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: P.blue2, marginBottom: 16,
          }}>
            Inside the report
          </div>
          <h2 style={{
            fontFamily: FONT, fontSize: 'clamp(36px, 7vw, 56px)', fontWeight: 300,
            color: P.white, marginTop: 0, lineHeight: 1.2, letterSpacing: '-0.035em',
          }}>
            What the AI Action Plan{' '}
            <em style={{ fontFamily: SERIF, fontStyle: 'italic', color: 'rgba(255,255,255,0.45)' }}>includes</em>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {previews.map((p, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 14,
              padding: 28,
            }}>
              <div style={{
                fontFamily: FONT, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: P.blue2, marginBottom: 12,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{
                fontFamily: FONT, fontSize: 17, fontWeight: 500, color: P.white,
                marginBottom: 10, lineHeight: 1.3,
              }}>
                {p.label}
              </div>
              <p style={{
                fontFamily: FONT, fontSize: 13, fontWeight: 300, color: P.dim,
                lineHeight: 1.7, margin: 0,
              }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link
            to="/report?tier=plan&demo=true"
            style={{
              fontFamily: FONT, fontSize: 13, fontWeight: 400, color: P.dim,
              textDecoration: 'none', letterSpacing: '0.02em',
            }}
          >
            View full sample report →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// ABOUT / CREDIBILITY (anonymous, short)
// ════════════════════════════════════════════════════════════════
function AboutSection() {
  const isMobile = useIsMobile();
  return (
    <section
      id="about"
      style={{
        background: P.offwhite,
        color: LIGHT_TEXT.primary,
        padding: isMobile ? '56px 20px' : '96px 36px',
        scrollMarginTop: 80,
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          fontFamily: FONT, fontSize: 12, fontWeight: 600, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: P.blue, marginBottom: 16,
        }}>
          About Telchar AI
        </div>
        <p style={{
          fontFamily: FONT, fontSize: 15, fontWeight: 300, color: LIGHT_TEXT.secondary,
          lineHeight: 1.8, margin: '0 0 16px',
        }}>
          Telchar AI was developed by an executive leader in management consulting with deep experience helping companies improve operations, technology, and execution.
        </p>
        <p style={{
          fontFamily: FONT, fontSize: 15, fontWeight: 300, color: LIGHT_TEXT.secondary,
          lineHeight: 1.8, margin: 0,
        }}>
          It exists to give small businesses a practical AI plan without the cost, noise, and wasted effort of figuring it out alone or hiring expensive advisors.
        </p>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// FAQ SECTION
// ════════════════════════════════════════════════════════════════
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: `1px solid ${P.linelight}`,
      padding: '18px 0',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          padding: 0, cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: 16,
        }}
      >
        <span style={{
          fontFamily: FONT, fontSize: 14, fontWeight: 500, color: LIGHT_TEXT.primary, lineHeight: 1.5,
        }}>
          {q}
        </span>
        <span style={{
          fontFamily: FONT, fontSize: 18, color: LIGHT_TEXT.muted, flexShrink: 0,
          transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease',
        }}>
          +
        </span>
      </button>
      {open && (
        <p style={{
          fontFamily: FONT, fontSize: 13, fontWeight: 300, color: LIGHT_TEXT.secondary,
          lineHeight: 1.8, margin: '12px 0 0', paddingRight: 32,
        }}>
          {a}
        </p>
      )}
    </div>
  );
}

function FAQSection() {
  const isMobile = useIsMobile();
  const faqs = [
    {
      q: 'What does the AI readiness score actually mean?',
      a: 'Your score shows how prepared your business is to use AI where it matters. It reflects how your business runs today, where friction exists, and where the biggest opportunities are across five dimensions: Operations Efficiency, Sales & CX, Data Visibility, Content & Knowledge, and Technology Readiness.',
    },
    {
      q: 'What does the AI Action Plan include?',
      a: 'The full report built from your diagnostic responses: your top 3 priority improvements, a 30-day action plan, a 90-day roadmap, recommended tools, implementation sequence, risk and execution guidance, and a downloadable branded PDF.',
    },
    {
      q: 'How is this different from asking ChatGPT for an AI plan?',
      a: 'ChatGPT gives generic answers unless you already know what to ask. This diagnostic evaluates how your business actually runs, benchmarks you against similar companies, and prioritizes what to fix first based on your industry, team size, tools, and friction points.',
    },
    {
      q: 'Is the report generic?',
      a: 'No. Every report is built from your diagnostic responses and tailored to your business, your operating friction, and your priorities.',
    },
    {
      q: 'Do I need to be technical to use this?',
      a: 'No. This is built for business owners and executives, not technical teams. It focuses on how your business runs and turns that into practical recommendations without requiring technical knowledge.',
    },
    {
      q: 'Who is the AI Action Plan for?',
      a: 'Owners and executives who want more than a score. It gives you a clear plan for what to fix first, what tools fit your business, and how to move forward without getting lost in AI hype.',
    },
  ];

  return (
    <section
      style={{
        background: P.offwhite,
        color: LIGHT_TEXT.primary,
        padding: isMobile ? '56px 20px' : '96px 36px',
      }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 56 }}>
          <div style={{
            fontFamily: FONT, fontSize: 12, fontWeight: 600, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: P.blue, marginBottom: 16,
          }}>
            Common questions
          </div>
          <h2 style={{
            fontFamily: FONT, fontSize: 'clamp(36px, 7vw, 56px)', fontWeight: 300,
            color: LIGHT_TEXT.primary, marginTop: 0, lineHeight: 1.2, letterSpacing: '-0.035em',
          }}>
            Straight answers
          </h2>
        </div>
        <div style={{
          background: P.white, borderRadius: 14, border: `1px solid ${P.linelight}`,
          padding: isMobile ? '4px 20px' : '4px 32px',
        }}>
          {faqs.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// FINAL CTA (navy section with glow + diamond outline)
// ════════════════════════════════════════════════════════════════
function CTASection({ onCTA }) {
  const isMobile = useIsMobile();
  return (
    <section
      style={{
        background: P.navy,
        color: P.white,
        padding: isMobile ? '64px 20px 80px' : '100px 36px 112px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Centered radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,99,235,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Large faint diamond outline */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          height: 420,
          pointerEvents: 'none',
          opacity: 0.06,
        }}
      >
        <svg width="300" height="420" viewBox="0 0 300 420" fill="none">
          <polygon
            points="150,0 300,210 150,420 0,210"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      <div
        style={{
          maxWidth: 600,
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: P.blue2,
            marginBottom: 18,
          }}
        >
          Your next step
        </div>
        <h2
          style={{
            fontFamily: FONT,
            fontSize: 'clamp(44px, 10vw, 76px)',
            fontWeight: 300,
            color: P.white,
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: '-0.035em',
          }}
        >
          Five minutes to clarity before you spend a dollar on AI
        </h2>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 300,
            color: P.dim,
            lineHeight: 1.8,
            marginBottom: 44,
          }}
        >
          Focused questions. Real results on screen. No signup, no sales call.
        </p>

        {/* Two buttons: blue primary + ghost */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={onCTA}
            style={{
              fontFamily: FONT,
              height: 44,
              padding: '0 32px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: P.blue,
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Start Free Diagnostic
          </button>
          <Link
            to="/report?tier=plan&demo=true"
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: P.dim,
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '12px 24px',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            View Sample Report
          </Link>
        </div>

        <p
          style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 300,
            color: P.dim,
            marginTop: 24,
            letterSpacing: '0.04em',
          }}
        >
          Free. No login. Full plan available during early access.
        </p>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
// FOOTER (navy2 — diamond mark + nav links)
// ════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <div
      style={{
        background: P.navy2,
        width: '100%',
        borderTop: `1px solid ${P.linedark}`,
      }}
    >
      <footer
        style={{
          padding: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <LogoMark variant="footer" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link
            to="/assessment"
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 400,
              color: P.dim,
              letterSpacing: '0.04em',
              textDecoration: 'none',
            }}
          >
            Diagnostic
          </Link>
          <Link
            to="/report?demo=true"
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 400,
              color: P.dim,
              letterSpacing: '0.04em',
              textDecoration: 'none',
            }}
          >
            Sample Report
          </Link>
          <a
            href="/?page=roi"
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 400,
              color: P.dim,
              letterSpacing: '0.04em',
              textDecoration: 'none',
            }}
          >
            ROI Calculator
          </a>
        </div>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 400,
            color: P.muted,
            margin: 0,
            letterSpacing: '0.04em',
          }}
        >
          &copy; {new Date().getFullYear()} Telchar AI
        </p>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 10,
            fontWeight: 300,
            color: P.muted,
            margin: '6px 0 0',
            letterSpacing: '0.02em',
            lineHeight: 1.5,
          }}
        >
          Proprietary framework, report methodology, and materials. No reproduction, redistribution, or commercial reuse without written permission.
        </p>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════════
export default function TelcharLandingPage() {
  const navigate = useNavigate();
  const handleCTA = () => navigate('/assessment');

  // Scroll to #about on mount when arriving from another page
  useEffect(() => {
    if (window.location.hash === "#about") {
      const el = document.getElementById("about");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <style>{`
        @import url('${GOOGLE_FONTS_URL}');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${P.navy}; color: #fff; font-family: ${FONT}; color-scheme: dark; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${P.blue}30; }
        button { font-family: inherit; cursor: pointer; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 7px; background: ${P.blue2}; cursor: pointer; border: 2px solid ${P.navy}; }
        input[type="range"]::-moz-range-thumb { width: 14px; height: 14px; border-radius: 7px; background: ${P.blue2}; cursor: pointer; border: 2px solid ${P.navy}; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
      `}</style>
      <HeroSection onCTA={handleCTA} />
      <StepsSection />
      <TierSection onCTA={handleCTA} />
      <ROICalculatorSection />
      <WhoSection />
      <AboutSection />
      <FAQSection />
      <CTASection onCTA={handleCTA} />
      <Footer />
    </>
  );
}
