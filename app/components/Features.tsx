'use client';
import React, { useEffect, useRef, useState } from 'react';

const featuresData = [
  {
    col: 'left',
    cards: [
      {
        icon: '⚡',
        title: 'Arc Reactor Core',
        description: 'Infinite clean energy powering every script with near-zero latency and maximum throughput.',
        tag: 'Performance',
        tagColor: '#dc2626',
      },
      {
        icon: '🛡️',
        title: 'Vibranium Shield',
        description: 'Enterprise-grade security protocols wrapping every API call and data transaction.',
        tag: 'Security',
        tagColor: '#2563eb',
      },
    ],
  },
  {
    col: 'center',
    cards: [
      {
        icon: '🤖',
        title: 'J.A.R.V.I.S. Intelligence',
        description: "An AI-powered assistant that learns your workflow, predicts bottlenecks, and auto-resolves issues before they surface — just like having Stark's AI on your team.",
        tag: 'AI Engine',
        tagColor: '#dc2626',
        tall: true,
      },
    ],
  },
  {
    col: 'right',
    cards: [
      {
        icon: '🌐',
        title: 'Global Deployment',
        description: 'Deploy to 40+ edge regions instantly with automated rollback and zero-downtime upgrades.',
        tag: 'Infrastructure',
        tagColor: '#059669',
      },
      {
        icon: '📡',
        title: 'Real-time Signals',
        description: 'Live telemetry and observability dashboards that surface anomalies the moment they occur.',
        tag: 'Monitoring',
        tagColor: '#7c3aed',
      },
    ],
  },
];

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
};

