'use client';
import React, { useState, useEffect } from 'react';

const plans = [
  {
    id: 'sprint',
    name: 'Sprint',
    emoji: '🏃',
    tagline: 'Complete placement preparation',
    learners: '12K+',
    popular: false,
    durations: ['12 Months', '48 Months'],
    prices: { '12 Months': { original: 5899, discounted: 3834 }, '48 Months': { original: 9999, discounted: 6499 } },
    bestValue: null,
    features: [
      { text: 'DSA (Basics to Advanced)', included: true },
      { text: 'DSA (Revision Pattern Sheet)', included: true },
      { text: 'DSA (Quick Revision Sheet)', included: true },
      { text: 'DBMS, CN and OS', included: true },
      { text: 'Aptitude and Mock Tests', included: true },
      { text: 'Premium Problems', included: false },
      { text: 'AI Features', included: false },
      { text: 'Career Guidance & Group Sessions', included: false },
    ],
  },
  {
    id: 'pinnacle',
    name: 'Pinnacle',
    emoji: '🏔️',
    tagline: 'Complete placement preparation',
    learners: '47K+',
    popular: true,
    durations: ['12 Months', '24 Months', '48 Months', 'Lifetime'],
    prices: {
      '12 Months': { original: 9999, discounted: 6499 },
      '24 Months': { original: 14999, discounted: 9749 },
      '48 Months': { original: 19999, discounted: 12999 },
      'Lifetime': { original: 24999, discounted: 16249 },
    },
    bestValue: '48 Months',
    features: [
      { text: 'DSA (All tracks)', included: true },
      { text: 'DBMS, CN and OS', included: true },
      { text: 'Aptitude and Mock Tests', included: true },
      { text: 'OOPs (Practice Included)', included: true },
      { text: 'Low Level Design', included: true },
      { text: 'SQL + Data Engineering', included: true },
      { text: 'Premium Problems', included: true },
      { text: 'AI Features', included: true },
      { text: 'Career Guidance & Group Sessions', included: true },
    ],
  },
];

