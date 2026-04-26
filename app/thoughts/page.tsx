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
      rawDate: data.date || '',
      category: data.category || 'notes',
      excerpt,
    };
  }).sort((a, b) => (a.rawDate < b.rawDate ? 1 : -1));
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
      
      <p style={{
        fontStyle: 'italic',
        color: 'var(--muted)',
        marginTop: '50px',
        marginBottom: '32px',
        fontSize: '12px',
      }}>
        grammatical accuracy not guaranteed. no ai tools used. em dashes are mine.
      </p>
    </div>
  );
}