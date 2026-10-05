'use client';

import { useState } from 'react';
import {
  ArrowUpRightIcon,
  EnvelopeIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from '@phosphor-icons/react/ssr';
import styles from './HomeSocialLinks.module.css';

const EMAIL = 'chen6111@purdue.edu';

const SOCIAL_LINKS = [
  {
    href: 'https://www.linkedin.com/in/jonathan-chen12/',
    label: 'LinkedIn',
    Icon: LinkedinLogoIcon,
  },
  {
    href: 'https://github.com/JonathanChen2026',
    label: 'GitHub',
    Icon: GithubLogoIcon,
  },
] as const;

export default function HomeSocialLinks() {
  const [copyStatus, setCopyStatus] = useState('');

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyStatus('Email copied');
    } catch {
      setCopyStatus(`Copy unavailable: ${EMAIL}`);
    }
  };

  return (
    <nav aria-label="Social links" className={styles.links}>
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <a
          aria-label={label}
          className={`${styles.link} ${styles.iconLink}`}
          href={href}
          key={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon color="#000" size={36} />
        </a>
      ))}
      <button
        aria-label="Copy email address"
        className={`${styles.link} ${styles.iconLink}`}
        data-cursor="copy-email"
        data-copied={copyStatus === 'Email copied' ? 'true' : undefined}
        onClick={copyEmail}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
        }}
        onPointerLeave={() => setCopyStatus('')}
        onBlur={() => setCopyStatus('')}
        type="button"
      >
        <EnvelopeIcon aria-hidden="true" color="#000" size={36} />
      </button>
      <span className={styles.copyStatus} role="status">{copyStatus}</span>
      <a
        aria-label="Resume"
        className={`${styles.link} ${styles.resumeLink}`}
        href="/Jonathan_Chen_Resume.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>resume</span>
        <ArrowUpRightIcon aria-hidden="true" color="#000" size={20} />
      </a>
    </nav>
  );
}
