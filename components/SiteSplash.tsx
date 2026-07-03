'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SplashScreen from './SplashScreen';

export default function SiteSplash() {
  const pathname = usePathname();
  const [shouldShowSplash, setShouldShowSplash] = useState(pathname === '/');

  if (!shouldShowSplash || pathname !== '/') {
    return null;
  }

  return <SplashScreen onDone={() => setShouldShowSplash(false)} />;
}
