'use client';
import React, { useEffect, useRef, useState } from 'react';
import { featuresData } from '@/app/utils/data/HomePage.data';
import styles from '@/app/styles/Features.module.css';

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

  return (
    <div
      ref={ref}
      className={`${styles.smallCard} ${inView ? styles.inView : ''}`}
      style={{
        '--tag-color': tagColor === '#dc2626' ? 'var(--primary)' : 'var(--secondary)',
        '--tag-color-alpha': tagColor === '#dc2626' ? 'color-mix(in srgb, var(--primary) 15%, transparent)' : 'color-mix(in srgb, var(--secondary) 15%, transparent)',
        '--delay': `${delay}ms`,
      } as React.CSSProperties}
    >
      <div className={styles.icon}>{icon}</div>

      <span className={styles.tag}>{tag}</span>

      <div className={styles.title}>{title}</div>

      <p className={styles.description}>{description}</p>

      <div className={styles.bottomBar} />
    </div>
  );
};

const TallCard = ({ icon, title, description, tag, tagColor }: {
  icon: string; title: string; description: string; tag: string; tagColor: string;
}) => {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`${styles.tallCard} ${inView ? styles.inView : ''}`}
      style={{
        '--tag-color': 'var(--primary)',
      } as React.CSSProperties}
    >
      <div className={styles.topGlow} />

      <div className={styles.tallIcon}>{icon}</div>

      <span className={styles.tallTag}>{tag}</span>

      <div className={styles.tallTitle}>{title}</div>

      <div className={styles.tallDivider} />

      <p className={styles.tallDescription}>{description}</p>

      <button type="button" className={styles.tallBtn}>
        Learn more →
      </button>
    </div>
  );
};

const Features = () => {
  const { ref: headRef, inView: headIn } = useInView(0.3);

  return (
    <section id="features" className={`page-section ${styles.featuresSection}`}>
      <div
        ref={headRef}
        className={`${styles.sectionHeading} ${headIn ? styles.headingIn : ''}`}
      >
        <span className={styles.sectionSubtitle}>
          Why StarkScripts
        </span>
        <h2 className={styles.sectionTitle}>
          Built for the <span className={styles.highlightText}>Extraordinary</span>
        </h2>
        <p className={styles.sectionDescription}>
          Everything you need to build, deploy, and scale — assembled with Stark-level precision.
        </p>
      </div>

      <div className={styles.gridContainer}>
        {/* Left column */}
        <div className={styles.gridColumn}>
          {featuresData[0].cards.map((card, i) => (
            <SmallCard key={card.title} {...card} delay={200 + i * 250} />
          ))}
        </div>

        {/* Center column */}
        <div className={styles.gridColumn}>
          <TallCard {...featuresData[1].cards[0]} />
        </div>

        {/* Right column */}
        <div className={styles.gridColumn}>
          {featuresData[2].cards.map((card, i) => (
            <SmallCard key={card.title} {...card} delay={500 + i * 250} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;