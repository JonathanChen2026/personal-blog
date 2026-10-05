'use client';

import { useEffect, useRef } from 'react';

export default function SiteCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const place = (x: number, y: number) => {
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      dot.classList.add('is-visible');
    };

    const onPointerMove = (event: PointerEvent) => {
      place(event.clientX, event.clientY);
    };

    const hide = () => {
      dot.classList.remove('is-visible');
    };

    window.addEventListener('pointermove', onPointerMove);
    document.addEventListener('mouseleave', hide);

    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', hide);
    };
  }, []);

  return (
    <div aria-hidden="true" className="site-cursor" ref={dotRef}>
      <div className="site-cursor-dot">
        <span className="site-cursor-label">
          <span className="site-cursor-copy">COPY EMAIL</span>
          <span className="site-cursor-copied">EMAIL COPIED!</span>
        </span>
      </div>
    </div>
  );
}