const SmallCard = ({ icon, title, description, tag, tagColor, delay }: {
  icon: string; title: string; description: string; tag: string; tagColor: string; delay: number;
}) => {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#ffffff' : '#ffffff',
        border: `1px solid ${hovered ? tagColor : 'rgba(0,0,0,0.08)'}`,
        borderRadius: '14px',
        padding: '28px',
        flex: 1,
        boxShadow: hovered
          ? `0 8px 32px rgba(0,0,0,0.10), 0 2px 8px ${tagColor}22`
          : '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        opacity: inView ? 1 : 0,
        transform: inView
          ? hovered ? 'translateY(-6px)' : 'translateY(0)'
          : 'translateY(40px)',
        transition: inView
          ? `border 0.25s ease, box-shadow 0.25s ease, transform 0.3s ease`
          : `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '10px',
        cursor: 'default',
      }}
    >
      <div style={{
        fontSize: '28px', lineHeight: 1,
        transform: hovered ? 'scale(1.15)' : 'scale(1)',
        transition: 'transform 0.3s ease',
        display: 'inline-block',
        width: 'fit-content',
      }}>{icon}</div>

      <span style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase' as const, color: tagColor,
        fontFamily: 'var(--font-rajdhani), sans-serif',
      }}>{tag}</span>

      <div style={{
        fontSize: '15px', fontWeight: 700,
        color: hovered ? tagColor : '#0f172a',
        fontFamily: 'var(--font-orbitron), monospace', lineHeight: 1.3,
        transition: 'color 0.25s ease',
      }}>{title}</div>

      <p style={{
        fontSize: '13px', color: '#64748b', lineHeight: 1.65, margin: 0,
        fontFamily: 'var(--font-rajdhani), sans-serif',
      }}>{description}</p>

      <div style={{
        marginTop: '4px',
        width: hovered ? '48px' : '0px',
        height: '2px',
        background: tagColor,
        borderRadius: '2px',
        transition: 'width 0.35s ease',
      }} />
    </div>
  );
};

const TallCard = ({ icon, title, description, tag, tagColor }: {
  icon: string; title: string; description: string; tag: string; tagColor: string;
}) => {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#0f172a',
        border: `1px solid ${hovered ? 'rgba(220,38,38,0.7)' : 'rgba(220,38,38,0.3)'}`,
        borderRadius: '14px',
        padding: '40px 32px',
        flex: 1,
        boxShadow: hovered
          ? '0 16px 48px rgba(220,38,38,0.2), 0 4px 16px rgba(0,0,0,0.3)'
          : '0 4px 24px rgba(220,38,38,0.1), 0 1px 3px rgba(0,0,0,0.2)',
        opacity: inView ? 1 : 0,
        transform: inView
          ? hovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)'
          : 'translateY(40px) scale(0.97)',
        transition: inView
          ? 'border 0.25s ease, box-shadow 0.3s ease, transform 0.35s ease'
          : 'opacity 0.75s ease 300ms, transform 0.75s ease 300ms',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        gap: '16px',
        position: 'relative' as const,
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Top glow line — brightens on hover */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: hovered ? '240px' : '160px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.9), transparent)',
        transition: 'width 0.4s ease',
      }} />

      <div style={{
        fontSize: '38px', lineHeight: 1,
        transform: hovered ? 'scale(1.12) rotate(-4deg)' : 'scale(1) rotate(0deg)',
        transition: 'transform 0.35s ease',
        display: 'inline-block',
        width: 'fit-content',
      }}>{icon}</div>

      <span style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em',
        textTransform: 'uppercase' as const, color: tagColor,
        fontFamily: 'var(--font-rajdhani), sans-serif',
      }}>{tag}</span>

      <div style={{
        fontSize: '22px', fontWeight: 700,
        color: hovered ? '#ffffff' : '#f1f5f9',
        fontFamily: 'var(--font-orbitron), monospace', lineHeight: 1.25,
        transition: 'color 0.25s ease',
      }}>{title}</div>

      <div style={{ width: '40px', height: '2px', background: tagColor, borderRadius: '2px' }} />

      <p style={{
        fontSize: '14px', color: hovered ? '#cbd5e1' : '#94a3b8',
        lineHeight: 1.7, margin: 0,
        fontFamily: 'var(--font-rajdhani), sans-serif',
        transition: 'color 0.25s ease',
      }}>{description}</p>

      <button
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.5)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.9)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.2)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.5)';
        }}
        style={{
          marginTop: '8px', alignSelf: 'flex-start',
          fontFamily: 'var(--font-rajdhani), sans-serif',
          fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase' as const, color: '#fff',
          background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.5)',
          padding: '8px 20px', borderRadius: '4px', cursor: 'pointer',
          transition: 'background 0.25s ease, border-color 0.25s ease',
        }}
      >
        Learn more →
      </button>
    </div>
  );
};

const Features = () => {
  const { ref: headRef, inView: headIn } = useInView(0.3);

  return (
    <section
      id="features"
      className="page-section"
      style={{
      padding: '96px 64px',
      background: '#f8fafc',
      fontFamily: 'var(--font-rajdhani), sans-serif',
    }}>
      {/* Section heading */}
      <div
        ref={headRef}
        style={{
          textAlign: 'center', marginBottom: '64px',
          opacity: headIn ? 1 : 0,
          transform: headIn ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <span style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em',
          textTransform: 'uppercase' as const, color: '#dc2626',
        }}>
          Why StarkScripts
        </span>
        <h2 style={{
          fontFamily: 'var(--font-orbitron), monospace',
          fontSize: '32px', fontWeight: 700, color: '#0f172a',
          margin: '10px 0 14px', letterSpacing: '0.02em',
        }}>
          Built for the <span style={{ color: '#dc2626' }}>Extraordinary</span>
        </h2>
        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
          Everything you need to build, deploy, and scale — assembled with Stark-level precision.
        </p>
      </div>

      {/* 3-column grid */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Left column — delays: 200ms, 450ms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          {featuresData[0].cards.map((card, i) => (
            <SmallCard key={card.title} {...card} delay={200 + i * 250} />
          ))}
        </div>

        {/* Center tall card — delay: 350ms */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <TallCard {...featuresData[1].cards[0]} />
        </div>

        {/* Right column — delays: 500ms, 750ms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          {featuresData[2].cards.map((card, i) => (
            <SmallCard key={card.title} {...card} delay={500 + i * 250} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;