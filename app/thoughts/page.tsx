import ThoughtsPanel from '@/components/top-level/ThoughtsPanel';
import { getPosts } from '@/lib/posts';

export default function ThoughtsPage() {
  return <ThoughtsPanel posts={getPosts()} />;
}
