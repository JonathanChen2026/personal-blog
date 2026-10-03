import type { Metadata } from 'next';
import ProjectsPanel from '@/components/top-level/ProjectsPanel';

export const metadata: Metadata = {
  title: 'projects',
};

export default function ProjectsPage() {
  return <ProjectsPanel />;
}
