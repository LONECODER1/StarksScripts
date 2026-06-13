"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { testimonialsData } from "@/app/utils/data/bubble.data";
import styles from "@/app/styles/Testimonials.module.css";

type Testimonial = {
  name: string;
  role: string;
  description: string;
};

interface TestimonialRowProps {
  testimonials: Testimonial[];
  direction?: "left" | "right";
}

const TestimonialRow: React.FC<TestimonialRowProps> = ({
  testimonials,
  direction = "left",
}) => {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  const marqueeVariants: Variants = {
    animate: {
      x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 35,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className={styles.marqueeRow}>
      {/* Edge fade */}
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />

      <motion.div
        className="flex gap-6 w-max overflow-visible hover:[animation-play-state:paused]"
        variants={marqueeVariants}
        animate="animate"
      >
        {duplicatedTestimonials.map((t, i) => (
          <div
            className={styles.cardColumn}
            key={`${direction}-${i}`}
          >
            <div className={styles.card}>
              <div className={styles.quoteIcon}>❝</div>
              <p className={styles.description}>
                {t.description}
              </p>
              <div className={styles.footerRow}>
                <div className={styles.name}>{t.name}</div>
                <div className={styles.role}>
                  {t.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const secondRowTestimonials = [...testimonialsData].reverse();

  return (
    <section
      id="testimonials"
      className={`page-section ${styles.section}`}
    >
      <div className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>
          Voices of Hope
        </h1>
        <p className={styles.sectionSubtitle}>
          Let Your Legacy Breathe, Beat, and See Again.
        </p>
      </div>

      <div className={styles.marqueeWrapper}>
        <TestimonialRow testimonials={testimonialsData} direction="left" />
        <TestimonialRow testimonials={secondRowTestimonials} direction="right" />
      </div>
    </section>
  );
};

export default Testimonials;
