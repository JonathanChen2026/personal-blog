'use client';

import { useState } from 'react';
import HomeScrollLock from '@/components/HomeScrollLock';
import SplashScreen from '@/components/SplashScreen';
import PlanetNav from '@/components/planet-nav/PlanetNav';

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      <HomeScrollLock />
      {/* PlanetNav always rendered underneath so it's ready when splash wipes away */}
      <PlanetNav />
      {!splashDone && (
        <SplashScreen onDone={() => setSplashDone(true)} />
      )}
    </>
  );
}
