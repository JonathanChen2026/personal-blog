import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'about',
};

export default function AboutPage() {
  return <AboutContent />;
}
