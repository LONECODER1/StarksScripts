"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "@/app/styles/FAQs.module.css";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Faq1Props {
  heading?: string;
  items?: FaqItem[];
}

const Faq1 = ({
  heading = "Frequently asked questions",
  items = [
    {
      id: "faq-1",
      question: "What is Starkscripts?",
      answer:
        "Starkscripts is a premium platform for cutting-edge automation scripts, developer tools, and API resources inspired by Tony Stark's engineering marvels.",
    },
    {
      id: "faq-2",
      question: "Are the scripts secure to run on my system?",
      answer:
        "Yes, absolutely. Every script is meticulously sandboxed, static-analyzed, and digitally signed before distribution to guarantee 100% security.",
    },
    {
      id: "faq-3",
      question: "Can I customize the scripts for my own commercial projects?",
      answer:
        "Definitely! All purchased assets grant you full access to clean, well-documented source code, with a license authorizing commercial custom integrations.",
    },
    {
      id: "faq-4",
      question: "How do I receive updates when tools are upgraded?",
      answer:
        "Whenever a tool is upgraded, we automatically notify you. You can download the latest version instantly from your account dashboard free of charge.",
    },
    {
      id: "faq-5",
      question: "What stack is Starkscripts built on?",
      answer:
        "We develop our tools and platform using a top-tier modern ecosystem, including Next.js, React, TypeScript, Node.js, Prisma, and Redis.",
    },
    {
      id: "faq-6",
      question: "Do you offer developer support for custom integrations?",
      answer:
        "Yes. We offer dedicated 24/7 technical support from our lead engineers to help you build, adapt, or troubleshoot your custom tools.",
    },
  ],
}: Faq1Props) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={styles.faqSection}>
      <div className={styles.container}>
        <h1 className={styles.heading}>{heading}</h1>
        <div className={styles.accordion}>
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={styles.item}
                data-state={isOpen ? "open" : "closed"}
              >
                <button
                  className={styles.trigger}
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <ChevronDown className={styles.triggerIcon} />
                </button>
                <div className={styles.contentWrapper}>
                  <div className={styles.contentInner}>
                    <div className={styles.content}>{item.answer}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { Faq1 };
