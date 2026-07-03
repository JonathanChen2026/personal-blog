import type { Metadata } from 'next';
import PageFrame from '@/components/PageFrame';
import ContactPanel from '@/components/top-level/ContactPanel';

export const metadata: Metadata = {
  title: 'contact',
};

export default function ContactPage() {
  return (
    <PageFrame>
      <ContactPanel />
    </PageFrame>
  );
}
