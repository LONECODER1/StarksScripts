'use client';
import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

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
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '34px', height: '34px', borderRadius: '8px',
        border: `1px solid ${hovered ? 'rgba(220,38,38,0.6)' : 'rgba(0,0,0,0.1)'}`,
        background: hovered ? 'rgba(220,38,38,0.06)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hovered ? '#dc2626' : '#94a3b8',
        transition: 'all 0.22s ease',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      <Icon size={15} />
    </a>
  );
};

const FooterLinkItem = ({ name, href }: FooterLink) => {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <a
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontSize: '13px',
          fontFamily: 'var(--font-rajdhani), sans-serif',
          fontWeight: 500,
          color: hovered ? '#dc2626' : '#64748b',
          textDecoration: 'none',
          letterSpacing: '0.02em',
          transition: 'color 0.2s ease',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
      >
        <span style={{
          display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%',
          background: hovered ? '#dc2626' : 'transparent',
          border: `1px solid ${hovered ? '#dc2626' : 'rgba(100,116,139,0.4)'}`,
          transition: 'all 0.2s ease', flexShrink: 0,
        }} />
        {name}
      </a>
    </li>
  );
};

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '340px', width: '100%',
    }}>
      <div>
        <span style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#dc2626',
          fontFamily: 'var(--font-rajdhani), sans-serif',
        }}>
          Stay in the Loop
        </span>
        <h4 style={{
          fontFamily: 'var(--font-orbitron), monospace',
          fontSize: '15px', fontWeight: 700, color: '#0f172a',
          margin: '6px 0 4px', letterSpacing: '0.02em',
        }}>
          Get Stark Dispatches
        </h4>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
          Updates, releases, and intel — delivered to your inbox.
        </p>
      </div>

      {submitted ? (
        <div style={{
          fontSize: '13px', color: '#059669', fontWeight: 600,
          fontFamily: 'var(--font-rajdhani), sans-serif',
          letterSpacing: '0.04em',
          padding: '12px 16px',
          background: 'rgba(5,150,105,0.06)',
          border: '1px solid rgba(5,150,105,0.3)',
          borderRadius: '8px',
        }}>
          You are in. Welcome to the network.
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              flex: 1, padding: '10px 14px',
              fontSize: '13px', fontFamily: 'var(--font-rajdhani), sans-serif',
              color: '#0f172a', background: '#f8fafc',
              border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px',
              outline: 'none', letterSpacing: '0.02em',
            }}
          />
          <button
            onClick={handleSubmit}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            style={{
              padding: '10px 18px',
              fontFamily: 'var(--font-rajdhani), sans-serif',
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#fff',
              background: btnHovered ? '#b91c1c' : '#dc2626',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              transition: 'background 0.2s ease',
              whiteSpace: 'nowrap',
            }}
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
    <footer
      id="contact"
      className="page-section"
      style={{
      background: '#ffffff',
      borderTop: '1px solid rgba(220,38,38,0.2)',
      fontFamily: 'var(--font-rajdhani), sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.7), rgba(250,204,21,0.5), rgba(220,38,38,0.7), transparent)',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 64px 0' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          gap: '48px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
            <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '1.5px solid rgba(220,38,38,0.6)',
                background: 'rgba(220,38,38,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: '#dc2626', fontSize: '16px' }}>⬡</span>
              </div>
              <div style={{ lineHeight: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-orbitron), monospace',
                  fontSize: '16px', fontWeight: 700, color: '#0f172a', letterSpacing: '0.04em',
                }}>
                  Stark<span style={{ color: '#dc2626' }}>Scripts</span>
                </div>
                <div style={{
                  fontSize: '9px', color: 'rgba(100,116,139,0.7)',
                  letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '3px',
                }}>
                  Powered by Arc Reactor
                </div>
              </div>
            </a>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
              Finely engineered developer tools built with Stark-level precision. Ship faster. Break nothing.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {socials.map(s => <SocialIcon key={s.label} {...s} />)}
            </div>
          </div>
          <NewsletterBox />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          padding: '48px 0',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
        }}>
          {sections.map(section => (
            <div key={section.title}>
              <h3 style={{
                fontFamily: 'var(--font-orbitron), monospace',
                fontSize: '11px', fontWeight: 700, color: '#0f172a',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: '20px', marginTop: 0,
              }}>
                {section.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {section.links.map(link => (
                  <FooterLinkItem key={link.name} {...link} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          padding: '24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, letterSpacing: '0.04em' }}>
            © 2024 StarkScripts. All rights reserved.
          </p>
          <ul style={{ display: 'flex', gap: '24px', listStyle: 'none', padding: 0, margin: 0 }}>
            {[{ name: 'Terms and Conditions', href: '#' }, { name: 'Privacy Policy', href: '#' }].map(link => (
              <li key={link.name}>
                <a
                  href={link.href}
                  style={{
                    fontSize: '12px', color: '#94a3b8',
                    textDecoration: 'underline', textUnderlineOffset: '3px',
                    letterSpacing: '0.04em', transition: 'color 0.2s ease',
                    fontFamily: 'var(--font-rajdhani), sans-serif', fontWeight: 500,
                  }}
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