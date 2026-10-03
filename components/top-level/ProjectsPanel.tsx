import ProjectCard from '@/components/projects/ProjectCard';
import ProjectsGallery from '@/components/projects/ProjectsGallery';
import styles from '@/components/projects/ProjectsGallery.module.css';
import { projects } from '@/content/projects';

export default function ProjectsPanel() {
  return (
    <ProjectsGallery>
      <ul className={styles.list}>
        {projects.map((project) => (
          <li key={project.title}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </ProjectsGallery>
  );
}
