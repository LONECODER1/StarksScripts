"use client";

import React from "react";
import { testimonialsData } from "@/app/utils/data/HomePage.data";
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

  return (
    <div className={styles.marqueeRow}>
      {/* Edge fade */}
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />

      <div
        className={`${styles.marqueeContainer} ${
          direction === "left" ? styles.marqueeLeft : styles.marqueeRight
        }`}
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
      </div>
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
