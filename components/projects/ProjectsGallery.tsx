'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import HomeReturnLink from '@/components/HomeReturnLink';
import styles from './ProjectsGallery.module.css';

export default function ProjectsGallery({ children }: { children: ReactNode }) {
  const sceneRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const track = trackRef.current;
    if (!scene || !track) return;

    const desktop = window.matchMedia('(min-width: 769px)');
    const onWheel = (event: WheelEvent) => {
      if (!desktop.matches || event.ctrlKey) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1;
      event.preventDefault();
      track.scrollLeft += delta * unit;
    };

    scene.addEventListener('wheel', onWheel, { passive: false });
    return () => scene.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section className={styles.scene} ref={sceneRef}>
      <header className={styles.header}>
        <HomeReturnLink slug="projects" />
      </header>
      <div
        aria-label="Project gallery"
        className={styles.track}
        ref={trackRef}
        role="region"
        tabIndex={0}
      >
        {children}
      </div>
      <div aria-hidden="true" className={styles.floor} />
      <Image
        alt=""
        className={styles.character}
        height={1983}
        loading="eager"
        sizes="(max-width: 768px) 1px, 200px"
        src="/pointing.png"
        width={793}
      />
    </section>
  );
}
