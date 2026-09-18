import HomeScrollLock from '@/components/HomeScrollLock';
import HomeSocialLinks from '@/components/HomeSocialLinks';
import PlanetNav from '@/components/planet-nav/PlanetNav';

export default function HomePage() {
  return (
    <>
      <HomeScrollLock />
      <PlanetNav />
      <HomeSocialLinks />
    </>
  );
}
