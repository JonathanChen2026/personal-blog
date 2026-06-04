import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type ThoughtPost = {
  slug: string;
  title: string;
  date: string;
  rawDate: string;
  category: string;
  excerpt: string;
};

export function getPosts(): ThoughtPost[] {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));

  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
      const { data, content } = matter(raw);

      const plainText = content
        .replace(/#{1,6}\s/g, '')
        .replace(/[*_`]/g, '')
        .replace(/\n+/g, ' ')
        .trim();

      const excerpt =
        plainText.length > 160 ? `${plainText.slice(0, 160).trimEnd()}...` : plainText;

      return {
        slug: filename.replace('.md', ''),
        title: data.title || 'Untitled',
        date: data.displayDate || data.date || '',
        rawDate: data.date || '',
        category: data.category || 'notes',
        excerpt,
      };
    })
    .sort((a, b) => (a.rawDate < b.rawDate ? 1 : -1));
}
