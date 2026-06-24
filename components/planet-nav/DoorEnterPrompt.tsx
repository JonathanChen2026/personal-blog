'use client';

import { motion, useReducedMotion } from 'framer-motion';
import styles from './PlanetNav.module.css';

export default function DoorEnterPrompt() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={styles.doorEnter}>press [enter]</span>;
  }

  return (
    <motion.span
      animate={{ y: [0, -4, 0] }}
      className={styles.doorEnter}
      transition={{
        duration: 2.6,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      }}
    >
      press [enter]
    </motion.span>
  );
}
