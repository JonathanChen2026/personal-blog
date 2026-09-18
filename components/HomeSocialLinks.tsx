import {
  EnvelopeIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from '@phosphor-icons/react/ssr';
import styles from './HomeSocialLinks.module.css';

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
  {
    href: 'mailto:chen6111@purdue.edu',
    label: 'Email',
    Icon: EnvelopeIcon,
  },
] as const;

export default function HomeSocialLinks() {
  return (
    <nav aria-label="Social links" className={styles.links}>
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <a
          aria-label={label}
          className={styles.link}
          href={href}
          key={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon color="#000" size={36} />
        </a>
      ))}
    </nav>
  );
}
