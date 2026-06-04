'use client';
import { useState } from 'react';
import Link from 'next/link';
import { config } from '../../site.config';
import type { ThoughtPost } from '@/lib/posts';

const { thoughts } = config;

const tagColors: Record<string, { background: string; color: string }> = {
  essay:     { background: 'var(--tag-essay)',     color: '#678cf1' },
  investing: { background: 'var(--tag-investing)', color: '#166534' },
  notes:     { background: 'var(--tag-notes)',     color: '#dc7e44' },
};

const filters = ['ALL', 'ESSAYS', 'NOTES'];

export default function PostList({ posts }: { posts: ThoughtPost[] }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const visiblePosts = posts.filter(post => {
    const matchesFilter =
      activeFilter === 'ALL' ||
      post.category.toUpperCase() === activeFilter ||
      (activeFilter === 'ESSAYS' && post.category === 'essay');
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{
          width: '100%', border: '1px solid var(--border)', background: 'transparent',
          padding: '10px 16px', marginBottom: '24px', fontSize: thoughts.filterFontSize,
          fontFamily: 'inherit', outline: 'none', color: 'inherit',
        }}
      />

      <div style={{
        display: 'flex', gap: '24px', borderBottom: '1px solid var(--border)',
        paddingBottom: '12px', marginBottom: '60px',
      }}>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              fontSize: thoughts.filterFontSize, letterSpacing: thoughts.filterLetterSpacing,
              textTransform: 'uppercase', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', padding: '0 0 4px 0',
              color: activeFilter === filter ? 'var(--text)' : 'var(--muted)',
              fontWeight: activeFilter === filter ? '600' : '400',
              borderBottom: activeFilter === filter
                ? '2px solid var(--text)' : '2px solid transparent',
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: thoughts.postGap }}>
        {visiblePosts.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>No posts found.</p>
        )}
        {visiblePosts.map((post, index) => (
          <div key={post.slug}>
            <Link href={`/thoughts/${post.slug}`}
            >
              <div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: thoughts.postTitleFontWeight, fontSize: thoughts.postTitleFontSize }}>
                      {post.title}
                    </span>
                    <span style={{
                      fontSize: thoughts.tagFontSize, padding: '2px 8px', borderRadius: '3px',
                      textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '500',
                      ...tagColors[post.category],
                    }}>
                      {post.category}
                    </span>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: thoughts.postDateFontSize, whiteSpace: 'nowrap', marginLeft: '16px' }}>
                    {post.date}
                  </span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: thoughts.postExcerptFontSize, lineHeight: '1.7' }}>
                  {post.excerpt}
                </p>
              </div>
            </Link>
            {/* Divider between posts — hidden after the last one */}
            {index < visiblePosts.length - 1 && (
              <hr style={{
                border: 'none',
                borderTop: '1px solid var(--border)',
                marginTop: thoughts.postGap,
              }} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
