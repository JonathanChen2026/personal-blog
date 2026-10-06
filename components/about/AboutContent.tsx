'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { config } from '@/site.config';
import HomeReturnLink from '@/components/HomeReturnLink';
import revealStyles from '@/components/FocusReveal.module.css';
import AboutResume from './AboutResume';
import styles from './AboutContent.module.css';
import { ABOUT_PARALLAX, type AboutParallaxLayerConfig } from './aboutParallaxConfig';

const { about, body } = config;
const { layers, scrollInput } = ABOUT_PARALLAX;
const CONTENT_REVEAL_DELAY_SECONDS = 0.05;

const sectionLabelStyle = {
  fontSize: '12px',
  letterSpacing: '0.12em',
  color: '#888',
  textTransform: 'uppercase' as const,
  marginBottom: '14px',
  marginTop: '32px',
};

const entryStyle = {
  fontSize: about.paragraphFontSize,
  lineHeight: '1.8',
  marginBottom: '16px',
  fontWeight: body.fontWeight,
  color: 'var(--about-text)',
};

const linkStyle = {
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  color: 'inherit',
};

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
    <p
      className={revealStyles.reveal}
      style={{
        fontSize: about.paragraphFontSize,
        lineHeight: about.paragraphLineHeight,
        marginBottom: `var(--bio-paragraph-spacing, ${about.paragraphSpacing})`,
        fontWeight: body.fontWeight,
        color: 'var(--about-text)',
        animationDelay: `${delay + delayOffset}s`,
      }}
    >
      {children}
    </p>
  );
}

function FocusIn({
  children,
  delay = 0,
  delayOffset = 0,
}: {
  children: React.ReactNode;
  delay?: number;
  delayOffset?: number;
}) {
  return (
    <div
      className={revealStyles.reveal}
      style={{ animationDelay: `${delay + delayOffset}s` }}
    >
      {children}
    </div>
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

export default function AboutContent() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const backgroundMotion = useLayerMotion(layers.background, scrollYProgress, shouldReduceMotion);
  const midgroundMotion = useLayerMotion(layers.midground, scrollYProgress, shouldReduceMotion);
  const foregroundMotion = useLayerMotion(layers.foreground, scrollYProgress, shouldReduceMotion);
  const contentDelay = shouldReduceMotion ? 0 : CONTENT_REVEAL_DELAY_SECONDS;

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
          <FocusIn delayOffset={contentDelay}>
            <HomeReturnLink className={styles.homeLink} slug="about" />
          </FocusIn>
          <div className={styles.intro}>
            <div className={styles.introCopy}>
              <FocusIn delay={0.04} delayOffset={contentDelay}>
                <h1 className={styles.greeting}>Hi, I&apos;m Jonathan!</h1>
              </FocusIn>
              <Bio delay={0.08} delayOffset={contentDelay}>
                i&apos;m studying data science, artificial intelligence, and bioinformatics @ purdue
                university.
              </Bio>
              <Bio delay={0.12} delayOffset={contentDelay}>
                i&apos;ve previously interned at walmart global tech, and have had various research
                experiences in computational biology and wet lab settings. i will be interning at eli lilly in
                indianapolis during my sophomore year.
              </Bio>
            </div>
            <FocusIn delayOffset={contentDelay}>
              <div className={styles.portrait}>
                <Image
                  alt="Jonathan sitting in front of a mountain landscape"
                  className={styles.headshot}
                  height={2736}
                  preload
                  sizes="252px"
                  src="/headshot.jpg"
                  width={2052}
                />
                <Image
                  alt=""
                  className={styles.stampImage}
                  height={922}
                  sizes="88px"
                  src="/stamp.png"
                  width={922}
                />
              </div>
            </FocusIn>
          </div>

          <Bio delay={0.16} delayOffset={contentDelay}>
            i also love travel photography and drone cinematography ~ check out my work{' '}
            <Link href="/photos" style={linkStyle}>
              here
            </Link>{' '}
            and{' '}
            <a
              href="https://www.instagram.com/johnnyc.photography"
              rel="noopener noreferrer"
              style={linkStyle}
              target="_blank"
            >
              @johnnyc.photography
            </a>
          </Bio>

          <Bio delay={0.2} delayOffset={contentDelay}>
            in my free time, you can catch me: playing ALL the racket sports (ex. tennis, badminton,
            pickleball especially), larping as a V5 climber, grabbing good boba, flying drones, editing cinematic
            photos/videos, and exploring nature.
          </Bio>

          <Bio delay={0.24} delayOffset={contentDelay}>
            this page is a place for my projects, photography/videography, shower thoughts, and
            longer reflections. happy exploring and please feel free to reach out!
          </Bio>

          <hr
            className={revealStyles.reveal}
            style={{
              border: 'none',
              borderTop: '1px solid rgba(60, 60, 60, 0.22)',
              margin: '40px 0',
              animationDelay: `${0.28 + contentDelay}s`,
            }}
          />

          <FocusIn delay={0.3} delayOffset={contentDelay}>
            <AboutResume />
          </FocusIn>

          <FocusIn delay={0.34} delayOffset={contentDelay}>
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
              State Concert Guest Performer, All-State & All-Region Violinist, 3x Chamber Intensive
              Violinist
            </div>
          </FocusIn>
        </div>
      </div>
    </section>
  );
}
