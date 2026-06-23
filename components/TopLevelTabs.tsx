import type { ReactNode } from 'react';
import { getPosts } from '@/lib/posts';
import ContactPanel from './top-level/ContactPanel';
import AboutPanel from './about/AboutPanel';
import PlanetNav from './planet-nav/PlanetNav';
import ProjectsPanel from './top-level/ProjectsPanel';
import ThoughtsPanel from './top-level/ThoughtsPanel';
import TabSwipeViewport from './TabSwipeViewport';

export default function TopLevelTabs({ fallback }: { fallback: ReactNode }) {
  const posts = getPosts();

  return (
    <TabSwipeViewport fallback={fallback}>
      <PlanetNav />
      <AboutPanel />
      <ThoughtsPanel posts={posts} />
      <ProjectsPanel />
      <ContactPanel />
    </TabSwipeViewport>
  );
}
