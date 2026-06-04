'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { config } from '@/site.config';

const { home } = config;

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

const flyUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Bio({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.p
      animate="visible"
      initial="hidden"
      style={{
        fontSize: home.paragraphFontSize,
        lineHeight: home.paragraphLineHeight,
        marginBottom: home.paragraphSpacing,
        fontWeight: home.paragraphFontWeight,
        color: 'var(--text)',
      }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      variants={flyUp}
    >
      {children}
    </motion.p>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      animate="visible"
      initial="hidden"
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      variants={flyUp}
    >
      {children}
    </motion.div>
  );
}

export default function HomePanel() {
  return (
    <div style={{ maxWidth: '680px' }}>
      <motion.div
        animate="visible"
        initial="hidden"
        style={{ fontSize: home.iconSize, marginBottom: home.iconMarginBottom }}
        transition={{ duration: 0.5, delay: 0, ease: 'easeOut' }}
        variants={flyUp}
      >
        <Image
          alt="icon"
          height={80}
          priority
          src="/stamp.png"
          style={{ width: home.iconSize, height: 'auto' }}
          width={80}
        />
      </motion.div>

      <Bio delay={0.1}>hi, i&apos;m Jonathan! 👋🏻</Bio>

      <Bio delay={0.2}>
        i&apos;m an incoming freshman at purdue university, studying data science and molecular bio.
      </Bio>

      <Bio delay={0.3}>
        i&apos;ve previously interned at walmart global tech, and have had various research
        experiences in computational biology and wet lab settings. i will be joining eli lilly in
        indianapolis during my sophomore year.
      </Bio>

      <Bio delay={0.4}>
        i also love travel photography and drone cinematography ~ check out my work{' '}
        <a
          href="https://www.instagram.com/johnnyc.photography"
          rel="noopener noreferrer"
          style={linkStyle}
          target="_blank"
        >
          @johnnyc.photography
        </a>
      </Bio>

      <Bio delay={0.5}>
        this page is a place for my shower thoughts, longer reflections, and projects. happy
        exploring and please feel free to{' '}
        <Link href="/contact" style={linkStyle}>
          reach out
        </Link>
        !
      </Bio>

      <motion.hr
        animate="visible"
        initial="hidden"
        style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '40px 0' }}
        transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
        variants={flyUp}
      />

      <FadeIn delay={0.65}>
        <div style={sectionLabelStyle}>Education</div>
        <div style={entryStyle}>
          Purdue University, B.S. Data Science &amp; Molecular Biology
          <span style={mutedSpanStyle}> 2026-</span>
        </div>
        <div style={entryStyle}>
          Bentonville High School
          <span style={mutedSpanStyle}> 2022-2026</span>
        </div>
      </FadeIn>

      <FadeIn delay={0.75}>
        <div style={sectionLabelStyle}>Experience</div>
        <div style={entryStyle}>
          <span style={{ color: '#ff7575' }}>Eli Lilly &amp; Company</span> · Indianapolis, IN ·
          Incoming
        </div>
        <div style={entryStyle}>
          <span style={{ color: '#3bb678' }}>Walmart Global Tech</span> · Bentonville, AR ·
          Software Intern
        </div>
        <div style={entryStyle}>
          <span style={{ color: '#4e6bdf' }}>Institute for Systems Biology</span> · Seattle, WA ·
          Research Intern
        </div>
      </FadeIn>

      <FadeIn delay={0.85}>
        <div style={sectionLabelStyle}>Honors</div>
        <div style={entryStyle}>
          Coca-Cola Scholar Finalist · Lilly Scholar at Purdue (Full Tuition Scholarship) ·
          National Merit Commended Scholar · All-State Violinist
        </div>
      </FadeIn>
    </div>
  );
}
