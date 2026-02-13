"use client"
import React, { useMemo } from 'react';
import { animationVariants, bubbles } from '../data/bubbleData';

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
    // OUTER WRAPPER = fake border
    <div className="min-h-screen bg-amber-50 p-2">

      {/* INNER CONTAINER = curved */}
      <div className="relative min-h-screen bg-linear-to-br from-black via-gray-900 to-black rounded-2xl overflow-hidden">

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
                className="animate-float"
                style={{
                  animationDuration: `${bubble.floatDuration}s`,
                  animationDelay: `${bubble.delay * 0.5}ms`,
                }}
              >
                {/* Horizontal drift */}
                <div 
                  className="animate-drift"
                  style={{
                    animationDuration: `${bubble.driftDuration}s`,
                    animationDelay: `${bubble.delay * 0.3}ms`,
                  }}
                >
                  {/* Rise animation */}
                  <div className={animationVariants[index % animationVariants.length]}>
                    {/* Rotation + scale pulse */}
                    <div
                      className={`${bubble.size} transform animate-bubble-spin`}
                      style={{
                        animationDuration: `${bubble.rotationDuration}s`,
                        animationDirection: bubble.rotationDirection,
                      }}
                    >
                      {/* Breathing effect */}
                      <div 
                        className="animate-breathe"
                        style={{
                          animationDuration: `${3 + (index % 3)}s`,
                          animationDelay: `${bubble.delay * 0.7}ms`,
                        }}
                      >
                        <div
                          className={`w-full h-full rounded-full overflow-hidden border-4 ${bubble.border}
                          shadow-2xl ring-4 ring-black/40 bg-linear-to-br ${bubble.bg}
                          flex items-center justify-center relative group transition-all duration-300
                          hover:scale-110 hover:ring-8 hover:ring-white/20`}
                          style={{
                            transform: `scale(${bubble.scaleVariation})`,
                            opacity: bubble.opacity,
                            filter: bubble.blur ? 'blur(0.5px)' : 'none',
                          }}
                        >
                          {/* Animated glow ring */}
                          <div 
                            className="absolute inset-0 rounded-full animate-pulse-glow"
                            style={{
                              boxShadow: `0 0 30px ${bubble.bg.includes('blue') ? '#3b82f6' : bubble.bg.includes('purple') ? '#a855f7' : bubble.bg.includes('pink') ? '#ec4899' : bubble.bg.includes('green') ? '#10b981' : '#f59e0b'}`,
                              animationDelay: `${bubble.delay * 0.4}ms`,
                            }}
                          />
                          
                          {/* Glass reflection */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-full pointer-events-none" />
                          
                          {/* Image */}
                          <img
                            src={bubble.src}
                            alt={bubble.name}
                            className="w-full h-full object-cover relative z-10"
                          />
                          
                          {/* Bottom shine */}
                          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/20 to-transparent rounded-b-full pointer-events-none" />
                          
                          {/* Sparkle */}
                          <div 
                            className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full animate-sparkle"
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

        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          
          @keyframes drift {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(10px); }
          }
          
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
          }
          
          @keyframes bubble-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-float {
            animation: float 5s ease-in-out infinite;
          }
          
          .animate-drift {
            animation: drift 8s ease-in-out infinite;
          }
          
          .animate-breathe {
            animation: breathe 3s ease-in-out infinite;
          }
          
          .animate-pulse-glow {
            animation: pulse-glow 2.5s ease-in-out infinite;
          }
          
          .animate-sparkle {
            animation: sparkle 3s ease-in-out infinite;
          }
          
          .animate-bubble-spin {
            animation: bubble-rotate 10s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Hero;