'use client';

import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let loaded = false;
    let visible = false;
    const syncPlayback = () => {
      const shouldPlay = loaded && visible && !document.hidden;
      if (shouldPlay) {
        video.muted = true;
        void video.play().catch(() => { /* Keep the still frame if the browser blocks playback. */ });
      } else {
        video.pause();
      }
    };
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
    return () => {
      loadObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
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
        controls={false}
        disablePictureInPicture
        tabIndex={-1}
        preload="none"
      />
    </div>
  );
}
