import Image from 'next/image';
import type { Project, ProjectLink } from '@/content/projects';
import styles from './ProjectCard.module.css';

function ProjectLinkItem({ link }: { link: ProjectLink }) {
  const external = link.href.startsWith('http');

  return (
    <a
      className={styles.link}
      href={link.href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {link.label}
    </a>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  const links = project.links ?? [];
  const images = project.images ?? [];

  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{project.title}</h2>
      <p className={styles.description}>{project.description}</p>
      {links.length > 0 && (
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={`${link.label}-${link.href}`}>
              <ProjectLinkItem link={link} />
            </li>
          ))}
        </ul>
      )}
      {images.length > 0 && (
        <div className={styles.images}>
          {images.map((image) => (
            <div className={styles.imageFrame} key={image.src}>
              <Image
                alt={image.alt}
                className={styles.image}
                fill
                sizes="(max-width: 640px) 100vw, 360px"
                src={image.src}
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
