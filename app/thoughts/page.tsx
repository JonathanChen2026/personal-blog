import PageFrame from '@/components/PageFrame';
import ThoughtsPanel from '@/components/top-level/ThoughtsPanel';
import { getPosts } from '@/lib/posts';

export default function ThoughtsPage() {
  return (
    <PageFrame>
      <ThoughtsPanel posts={getPosts()} />
    </PageFrame>
  );
}
