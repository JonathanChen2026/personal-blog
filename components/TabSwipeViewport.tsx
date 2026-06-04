'use client';

import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { config } from '../site.config';
import { TOP_LEVEL_TABS } from './top-level-tabs';
import { useTabSwipe } from './TabSwipeProvider';

type TabSwipeViewportProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
};

const swipeTransition = {
  type: 'spring' as const,
  stiffness: 390,
  damping: 36,
  mass: 0.75,
};

const { layout } = config;

function getTransitionHeight(
  heights: number[],
  visualIndex: number,
  routeIndex: number | null,
  isAnimating: boolean,
) {
  if (!isAnimating || routeIndex === null) {
    return heights[visualIndex] ?? 0;
  }

  const startIndex = Math.min(routeIndex, visualIndex);
  const endIndex = Math.max(routeIndex, visualIndex);
  let maxHeight = 0;

  for (let index = startIndex; index <= endIndex; index += 1) {
    maxHeight = Math.max(maxHeight, heights[index] ?? 0);
  }

  return maxHeight;
}

export default function TabSwipeViewport({ children, fallback }: TabSwipeViewportProps) {
  const { completePendingNavigation, isAnimating, isTopLevelRoute, routeIndex, visualIndex } =
    useTabSwipe();
  const shouldReduceMotion = useReducedMotion();
  const panels = Children.toArray(children);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [panelHeights, setPanelHeights] = useState<number[]>([]);
  const contentFrameStyle = {
    maxWidth: layout.maxWidth,
    margin: '0 auto',
    padding: `${layout.paddingVertical} ${layout.paddingHorizontal}`,
  };

  const updatePanelHeights = useCallback(() => {
    const nextHeights = TOP_LEVEL_TABS.map((_, index) => {
      return panelRefs.current[index]?.offsetHeight ?? 0;
    });

    setPanelHeights((previousHeights) => {
      const heightsAreEqual =
        previousHeights.length === nextHeights.length &&
        previousHeights.every((height, index) => height === nextHeights[index]);

      return heightsAreEqual ? previousHeights : nextHeights;
    });
  }, []);

  useEffect(() => {
    if (!isTopLevelRoute) {
      return;
    }

    const frameId = window.requestAnimationFrame(updatePanelHeights);
    const observers = TOP_LEVEL_TABS.map((_, index) => {
      const panel = panelRefs.current[index];

      if (!panel || typeof ResizeObserver === 'undefined') {
        return null;
      }

      const observer = new ResizeObserver(updatePanelHeights);
      observer.observe(panel);
      return observer;
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [isTopLevelRoute, updatePanelHeights]);

  if (!isTopLevelRoute) {
    return <div style={contentFrameStyle}>{fallback}</div>;
  }

  const activeHeight = getTransitionHeight(panelHeights, visualIndex, routeIndex, isAnimating);

  return (
    <div
      className="tab-swipe-viewport"
      data-testid="tab-swipe-viewport"
      style={{
        overflow: 'hidden',
        maxWidth: '100vw',
        width: '100vw',
        height: activeHeight ? `${activeHeight}px` : undefined,
        transition: 'height 220ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <motion.div
        animate={{ x: `${visualIndex * -100}%` }}
        data-testid="tab-swipe-track"
        initial={false}
        onAnimationComplete={completePendingNavigation}
        style={{
          alignItems: 'flex-start',
          display: 'flex',
          width: '100vw',
          willChange: 'transform',
        }}
        transition={shouldReduceMotion ? { duration: 0 } : swipeTransition}
      >
        {TOP_LEVEL_TABS.map((tab, index) => (
          <div
            aria-hidden={index !== visualIndex}
            inert={index !== visualIndex}
            key={tab.key}
            ref={(node) => {
              panelRefs.current[index] = node;
            }}
            style={{
              flex: '0 0 100vw',
              minWidth: 0,
              pointerEvents: index === visualIndex ? 'auto' : 'none',
              width: '100vw',
            }}
          >
            <div style={contentFrameStyle}>{panels[index]}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
