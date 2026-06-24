'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

const LINE1 = "hi, i'm jonathan.";
const LINE2 = 'welcome to my little world :)';
const CHAR_INTERVAL_MS = 55;

type Phase =
  | 'initial-blink'
  | 'typing-line1'
  | 'pause-line1'
  | 'typing-line2'
  | 'pause-line2'
  | 'wiping';

const PAUSE_STEPS: Partial<Record<Phase, { ms: number; next: Phase }>> = {
  'initial-blink': { ms: 600, next: 'typing-line1' },
  'pause-line1':   { ms: 300, next: 'typing-line2' },
  'pause-line2':   { ms: 700, next: 'wiping'       },
};

function useTypewriterSequence(skip: boolean) {
  const [phase, setPhase] = useState<Phase>('initial-blink');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');

  useEffect(() => {
    if (skip) {
      setLine1(LINE1);
      setLine2(LINE2);
      setPhase('wiping');
      return;
    }

    const pause = PAUSE_STEPS[phase];
    if (pause) {
      const id = setTimeout(() => setPhase(pause.next), pause.ms);
      return () => clearTimeout(id);
    }

    if (phase === 'typing-line1' || phase === 'typing-line2') {
      const target = phase === 'typing-line1' ? LINE1 : LINE2;
      const setter = phase === 'typing-line1' ? setLine1 : setLine2;
      const next: Phase = phase === 'typing-line1' ? 'pause-line1' : 'pause-line2';

      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setter(target.slice(0, i));
        if (i >= target.length) {
          clearInterval(id);
          setPhase(next);
        }
      }, CHAR_INTERVAL_MS);
      return () => clearInterval(id);
    }
  }, [phase, skip]);

  // null = cursor hidden (during wipe); 1 or 2 = which line shows the cursor
  const cursorLine: 1 | 2 | null =
    phase === 'wiping' ? null
    : phase === 'typing-line2' || phase === 'pause-line2' ? 2
    : 1;

  return { line1, line2, cursorLine };
}

const WIPE_TRANSITION = {
  duration: 0.55,
  ease: [0.4, 0, 0.2, 1] as const,
};

const WIPE_VARIANTS = {
  visible: { y: '0%' },
  hidden:  { y: '-100%', transition: WIPE_TRANSITION },
};

type SplashScreenProps = { onDone: () => void };

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const skip = useReducedMotion() ?? false;
  const { line1, line2, cursorLine } = useTypewriterSequence(skip);

  // Derive animate target from cursorLine: once it goes null the wipe has fired
  const isWiping = cursorLine === null;

  return (
    <motion.div
      animate={isWiping ? 'hidden' : 'visible'}
      className={styles.overlay}
      initial="visible"
      variants={skip ? undefined : WIPE_VARIANTS}
      onAnimationComplete={(def) => {
        if (def === 'hidden') onDone();
      }}
    >
      <div className={styles.content}>
        {([
          { text: line1, line: 1 as const },
          { text: line2, line: 2 as const },
        ]).map(({ text, line }) => (
          <span className={styles.line} key={line}>
            <span className={styles.text}>
              {text}
              {cursorLine === line && <span className={styles.cursor} />}
            </span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}
