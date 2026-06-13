"use client"
import React, { useMemo } from 'react';
import { animationVariants, bubbles } from '@/app/utils/data/bubble.data';
import styles from '@/app/styles/Hero.module.css';

interface RandomizedBubble {
  top: string;
  left: string;
  delay: number;
  size: string;
  border: string;
  bg: string;
  src: string;
  name: string;
  rotationDuration: number;
  rotationDirection: 'normal' | 'reverse';
  scaleVariation: number;
  opacity: number;
  blur: boolean;
  floatDuration: number;
  driftDuration: number;
}

const getColorForBubble = (name: string) => {
  switch (name) {
    case "Iron Man":
    case "Spider-Man":
    case "Ant-Man":
    case "Iron Core":
      return "#E05454"; // Coral
    case "Black Panther":
    case "Wolverine":
    case "Doctor Strange":
      return "#C13383"; // Magenta
    case "Hawkeye":
    case "S.H.I.E.L.D":
      return "#792CA2"; // Purple
    case "Captain America":
    case "Thor":
    case "Hulk":
    default:
      return "#443199"; // Indigo
  }
};

const Hero = () => {

  const randomizedBubbles: RandomizedBubble[] = useMemo(() => {
    const cols = 5;
    const rows = 4;
    const total = cols * rows;

    return Array.from({ length: total }, (_, index) => {
      const bubble = bubbles[index % bubbles.length];
      const row = Math.floor(index / cols);
      const col = index % cols;

      const seed = index * 12345;
      const r = (m: number) => ((seed * m + 49297) % 233280) / 233280;

      // Alternate row offset for zigzag pattern
      const rowOffset = row % 2 === 0 ? 0 : 10;
      
      // Add random variation to break grid pattern
      const randomTopOffset = r(3141) * 8 - 4; // -4% to +4%
      const randomLeftOffset = r(2718) * 12 - 6; // -6% to +6%

      return {
        ...bubble,
        top: `${10 + row * (80 / (rows - 1)) + randomTopOffset}%`,
        left: `${5 + col * (90 / (cols - 1)) + rowOffset + randomLeftOffset}%`,
        delay: Math.floor(r(9301) * 5000),
        rotationDuration: r(6571) * 10 + 5,
        rotationDirection: r(4231) > 0.5 ? 'normal' as const : 'reverse' as const,
        scaleVariation: 0.85 + r(7919) * 0.3,
        opacity: 0.7 + r(3571) * 0.3,
        blur: r(1237) > 0.5,
        floatDuration: 4 + r(7291) * 4, // 4-8 seconds
        driftDuration: 6 + r(5123) * 6, // 6-12 seconds
      };
    });
  }, []);

  return (
    <div id="home" className={styles.heroSection}>

      <div className={styles.innerContainer}>
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.video}
        >
          <source src="/assets/videos/LoginVideo.mp4" type="video/mp4" />
        </video>

        {/* Video Overlay */}
        <div className={styles.overlay} />

        <div className={styles.bubblesWrapper}>
          {randomizedBubbles.map((bubble, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                top: bubble.top,
                left: bubble.left,
                animationDelay: `${bubble.delay}ms`,
              }}
            >
              {/* Vertical floating */}
              <div 
                className={styles.animateFloat}
                style={{
                  animationDuration: `${bubble.floatDuration}s`,
                  animationDelay: `${bubble.delay * 0.5}ms`,
                }}
              >
                {/* Horizontal drift */}
                <div 
                  className={styles.animateDrift}
                  style={{
                    animationDuration: `${bubble.driftDuration}s`,
                    animationDelay: `${bubble.delay * 0.3}ms`,
                  }}
                >
                  {/* Rise animation */}
                  <div className={animationVariants[index % animationVariants.length]}>
                    {/* Rotation + scale pulse */}
                    <div
                      className={`${bubble.size} transform ${styles.animateBubbleSpin}`}
                      style={{
                        animationDuration: `${bubble.rotationDuration}s`,
                        animationDirection: bubble.rotationDirection,
                      }}
                    >
                      {/* Breathing effect */}
                      <div 
                        className={styles.animateBreathe}
                        style={{
                          animationDuration: `${3 + (index % 3)}s`,
                          animationDelay: `${bubble.delay * 0.7}ms`,
                        }}
                      >
                        <div
                          className={styles.bubbleCard}
                          style={{
                            borderColor: `${getColorForBubble(bubble.name)}aa`,
                            transform: `scale(${bubble.scaleVariation})`,
                            opacity: bubble.opacity,
                            filter: bubble.blur ? 'blur(0.5px)' : 'none',
                          }}
                        >
                          {/* Animated glow ring */}
                          <div 
                            className={styles.pulseGlow}
                            style={{
                              boxShadow: `0 0 30px ${getColorForBubble(bubble.name)}`,
                              animationDelay: `${bubble.delay * 0.4}ms`,
                            }}
                          />
                          
                          {/* Glass reflection */}
                          <div className={styles.glassReflection} />
                          
                          {/* Image */}
                          <img
                            src={bubble.src}
                            alt={bubble.name}
                            className={styles.bubbleImage}
                          />
                          
                          {/* Bottom shine */}
                          <div className={styles.bottomShine} />
                          
                          {/* Sparkle */}
                          <div 
                            className={styles.sparkle}
                            style={{
                              animationDelay: `${bubble.delay * 0.6}ms`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;