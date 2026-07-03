import type { Metadata } from 'next';
import AboutPanel from '@/components/about/AboutPanel';

export const metadata: Metadata = {
  title: 'about',
};

export default function AboutPage() {
  return <AboutPanel />;
}
