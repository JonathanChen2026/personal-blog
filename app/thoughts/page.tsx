import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { config } from '../../site.config';
import PostList from './PostList';

const { thoughts } = config;

function getPosts() {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

  return files.map(filename => {
    const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
    const { data, content } = matter(raw);

    // Strip markdown symbols then truncate to 160 chars with ...
    const plainText = content
      .replace(/#{1,6}\s/g, '')
      .replace(/[*_`]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    const excerpt = plainText.length > 160
      ? plainText.slice(0, 160).trimEnd() + '...'
      : plainText;

    return {
      slug: filename.replace('.md', ''),
      title: data.title || 'Untitled',
      date: data.displayDate || data.date || '',
      category: data.category || 'notes',
      excerpt,
    };
  });
}

export default function ThoughtsPage() {
  const posts = getPosts();

  return (
    <div>
      <h1 style={{
        fontSize: thoughts.titleFontSize,
        fontWeight: thoughts.titleFontWeight,
        letterSpacing: thoughts.titleLetterSpacing,
        textTransform: 'uppercase',
        marginBottom: '12px',
      }}>
        WRITING
      </h1>
      <p style={{
        fontStyle: 'italic',
        color: 'var(--muted)',
        marginBottom: '32px',
        fontSize: thoughts.subtitleFontSize,
      }}>
        Long-form essays and shorter shower thoughts.
      </p>
      <PostList posts={posts} />
    </div>
  );
}