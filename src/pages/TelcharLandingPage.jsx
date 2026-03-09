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
  { label: "Getting Started", labelColor: "#f59e0b", overall: 32, ops: 28, sales: 35, data: 30, content: 22, tech: 45 },
  { label: "In Progress",     labelColor: "#3b82f6", overall: 55, ops: 58, sales: 50, data: 62, content: 44, tech: 60 },
  { label: "AI Ready",        labelColor: "#22c55e", overall: 74, ops: 82, sales: 68, data: 71, content: 60, tech: 85 },
  { label: "AI Leading",      labelColor: "#8b5cf6", overall: 91, ops: 94, sales: 88, data: 90, content: 87, tech: 95 },
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
  const [profileIndex, setProfileIndex] = useState(2); // start on "AI Ready"
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
            padding: isMobile ? '0 20px' : '0 36px',
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
          }}
        >
          <LogoMark variant="header" />
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 28 }}>
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
                  Assessment
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
                    transition: 'color 0.15s ease',
                  }}
                >
                  Reports
                </Link>
                <a
                  href="#who"
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
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.04em',
                height: 36,
                padding: '10px 24px',
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
          </div>
        </div>
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
              AI Consulting · 5 to 100 Employees
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
            Know where your business stands{' '}
            <em style={{ fontFamily: SERIF, fontStyle: 'italic', color: 'rgba(255,255,255,0.45)' }}>with AI</em>
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
            Built by Telchar AI using enterprise-tested AI methodology adapted for small businesses. About 5 minutes. Free results on screen.
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
              Start Free Assessment
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
            { num: '3', sup: '', desc: 'Report tiers to match your depth' },
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
    { num: '01', title: 'Answer adaptive questions', desc: 'About 5 minutes. No preparation needed.' },
    {
      num: '02',
      title: 'See your AI readiness score',
      desc: 'Get your overall score, category breakdown, and your single highest impact action immediately on screen.',
    },
    {
      num: '03',
      title: 'Choose your depth',
      desc: 'Upgrade to the $150 Full Report if you want deeper analysis, a 30-day action plan, and implementation guidance.',
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
      title: 'Prioritized action items',
      desc: 'Your highest-impact actions ranked by effort and return, so you know exactly where to start.',
    },
    {
      title: 'Implementation roadmap',
      desc: 'Phased plan with timelines, tool recommendations, risk analysis, and data infrastructure guidance.',
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
            Start Free Assessment
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
      name: 'Free Assessment',
      price: 'Free',
      priceNote: null,
      featured: true,
      items: [
        'Overall AI Readiness Score',
        'Category breakdown across 5 dimensions',
        'Your single highest-impact action',
        'On-screen results, instant',
      ],
    },
    {
      name: 'Full Report',
      price: '$150',
      priceNote: 'one time',
      featured: false,
      intent: 'Built for businesses ready to act on their results.',
      items: [
        'All priority improvements with tool recommendations',
        '30-day action plan tied to your top priorities',
        'Deep category analysis across all 5 dimensions',
        'Phased implementation roadmap with timeline',
        'Risk analysis and data infrastructure plan',
        'Downloadable branded PDF',
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
            Every assessment starts free
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
            Start free. Upgrade when you're ready for the full picture.
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
                  Start Free Assessment
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
            When do I pay?
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
            After you complete the free assessment and see your score, you can upgrade to the $150 Full Report for deeper
            analysis, a 30-day action plan, and implementation guidance.
          </p>
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
            Built for business owners who run real operations
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
          Know where you stand before you spend a dollar on AI
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
          Adaptive questions. About 5 minutes. Free results on screen. Upgrade to a detailed report if you want more.
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
            Start Free Assessment
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
          Free. No login. Upgrade anytime.
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
            Assessment
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
            Reports
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
      <ProofSection onCTA={handleCTA} />
      <TierSection onCTA={handleCTA} />
      <ROICalculatorSection />
      <WhoSection />
      <CTASection onCTA={handleCTA} />
      <Footer />
    </>
  );
}
