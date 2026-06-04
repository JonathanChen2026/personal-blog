import { config } from '@/site.config';
import type { ThoughtPost } from '@/lib/posts';
import PostList from '@/app/thoughts/PostList';

const { thoughts } = config;

export default function ThoughtsPanel({ posts }: { posts: ThoughtPost[] }) {
  return (
    <div>
      <h1
        style={{
          fontSize: thoughts.titleFontSize,
          fontWeight: thoughts.titleFontWeight,
          letterSpacing: thoughts.titleLetterSpacing,
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        WRITING
      </h1>
      <p
        style={{
          fontStyle: 'italic',
          color: 'var(--muted)',
          marginBottom: '32px',
          fontSize: thoughts.subtitleFontSize,
        }}
      >
        Long-form essays and shorter shower thoughts.
      </p>
      <PostList posts={posts} />

      <p
        style={{
          fontStyle: 'italic',
          color: 'var(--muted)',
          marginTop: '50px',
          marginBottom: '32px',
          fontSize: '12px',
        }}
      >
        grammatical accuracy not guaranteed. no ai tools used. em dashes are mine.
      </p>
    </div>
  );
}
