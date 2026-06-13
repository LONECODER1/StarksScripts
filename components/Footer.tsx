'use client';
import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import styles from '@/app/styles/Footer.module.css';

interface FooterLink { name: string; href: string; }
interface FooterSection { title: string; links: FooterLink[]; }

const sections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { name: 'Overview', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Marketplace', href: '#' },
      { name: 'Features', href: '#' },
      { name: 'Integrations', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '#' },
      { name: 'Team', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '#' },
      { name: 'Documentation', href: '#' },
      { name: 'Status', href: '#' },
      { name: 'Community', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Guides', href: '#' },
      { name: 'Templates', href: '#' },
      { name: 'Sales', href: '#' },
      { name: 'Advertise', href: '#' },
    ],
  },
];

const socials = [
  { icon: FaGithub, href: '#', label: 'GitHub' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaFacebook, href: '#', label: 'Facebook' },
];

const SocialIcon = ({ icon: Icon, href, label }: { icon: React.ElementType; href: string; label: string }) => {
  return (
    <a
      href={href}
      aria-label={label}
      className={styles.socialIcon}
    >
      <Icon size={15} />
    </a>
  );
};

const FooterLinkItem = ({ name, href }: FooterLink) => {
  return (
    <li>
      <a
        href={href}
        className={styles.footerLink}
      >
        <span className={styles.linkDot} />
        {name}
      </a>
    </li>
  );
};

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className={styles.newsletterContainer}>
      <div>
        <span className={styles.newsletterSubtitle}>
          Stay in the Loop
        </span>
        <h4 className={styles.newsletterTitle}>
          Get Stark Dispatches
        </h4>
        <p className={styles.newsletterDesc}>
          Updates, releases, and intel — delivered to your inbox.
        </p>
      </div>

      {submitted ? (
        <div className={styles.submittedBox}>
          You are in. Welcome to the network.
        </div>
      ) : (
        <div className={styles.formRow}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className={styles.emailInput}
          />
          <button
            type="button"
            onClick={handleSubmit}
            className={styles.subscribeBtn}
          >
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className={`page-section ${styles.footer}`}>
      <div className={styles.topBorderGlow} />

      <div className={styles.footerContainer}>
        <div className={styles.topRow}>
          <div className={styles.brandCol}>
            <a href="#" className={styles.brandLink}>
              <div className={styles.logoIconWrapper}>
                <span className={styles.logoHexagon}>⬡</span>
              </div>
              <div style={{ lineHeight: 1 }}>
                <div className={styles.brandName}>
                  Stark<span className={styles.brandAccent}>Scripts</span>
                </div>
                <div className={styles.brandTagline}>
                  Powered by Arc Reactor
                </div>
              </div>
            </a>
            <p className={styles.brandDesc}>
              Finely engineered developer tools built with Stark-level precision. Ship faster. Break nothing.
            </p>
            <div className={styles.socialsRow}>
              {socials.map(s => <SocialIcon key={s.label} {...s} />)}
            </div>
          </div>
          <NewsletterBox />
        </div>

        <div className={styles.linksGrid}>
          {sections.map(section => (
            <div key={section.title}>
              <h3 className={styles.linksColTitle}>
                {section.title}
              </h3>
              <ul className={styles.linksList}>
                {section.links.map(link => (
                  <FooterLinkItem key={link.name} {...link} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © 2024 StarkScripts. All rights reserved.
          </p>
          <ul className={styles.bottomLinks}>
            {[{ name: 'Terms and Conditions', href: '#' }, { name: 'Privacy Policy', href: '#' }].map(link => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={styles.bottomLink}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;