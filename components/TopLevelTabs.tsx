import type { ReactNode } from 'react';
import { getPosts } from '@/lib/posts';
import ContactPanel from './top-level/ContactPanel';
import HomePanel from './top-level/HomePanel';
import ProjectsPanel from './top-level/ProjectsPanel';
import ThoughtsPanel from './top-level/ThoughtsPanel';
import TabSwipeViewport from './TabSwipeViewport';

export default function TopLevelTabs({ fallback }: { fallback: ReactNode }) {
  const posts = getPosts();

  return (
    <TabSwipeViewport fallback={fallback}>
      <HomePanel />
      <ThoughtsPanel posts={posts} />
      <ProjectsPanel />
      <ContactPanel />
    </TabSwipeViewport>
  );
}