const useCountdown = () => {
  const [time, setTime] = useState({ h: 1, m: 1, s: 34 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

const pad = (n: number) => String(n).padStart(2, '0');

const PricingCard = ({ plan }: { plan: typeof plans[0] }) => {
  const [selectedDuration, setSelectedDuration] = useState(plan.durations[0]);
  const [btnHovered, setBtnHovered] = useState(false);
  const time = useCountdown();
  const price = (plan.prices as Record<string, { original: number; discounted: number }>)[selectedDuration];

  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '20px',
      overflow: 'hidden',
      width: '380px',
      flexShrink: 0,
      border: plan.popular ? '2px solid #e8722a' : '1px solid rgba(255,255,255,0.08)',
      position: 'relative',
      boxShadow: plan.popular
        ? '0 0 40px rgba(232,114,42,0.2), 0 20px 60px rgba(0,0,0,0.5)'
        : '0 20px 60px rgba(0,0,0,0.4)',
      fontFamily: 'var(--font-rajdhani), sans-serif',
      animation: 'fadeUp 0.6s ease forwards',
      opacity: 0,
      animationDelay: plan.popular ? '0.1s' : '0s',
    }}>

      {/* Most Popular Banner */}
      {plan.popular && (
        <div style={{
          background: 'linear-gradient(135deg, #e8722a, #f59340)',
          padding: '10px 24px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          🏆 Most Popular
        </div>
      )}

      <div style={{ padding: '28px 28px 0' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>{plan.emoji}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-orbitron), monospace',
              fontSize: '22px', fontWeight: 700, color: '#ffffff',
            }}>{plan.name}</span>
            <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 600 }}>
              ({plan.learners} Learners)
            </span>
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px', fontWeight: 500 }}>
            {plan.tagline}
          </div>
        </div>

        {/* Duration tabs */}
        <div style={{
          display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px',
        }}>
          {plan.durations.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDuration(d)}
              style={{
                position: 'relative',
                padding: '8px 16px',
                borderRadius: '50px',
                border: selectedDuration === d ? '1.5px solid #e8722a' : '1.5px solid rgba(255,255,255,0.15)',
                background: selectedDuration === d ? 'transparent' : 'rgba(255,255,255,0.04)',
                color: selectedDuration === d ? '#e8722a' : 'rgba(255,255,255,0.6)',
                fontSize: '13px', fontWeight: 600,
                fontFamily: 'var(--font-rajdhani), sans-serif',
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'all 0.2s ease',
              }}
            >
              {d === plan.bestValue && (
                <span style={{
                  position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                  background: '#e8722a', color: '#fff',
                  fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
                  padding: '2px 8px', borderRadius: '20px', whiteSpace: 'nowrap',
                }}>BEST VALUE</span>
              )}
              {d}
            </button>
          ))}
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '16px', color: 'rgba(255,255,255,0.35)',
              textDecoration: 'line-through',
              fontFamily: 'var(--font-orbitron), monospace',
            }}>
              ₹{price.original.toLocaleString('en-IN')}.00
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', color: 'rgba(255,255,255,0.5)',
            }}>
              ⏱ {pad(time.h)}H : {pad(time.m)}M : {pad(time.s)}S
            </span>
          </div>
          <div style={{
            fontFamily: 'var(--font-orbitron), monospace',
            fontSize: '36px', fontWeight: 700, color: '#ffffff', lineHeight: 1,
            marginBottom: '10px',
          }}>
            ₹{price.discounted.toLocaleString('en-IN')}.00
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#e8722a', fontSize: '13px' }}>🏷</span>
            <span style={{ fontSize: '13px', color: '#e8722a', fontWeight: 700, letterSpacing: '0.06em' }}>
              35% OFF
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>·</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.06em' }}>
              SUMMERARC
            </span>
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: 'none',
            background: btnHovered
              ? 'linear-gradient(135deg, #f59340, #e8722a)'
              : plan.popular
                ? 'linear-gradient(135deg, #e8722a, #c85d1a)'
                : 'transparent',
            borderWidth: plan.popular ? 0 : '1.5px',
            borderStyle: 'solid',
            borderColor: '#e8722a',
            color: plan.popular ? '#fff' : btnHovered ? '#fff' : '#e8722a',
            fontFamily: 'var(--font-orbitron), monospace',
            fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            transform: btnHovered ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: btnHovered ? '0 8px 24px rgba(232,114,42,0.4)' : 'none',
            marginBottom: '24px',
          }}
        >
          {plan.popular ? '🚀 Subscribe to Pinnacle' : '⚡ Subscribe to Sprint'}
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '0 28px' }} />

      {/* Features */}
      <div style={{ padding: '20px 28px 28px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {plan.features.map((f, i) => (
            <li key={i} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              fontSize: '13px',
              color: f.included ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
              fontWeight: f.included ? 600 : 500,
            }}>
              <span style={{
                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                background: f.included ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1.5px solid ${f.included ? '#4ade80' : 'rgba(255,255,255,0.15)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px',
              }}>
                {f.included ? '✓' : '✕'}
              </span>
              {f.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="page-section"
      style={{
      background: '#111111',
      padding: '96px 64px',
      fontFamily: 'var(--font-rajdhani), sans-serif',
      minHeight: '100vh',
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#e8722a',
        }}>
          Pricing Plans
        </span>
        <h2 style={{
          fontFamily: 'var(--font-orbitron), monospace',
          fontSize: '32px', fontWeight: 700, color: '#ffffff',
          margin: '10px 0 14px', letterSpacing: '0.02em',
        }}>
          Choose Your <span style={{ color: '#e8722a' }}>Path</span>
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
          Both plans built for placement success — pick the depth that fits your goals.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'flex', gap: '28px', justifyContent: 'center',
        alignItems: 'flex-start', flexWrap: 'wrap',
      }}>
        {plans.map(plan => <PricingCard key={plan.id} plan={plan} />)}
      </div>
    </section>
  );
};

export default Pricing;