"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { testimonialsData } from "@/app/data/bubble.data";

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
    <div className="relative w-full overflow-visible">
      {/* Edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#8B0000] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-[#8B0000] to-transparent z-10" />

      <motion.div
        className="flex gap-6 w-max overflow-visible hover:[animation-play-state:paused]"
        variants={marqueeVariants}
        animate="animate"
      >
        {duplicatedTestimonials.map((t, i) => (
          <div
            className="flex-none w-[85vw] xs:w-[70vw] sm:w-[300px] md:w-[320px] lg:w-[350px] h-[320px] sm:h-[300px] py-6"
            key={`${direction}-${i}`}
          >
            <div className="flex flex-col h-full bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl text-yellow-500 mb-3">❝</div>
              <p className="text-gray-800 font-medium text-sm leading-relaxed mb-4">
                {t.description}
              </p>
              <div className="mt-auto">
                <div className="text-gray-900 font-bold text-base">{t.name}</div>
                <div className="text-gray-700 font-medium text-xs bg-yellow-100 px-2 py-0.5 rounded-full inline-block mt-1">
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
      className="page-section min-h-screen w-full overflow-hidden bg-[#8B0000]"
    >
      <div className="text-center text-white mb-10 sm:mb-12 pt-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-yellow-200 via-white to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
          Voices of Hope
        </h1>
        <p className="text-base sm:text-lg text-white/90 font-medium italic drop-shadow-lg">
          Let Your Legacy Breathe, Beat, and See Again.
        </p>
      </div>

      <div className="w-full flex flex-col gap-10 overflow-visible mb-16">
        <TestimonialRow testimonials={testimonialsData} direction="left" />
        <TestimonialRow testimonials={secondRowTestimonials} direction="right" />
      </div>
    </section>
  );
};

export default Testimonials;
