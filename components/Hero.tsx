"use client"
import React from 'react';
import styles from '@/app/styles/Hero.module.css';

const Hero = () => {
  const quantity = 10;
  const items = Array.from({ length: quantity }, (_, i) => i + 1);

  return (
    <div id="home" className={styles.heroSection}>
      <div className={styles.banner}>
        <div className={styles.slider} style={{ '--quantity': quantity } as React.CSSProperties}>
          {items.map((pos) => (
            <div
              key={pos}
              className={styles.item}
              style={{ '--position': pos } as React.CSSProperties}
            >
              <img src={`/assets/3d-slider/images/dragon_${pos}.jpg`} alt={`Dragon ${pos}`} />
            </div>
          ))}
        </div>
        <div className={styles.content}>
          <h1 data-content="CSS ONLY">
            CSS ONLY
          </h1>
          <div className={styles.author}>
            <h2>Aditya Gupta</h2>
            <p><b>Web Design</b></p>
            <p>
              Reach me to do more like this content.
            </p>
          </div>
          <div className={styles.model}></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;