import ProjectCard from '@/components/projects/ProjectCard';
import styles from '@/components/projects/ProjectCard.module.css';
import { projects as projectEntries } from '@/content/projects';
import { config } from '@/site.config';

const { projects } = config;

export default function ProjectsPanel() {
  return (
    <div>
      <h1
        style={{
          fontSize: projects.titleFontSize,
          fontWeight: projects.titleFontWeight,
          letterSpacing: projects.titleLetterSpacing,
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}
      >
        PROJECTS
      </h1>
      {projectEntries.length > 0 && (
        <ul className={styles.list}>
          {projectEntries.map((project) => (
            <li key={project.title}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
