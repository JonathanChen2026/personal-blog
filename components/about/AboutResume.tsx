import Image from 'next/image';
import styles from './AboutResume.module.css';

const sections = [
  {
    title: 'Experience',
    entries: [
      {
        name: 'Eli Lilly & Company',
        description: 'Incoming',
        metadata: 'Indianapolis, IN',
        logo: '/lilly-logo.png',
      },
      {
        name: 'Walmart Global Tech',
        description: 'Software Intern',
        metadata: 'Bentonville, AR\nSpring 2026',
        logo: '/walmart-global-tech-logo.jpg',
      },
      {
        name: 'Institute for Systems Biology',
        description: 'Computational Biology Research Intern · Baliga Lab',
        metadata: 'Seattle, WA\nSummer 2025',
        logo: '/ISB-logo.png',
      },
      {
        name: 'Sun Yat-sen University',
        description: 'Wet Lab Research Intern · Li-Meng Feng Lab',
        metadata: 'Guangzhou\nSummer 2025',
        logo: '/sun-yat-logo.png',
      },
    ],
  },
  {
    title: 'Education',
    entries: [
      {
        name: 'Purdue University',
        description: 'B.S. DS/AI/Bioinformatics',
        metadata: 'West Lafayette, IN\n2026–',
        logo: '/purdue-logo.png',
      },
      {
        name: 'Bentonville High School',
        description: '',
        metadata: '2022–2026',
        logo: '/bentonville-logo.png',
      },
    ],
  },
];

export default function AboutResume() {
  return (
    <div className={styles.resume}>
      {sections.map(({ title, entries }) => (
        <section aria-label={title} className={styles.section} key={title}>
          <h2 className={styles.heading}>{title}</h2>
          <ul className={styles.entries}>
            {entries.map(({ name, description, metadata, logo }) => (
              <li className={styles.entry} key={name}>
                <div className={styles.logo}>
                  <Image alt="" fill sizes="48px" src={logo} />
                </div>
                <div className={styles.details}>
                  <h3 className={styles.name}>{name}</h3>
                  {description && <p className={styles.description}>{description}</p>}
                </div>
                <p className={styles.metadata}>{metadata}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
