'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { getTopLevelTabIndex, TOP_LEVEL_TABS, type TopLevelHref } from './top-level-tabs';

type PendingNavigation = {
  href: TopLevelHref;
  index: number;
  pushOnComplete: boolean;
};

type TabSwipeContextValue = {
  activeHref: TopLevelHref | null;
  isTopLevelRoute: boolean;
  isAnimating: boolean;
  routeIndex: number | null;
  visualIndex: number;
  navigateTopLevelTab: (href: string) => boolean;
  completePendingNavigation: () => void;
};

const TabSwipeContext = createContext<TabSwipeContextValue | null>(null);

export function TabSwipeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const routeIndex = getTopLevelTabIndex(pathname);
  const [pendingNavigation, setPendingNavigation] = useState<PendingNavigation | null>(null);

  const visualIndex = pendingNavigation?.index ?? routeIndex ?? 0;
  const isTopLevelRoute = routeIndex !== null;
  const isAnimating =
    Boolean(pendingNavigation?.pushOnComplete) &&
    routeIndex !== null &&
    pendingNavigation?.index !== routeIndex;
  const activeHref = isTopLevelRoute ? TOP_LEVEL_TABS[visualIndex].href : null;

  useEffect(() => {
    if (!pendingNavigation || pathname !== pendingNavigation.href) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPendingNavigation(null);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, pendingNavigation]);

  const navigateTopLevelTab = useCallback(
    (href: string) => {
      const targetIndex = getTopLevelTabIndex(href);

      if (targetIndex === null || routeIndex === null) {
        return false;
      }

      const targetHref = TOP_LEVEL_TABS[targetIndex].href;

      if (targetIndex === routeIndex && !pendingNavigation) {
        return true;
      }

      setPendingNavigation({
        href: targetHref,
        index: targetIndex,
        pushOnComplete: !shouldReduceMotion,
      });

      if (shouldReduceMotion) {
        router.push(targetHref);
      }

      return true;
    },
    [pendingNavigation, routeIndex, router, shouldReduceMotion],
  );

  const completePendingNavigation = useCallback(() => {
    if (!pendingNavigation?.pushOnComplete) {
      return;
    }

    setPendingNavigation({
      ...pendingNavigation,
      pushOnComplete: false,
    });
    router.push(pendingNavigation.href);
  }, [pendingNavigation, router]);

  const value = useMemo<TabSwipeContextValue>(
    () => ({
      activeHref,
      isAnimating,
      isTopLevelRoute,
      routeIndex,
      visualIndex,
      navigateTopLevelTab,
      completePendingNavigation,
    }),
    [
      activeHref,
      completePendingNavigation,
      isAnimating,
      isTopLevelRoute,
      navigateTopLevelTab,
      routeIndex,
      visualIndex,
    ],
  );

  return <TabSwipeContext.Provider value={value}>{children}</TabSwipeContext.Provider>;
}

export function useTabSwipe() {
  const context = useContext(TabSwipeContext);

  if (!context) {
    throw new Error('useTabSwipe must be used inside TabSwipeProvider');
  }

  return context;
}
