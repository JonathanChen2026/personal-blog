'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './LoopingVideo.module.css';

type LoopingVideoProps = {
  src: string;
  poster?: string;
  width: number;
  height: number;
  label: string;
};

export default function LoopingVideo({ src, poster, width, height, label }: LoopingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPlayback = useRef<boolean | undefined>(undefined);
  const updatePlayback = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let loaded = false;
    let visible = false;
    const syncPlayback = () => {
      const shouldPlay = loaded && visible && !document.hidden &&
        (userPlayback.current ?? !reducedMotion.matches);
      if (shouldPlay) {
        video.muted = true;
        void video.play().catch(() => { /* The play button remains available if autoplay is blocked. */ });
      } else {
        video.pause();
      }
    };
    updatePlayback.current = syncPlayback;
    const loadObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || !video.getClientRects().length || loaded) return;
      loaded = true;
      if (poster) video.poster = poster;
      video.src = src;
      video.preload = 'metadata';
      video.load();
      syncPlayback();
    }, { rootMargin: '300px' });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !!video.getClientRects().length;
      syncPlayback();
    }, { threshold: 0.01 });
    loadObserver.observe(video);
    visibilityObserver.observe(video);
    document.addEventListener('visibilitychange', syncPlayback);
    reducedMotion.addEventListener('change', syncPlayback);
    return () => {
      loadObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      reducedMotion.removeEventListener('change', syncPlayback);
      video.pause();
      updatePlayback.current = () => {};
    };
  }, [src, poster]);

  return (
    <div className={styles.root} style={{ aspectRatio: `${width} / ${height}` }}>
      <video
        ref={videoRef}
        className={styles.video}
        width={width}
        height={height}
        aria-label={label}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        className={styles.control}
        type="button"
        aria-label={`${playing ? 'Pause' : 'Play'} video: ${label}`}
        onClick={() => {
          userPlayback.current = !playing;
          updatePlayback.current();
        }}
      >
        <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
      </button>
    </div>
  );
}
