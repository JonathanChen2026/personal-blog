'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import revealStyles from '@/components/FocusReveal.module.css';
import styles from './PhotosGallery.module.css';

export default function PhotosGalleryReveal({ children }: { children: ReactNode }) {
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || !('IntersectionObserver' in window)) return;

    // The server album renders both responsive layouts. Reveal each media key once.
    const frames = new Map<string, HTMLElement[]>();
    for (const frame of gallery.querySelectorAll<HTMLElement>('[data-gallery-item]')) {
      const key = frame.dataset.galleryItem!;
      const group = frames.get(key) ?? [];
      group.push(frame);
      frames.set(key, group);
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const frame = entry.target as HTMLElement;
        for (const sibling of frames.get(frame.dataset.galleryItem!) ?? []) {
          if (!sibling.dataset.revealed) {
            sibling.dataset.revealed = 'true';
            if (sibling === frame) sibling.classList.add(revealStyles.reveal);
          }
          observer.unobserve(sibling);
        }
      }
    }, { threshold: 0.01 });

    const finishReveal = (event: AnimationEvent) => {
      const frame = event.target;
      if (frame instanceof HTMLElement && frame.hasAttribute('data-gallery-item')) {
        frame.classList.remove(revealStyles.reveal);
      }
    };
    gallery.addEventListener('animationend', finishReveal);
    gallery.dataset.scrollReveal = 'true';
    for (const group of frames.values()) {
      for (const frame of group) {
        if (!frame.dataset.revealed) observer.observe(frame);
      }
    }
    return () => {
      observer.disconnect();
      gallery.removeEventListener('animationend', finishReveal);
    };
  }, [children]);

  return <section ref={galleryRef} className={styles.gallery} aria-label="Photos and videos">{children}</section>;
}
