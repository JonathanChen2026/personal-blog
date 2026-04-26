'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { config } from '../site.config';

const { home } = config;

// ── Reusable styles ──────────────────────────────────────
const sectionLabelStyle = {
  fontSize: '13px',
  letterSpacing: '0.12em',
  color: 'var(--muted)',
  textTransform: 'uppercase' as const,
  marginBottom: '14px',
  marginTop: '32px',
};

const entryStyle = {
  fontSize: home.paragraphFontSize,
  lineHeight: '1.8',
  marginBottom: '16px',
  color: 'var(--text)',
};

const mutedSpanStyle = {
  color: 'var(--muted)',
  marginLeft: '6px',
};

const linkStyle = {
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  color: 'inherit',
};

// ── Animation variant — flies up and fades in ────────────
const flyUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ── Animated paragraph ───────────────────────────────────
// delay increases with each block so they stagger sequentially
function Bio({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.p
      variants={flyUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{
        fontSize: home.paragraphFontSize,
        lineHeight: home.paragraphLineHeight,
        marginBottom: home.paragraphSpacing,
        fontWeight: home.paragraphFontWeight,
        color: 'var(--text)',
      }}
    >
      {children}
    </motion.p>
  );
}

// ── Animated block for sections (education, experience etc) ──
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      variants={flyUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ maxWidth: '680px' }}>

      {/* Icon — animates in first */}
      <motion.div
        variants={flyUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0, ease: 'easeOut' }}
        style={{ fontSize: home.iconSize, marginBottom: home.iconMarginBottom }}
      >
        <img
          src="/stamp.png"
          alt= "icon"
          style={{ width: home.iconSize, height: 'auto' }}
        />
      </motion.div>

      {/* Bio paragraphs — each staggers 0.1s after the previous */}
      <Bio delay={0.1}>Hi, I&apos;m Jonathan Chen! I&apos;m 17.</Bio>

      <Bio delay={0.2}>I&apos;m an incoming freshman at Purdue University, studying Data Science and Molecular Bio.</Bio>

      <Bio delay={0.3}>I&apos;ve previously interned at Walmart Global Tech, and have had various research experiences in computational biology and wet lab settings. I will also be joining Eli Lilly in Indianapolis during my sophomore year.</Bio>

      <Bio delay={0.4}>
        I love travel photography and drone cinematography ~ check out my work{' '}
        <a href="https://www.instagram.com/johnnyc.photography" target="_blank" rel="noopener noreferrer" style={linkStyle}>@johnnyc.photography</a>
      </Bio>

      <Bio delay={0.5}>
        This page is a place for my shower thoughts, longer reflections, and projects. Happy exploring and please feel free to <Link href="/contact" style={linkStyle}>reach out</Link>!
      </Bio>

      {/* Divider */}
      <motion.hr
        variants={flyUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
        style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '40px 0' }}
      />

      {/* Sections — continue staggering */}
      <FadeIn delay={0.65}>
        <div style={sectionLabelStyle}>Education</div>
        <div style={entryStyle}>
          Purdue University, B.S. Data Science &amp; Molecular Biology
          <span style={mutedSpanStyle}>  2026–</span>
        </div>
        <div style={entryStyle}>
          Bentonville High School
          <span style={mutedSpanStyle}>  2022–2026</span>
        </div>
      </FadeIn>

      <FadeIn delay={0.75}>
        <div style={sectionLabelStyle}>Experience</div>
        <div style={entryStyle}>
          <span style={{ color: '#ff7575' }}>Eli Lilly &amp; Company</span> · Indianapolis, IN · Incoming
        </div>
        <div style={entryStyle}>
          <span style={{ color: '#3bb678' }}>Walmart Global Tech</span> · Bentonville, AR · Software Intern
        </div>
        <div style={entryStyle}>
          <span style={{ color: '#4e6bdf' }}>Institute for Systems Biology</span> · Seattle, WA · Research Intern
        </div>
      </FadeIn>

      <FadeIn delay={0.85}>
        <div style={sectionLabelStyle}>Honors</div>
        <div style={entryStyle}>
          Coca-Cola Scholar Finalist · Lilly Scholar at Purdue (Full Tuition Scholarship) · National Merit Commended Scholar · All-State Violinist
        </div>
      </FadeIn>

    </div>
  );
}