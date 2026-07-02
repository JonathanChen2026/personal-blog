import type { Metadata } from 'next';
import PageFrame from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'photos',
};

export default function PhotosPage() {
  return (
    <div style={{ minHeight: '100svh', background: '#ffffff' }}>
      <PageFrame>{null}</PageFrame>
    </div>
  );
}
