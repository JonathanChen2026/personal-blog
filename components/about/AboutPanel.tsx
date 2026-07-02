'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { config } from '@/site.config';
import HomeReturnLink from '@/components/HomeReturnLink';
import styles from './AboutPanel.module.css';
import { ABOUT_PARALLAX, type AboutParallaxLayerConfig } from './aboutParallaxConfig';

const { about } = config;
const { layers, scrollInput } = ABOUT_PARALLAX;

const sectionLabelStyle = {
  fontSize: '13px',
  letterSpacing: '0.12em',
  color: 'var(--about-muted)',
  textTransform: 'uppercase' as const,
  marginBottom: '14px',
  marginTop: '32px',
};

const entryStyle = {
  fontSize: about.paragraphFontSize,
  lineHeight: '1.8',
  marginBottom: '16px',
  color: 'var(--about-text)',
};

const mutedSpanStyle = {
  color: 'var(--about-muted)',
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

const panelFlyUp = {
  hidden: { y: ABOUT_PARALLAX.glass.panelEntranceY, scale: 0.99 },
  visible: { y: 0, scale: 1 },
};

const contentGate = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const glassBlurStyle = {
  backdropFilter: `blur(${ABOUT_PARALLAX.glass.panelBlurPx}px) saturate(${ABOUT_PARALLAX.glass.panelSaturation}%) brightness(${ABOUT_PARALLAX.glass.panelBrightness}%) contrast(${ABOUT_PARALLAX.glass.panelContrast}%)`,
  WebkitBackdropFilter: `blur(${ABOUT_PARALLAX.glass.panelBlurPx}px) saturate(${ABOUT_PARALLAX.glass.panelSaturation}%) brightness(${ABOUT_PARALLAX.glass.panelBrightness}%) contrast(${ABOUT_PARALLAX.glass.panelContrast}%)`,
} satisfies CSSProperties;

const glassTintStyle = {
  backgroundColor: `rgba(${ABOUT_PARALLAX.glass.panelTintColor}, ${ABOUT_PARALLAX.glass.panelTintOpacity})`,
} satisfies CSSProperties;

const glassShadeStyle = {
  backgroundColor: `rgba(${ABOUT_PARALLAX.glass.panelShadeColor}, ${ABOUT_PARALLAX.glass.panelShadeOpacity})`,
} satisfies CSSProperties;

function Bio({
  children,
  delay = 0,
  delayOffset = 0,
}: {
  children: React.ReactNode;
  delay?: number;
  delayOffset?: number;
}) {
  return (
    <motion.p
      animate="visible"
      initial="hidden"
      style={{
        fontSize: about.paragraphFontSize,
        lineHeight: about.paragraphLineHeight,
        marginBottom: about.paragraphSpacing,
        fontWeight: about.paragraphFontWeight,
        color: 'var(--about-text)',
      }}
      transition={{
        duration: 0.5,
        delay: delay + delayOffset,
        ease: 'easeOut',
        opacity: { duration: 0.16, delay: delay + delayOffset },
      }}
      variants={flyUp}
    >
      {children}
    </motion.p>
  );
}

function FadeIn({
  children,
  delay = 0,
  delayOffset = 0,
}: {
  children: React.ReactNode;
  delay?: number;
  delayOffset?: number;
}) {
  return (
    <motion.div
      animate="visible"
      initial="hidden"
      transition={{
        duration: 0.5,
        delay: delay + delayOffset,
        ease: 'easeOut',
        opacity: { duration: 0.16, delay: delay + delayOffset },
      }}
      variants={flyUp}
    >
      {children}
    </motion.div>
  );
}

function getMotionRange(
  layer: AboutParallaxLayerConfig,
  property: keyof AboutParallaxLayerConfig['start'],
  shouldReduceMotion: boolean | null,
) {
  return shouldReduceMotion
    ? [layer.end[property], layer.end[property]]
    : [layer.start[property], layer.end[property]];
}

function useLayerMotion(
  layer: AboutParallaxLayerConfig,
  scrollYProgress: MotionValue<number>,
  shouldReduceMotion: boolean | null,
) {
  return {
    x: useTransform(scrollYProgress, scrollInput, getMotionRange(layer, 'x', shouldReduceMotion)),
    y: useTransform(scrollYProgress, scrollInput, getMotionRange(layer, 'y', shouldReduceMotion)),
    scale: useTransform(
      scrollYProgress,
      scrollInput,
      getMotionRange(layer, 'scale', shouldReduceMotion),
    ),
  };
}

export default function AboutPanel() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const backgroundMotion = useLayerMotion(layers.background, scrollYProgress, shouldReduceMotion);
  const midgroundMotion = useLayerMotion(layers.midground, scrollYProgress, shouldReduceMotion);
  const foregroundMotion = useLayerMotion(layers.foreground, scrollYProgress, shouldReduceMotion);
  const contentDelay = shouldReduceMotion ? 0 : ABOUT_PARALLAX.glass.contentDelaySeconds;

  return (
    <section className={styles.aboutScene}>
      <div aria-hidden="true" className={styles.parallaxStage}>
        <motion.div
          className={`${styles.parallaxLayer} ${styles.backgroundLayer}`}
          style={backgroundMotion}
        />
        <motion.div
          className={`${styles.parallaxLayer} ${styles.midgroundLayer}`}
          style={midgroundMotion}
        />
        <motion.div
          className={`${styles.parallaxLayer} ${styles.foregroundLayer}`}
          style={foregroundMotion}
        />
      </div>

      <div className={styles.contentShell}>
        <div className={styles.contentColumn}>
          <HomeReturnLink className={styles.homeLink} />
          <motion.div
            animate="visible"
            className={styles.glassPanel}
            initial="hidden"
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: 'spring',
                    stiffness: ABOUT_PARALLAX.glass.panelEntranceStiffness,
                    damping: ABOUT_PARALLAX.glass.panelEntranceDamping,
                    mass: ABOUT_PARALLAX.glass.panelEntranceMass,
                    restDelta: 0.001,
                    restSpeed: 0.001,
                  }
            }
            variants={panelFlyUp}
          >
          <div aria-hidden="true" className={styles.glassTint} style={glassTintStyle} />
          <div aria-hidden="true" className={styles.glassBlur} style={glassBlurStyle} />
          <div aria-hidden="true" className={styles.glassShade} style={glassShadeStyle} />
          <motion.div
            animate="visible"
            className={styles.glassContent}
            initial="hidden"
            transition={{ duration: 0.01, delay: contentDelay }}
            variants={contentGate}
          >
            <motion.div
              animate="visible"
              initial="hidden"
              style={{ fontSize: about.iconSize, marginBottom: about.iconMarginBottom }}
              transition={{
                duration: 0.5,
                delay: contentDelay,
                ease: 'easeOut',
                opacity: { duration: 0.16, delay: contentDelay },
              }}
              variants={flyUp}
            >
              <Image
                alt="icon"
                className={styles.stampImage}
                height={80}
                priority
                src="/stamp.png"
                style={{ width: about.iconSize, height: 'auto' }}
                width={80}
              />
            </motion.div>

            <Bio delay={0.1} delayOffset={contentDelay}>
              hi, i&apos;m Jonathan! 👋🏻
            </Bio>

            <Bio delay={0.2} delayOffset={contentDelay}>
              i&apos;m an incoming freshman at purdue university, studying data science, artifical
              intelligence, and bioinformatics.
            </Bio>

            <Bio delay={0.3} delayOffset={contentDelay}>
              i&apos;ve previously interned at walmart global tech, and have had various research
              experiences in computational biology and wet lab settings. i will be joining eli lilly in
              indianapolis during my sophomore year.
            </Bio>

            <Bio delay={0.4} delayOffset={contentDelay}>
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

            <Bio delay={0.5} delayOffset={contentDelay}>
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
              style={{
                border: 'none',
                borderTop: '1px solid rgba(47, 78, 56, 0.22)',
                margin: '40px 0',
              }}
              transition={{
                duration: 0.5,
                delay: 0.6 + contentDelay,
                ease: 'easeOut',
                opacity: { duration: 0.16, delay: 0.6 + contentDelay },
              }}
              variants={flyUp}
            />

            <FadeIn delay={0.65} delayOffset={contentDelay}>
              <div style={sectionLabelStyle}>Education</div>
              <div style={entryStyle}>
                Purdue University, B.S. DS/AI/Bioinformatics
                <span style={mutedSpanStyle}> 2026-</span>
              </div>
              <div style={entryStyle}>
                Bentonville High School
                <span style={mutedSpanStyle}> 2022-2026</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.75} delayOffset={contentDelay}>
              <div style={sectionLabelStyle}>Experience</div>
              <div style={entryStyle}>
                <span style={{ color: '#e73d3d' }}>Eli Lilly &amp; Company</span> · Indianapolis,
                IN · Incoming
                <br />
                <br />
                <span style={{ color: '#0e7743' }}>Walmart Global Tech</span> · Bentonville, AR ·
                Software Intern
                <br />
                <br />
                <span style={{ color: '#2a43a8' }}>Institute for Systems Biology // Baliga Lab </span>
                · Seattle, WA · Computational Biology Research Intern
                <br />
                <br />
                <span style={{ color: '#026d00' }}>Sun Yat-sen University // Li-Meng Feng Lab </span>
                · Guangzhou · Wet Lab Research Intern
              </div>
            </FadeIn>

            <FadeIn delay={0.85} delayOffset={contentDelay}>
              <div style={sectionLabelStyle}>Honors</div>
              <div style={entryStyle}>
                Coca-Cola Scholar Finalist (0.23% from 107,000+ applicants)
                <br />
                <br />
                Lilly Scholar at Purdue (1/70 incoming, Full Tuition Scholarship)
                <br />
                <br />
                National Merit Commended Scholar
                <br />
                <br />
                Elks MVS selection
                <br />
                <br />
                State Concert Guest Performer, All-State & All-Region Violinist, 3x Chamber
                Intensive Violinist
              </div>
            </FadeIn>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
