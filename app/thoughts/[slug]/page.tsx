import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import PageFrame from '@/components/PageFrame';
import { config } from '../../../site.config';

const { post } = config;

// ── MDX component overrides ───────────────────────────────
// These replace the default HTML elements rendered from markdown.
// # → h1, ## → h2, ### → h3 etc.
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 style={{
      fontSize: post.h1FontSize,
      fontWeight: post.h1FontWeight,
      lineHeight: post.headingLineHeight,
      marginTop: post.headingMarginTop,
      marginBottom: post.headingMarginBottom,
      color: 'var(--text)',
    }} {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 style={{
      fontSize: post.h2FontSize,
      fontWeight: post.h2FontWeight,
      lineHeight: post.headingLineHeight,
      marginTop: post.headingMarginTop,
      marginBottom: post.headingMarginBottom,
      color: 'var(--text)',
    }} {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 style={{
      fontSize: post.h3FontSize,
      fontWeight: post.h3FontWeight,
      lineHeight: post.headingLineHeight,
      marginTop: post.headingMarginTop,
      marginBottom: post.headingMarginBottom,
      color: 'var(--text)',
    }} {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p style={{
      fontSize: post.bodyFontSize,
      lineHeight: post.bodyLineHeight,
      marginBottom: '1.4rem',
      color: 'var(--text)',
    }} {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul style={{
      fontSize: post.bodyFontSize,
      lineHeight: post.bodyLineHeight,
      paddingLeft: '1.5rem',
      marginBottom: '1.4rem',
      color: 'var(--text)',
    }} {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol style={{
      fontSize: post.bodyFontSize,
      lineHeight: post.bodyLineHeight,
      paddingLeft: '1.5rem',
      marginBottom: '1.4rem',
      color: 'var(--text)',
    }} {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a style={{
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
      color: 'inherit',
    }} {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote style={{
      borderLeft: '2px solid var(--border)',
      paddingLeft: '1rem',
      color: 'var(--muted)',
      fontStyle: 'italic',
      margin: '1.5rem 0',
    }} {...props} />
  ),
};

// ── Tag colors ────────────────────────────────────────────
const tagColors: Record<string, { background: string; color: string }> = {
  essay:     { background: 'var(--tag-essay)',     color: '#1d4ed8' },
  investing: { background: 'var(--tag-investing)', color: '#166534' },
  notes:     { background: 'var(--tag-notes)',     color: '#92400e' },
};

const getPost = cache((slug: string) => {
  const filePath = path.join(process.cwd(), 'posts', `${slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf8');
  return matter(raw);
});

// ── Static params (tells Next.js which slugs exist) ───────
export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir);
  return files
    .filter((f: string) => f.endsWith('.md'))
    .map((f: string) => ({ slug: f.replace('.md', '') }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = getPost(slug);

  return {
    title: typeof data.title === 'string' ? data.title.toLowerCase() : 'thoughts',
  };
}

// ── Page ──────────────────────────────────────────────────
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data, content } = getPost(slug);

  return (
    <PageFrame>

      {/* Back link */}
      <Link href="/thoughts" style={{
        color: 'var(--muted)',
        fontSize: '12px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        display: 'inline-block',
        marginBottom: '40px',
      }}>
        ← Back to writing
      </Link>

      {/* Date + tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ color: 'var(--muted)', fontSize: '12px' }}>
          {data.displayDate || data.date}
        </span>
        {data.category && (
          <span style={{
            fontSize: '10px',
            padding: '2px 8px',
            borderRadius: '3px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: '500',
            ...tagColors[data.category],
          }}>
            {data.category}
          </span>
        )}
      </div>

      {/* Post title — controlled by post.titleFontSize etc in site.config.ts */}
      <h1 style={{
        fontSize: post.titleFontSize,
        fontWeight: post.titleFontWeight,
        lineHeight: post.titleLineHeight,
        marginBottom: '48px',
        color: 'var(--text)',
      }}>
        {data.title}
      </h1>

      {/* Post body — headings inside here use the components above */}
      <MDXRemote source={content} components={components} />

    </PageFrame>
  );
}
