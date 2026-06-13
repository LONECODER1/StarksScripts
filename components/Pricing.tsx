'use client';
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/Pricing.module.css';

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
  const time = useCountdown();
  const price = (plan.prices as Record<string, { original: number; discounted: number }>)[selectedDuration];

  return (
    <div className={`${styles.card} ${plan.popular ? styles.cardPopular : ''}`}>

      {/* Most Popular Banner */}
      {plan.popular && (
        <div className={styles.popularBanner}>
          🏆 Most Popular
        </div>
      )}

      <div className={styles.cardContent}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={styles.emoji}>{plan.emoji}</div>
          <div className={styles.titleArea}>
            <span className={styles.planName}>{plan.name}</span>
            <span className={styles.learnersCount}>
              ({plan.learners} Learners)
            </span>
          </div>
          <div className={styles.tagline}>
            {plan.tagline}
          </div>
        </div>

        {/* Duration tabs */}
        <div className={styles.tabs}>
          {plan.durations.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDuration(d)}
              className={`${styles.tabBtn} ${selectedDuration === d ? styles.tabBtnActive : ''}`}
            >
              {d === plan.bestValue && (
                <span className={styles.bestValueBadge}>BEST VALUE</span>
              )}
              {d}
            </button>
          ))}
        </div>

        {/* Pricing */}
        <div className={styles.pricingArea}>
          <div className={styles.originalPriceRow}>
            <span className={styles.originalPrice}>
              ₹{price.original.toLocaleString('en-IN')}.00
            </span>
            <span className={styles.countdown}>
              ⏱ {pad(time.h)}H : {pad(time.m)}M : {pad(time.s)}S
            </span>
          </div>
          <div className={styles.discountedPrice}>
            ₹{price.discounted.toLocaleString('en-IN')}.00
          </div>
          <div className={styles.promoBadgeRow}>
            <span className={styles.promoIcon}>🏷</span>
            <span className={styles.promoDiscount}>
              35% OFF
            </span>
            <span className={styles.promoDot}>·</span>
            <span className={styles.promoCode}>
              SUMMERARC
            </span>
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          type="button"
          className={`${styles.subscribeBtn} ${plan.popular ? styles.subscribeBtnPopular : ''}`}
        >
          {plan.popular ? '🚀 Subscribe to Pinnacle' : '⚡ Subscribe to Sprint'}
        </button>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Features */}
      <div className={styles.featuresArea}>
        <ul className={styles.featuresList}>
          {plan.features.map((f, i) => (
            <li key={i} className={`${styles.featureItem} ${f.included ? styles.featureIncluded : ''}`}>
              <span className={`${styles.iconWrapper} ${f.included ? styles.iconIncluded : ''}`}>
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
    <section id="pricing" className={`page-section ${styles.pricingSection}`}>
      {/* Heading */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionSubtitle}>
          Pricing Plans
        </span>
        <h2 className={styles.sectionTitle}>
          Choose Your <span className={styles.highlightText}>Path</span>
        </h2>
        <p className={styles.sectionDescription}>
          Both plans built for placement success — pick the depth that fits your goals.
        </p>
      </div>

      {/* Cards */}
      <div className={styles.cardsContainer}>
        {plans.map(plan => <PricingCard key={plan.id} plan={plan} />)}
      </div>
    </section>
  );
};

export default Pricing;