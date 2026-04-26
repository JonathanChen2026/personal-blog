'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { config } from '../site.config';

const { nav, themeToggle } = config;

const links = [
  { href: '/thoughts',  label: 'THOUGHTS'  },
  { href: '/projects',  label: 'PROJECTS'  },
  { href: '/contact',   label: 'CONTACT'   },
];

type Theme = 'system' | 'light' | 'dark';

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>('system');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [nameHovered, setNameHovered] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) { setTheme(saved); applyTheme(saved); }
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    if (t === 'dark')  root.classList.add('dark');
    if (t === 'light') root.classList.add('light');
  }

  function cycleTheme() {
    const order: Theme[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    applyTheme(next);
    localStorage.setItem('theme', next);
  }

  const themeIcon  = theme === 'dark' ? '●' : theme === 'light' ? '○' : '◐';
  const themeLabel = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System';

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      padding: `${nav.paddingVertical} ${nav.paddingHorizontal}`,
      borderBottom: '1px solid var(--border)',
      position: 'relative',
    }}>

      {/* Your name */}
      <Link
        href="/"
        onMouseEnter={() => setNameHovered(true)}
        onMouseLeave={() => setNameHovered(false)}
        style={{
          fontWeight: nav.nameFontWeight,
          letterSpacing: nav.nameLetterSpacing,
          fontSize: nav.nameFontSize,
          textTransform: 'uppercase',
          marginLeft: nav.nameLeftMargin,
          flexShrink: 0,
          // smooth color transition on hover
          color: nameHovered ? 'var(--muted)' : 'var(--text)',
          transition: 'color 0.2s ease',
        }}
      >
        {nav.yourName}
      </Link>

      {/* Nav links — centered */}
      <div style={{
        position: 'absolute',
        left: nav.linkGroupOffset,
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: nav.linkGap,
        alignItems: 'center',
      }}>
        {links.map(({ href, label }) => {
          const isActive = pathname.startsWith(href);
          const isHovered = hoveredLink === href;
          return (
            <Link
              key={href}
              href={href}
              onMouseEnter={() => setHoveredLink(href)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                fontSize: nav.linkFontSize,
                letterSpacing: nav.linkLetterSpacing,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                fontWeight: isActive ? nav.linkActiveFontWeight : nav.linkFontWeight,
                // active = full text color, hovered = slightly muted, idle = muted
                color: isActive
                  ? 'var(--text)'
                  : isHovered
                  ? 'var(--text)'
                  : 'var(--muted)',
                transition: 'color 0.15s ease',
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Theme toggle */}
      <div style={{ marginLeft: 'auto' }}>
        <button
          onClick={cycleTheme}
          title={`Theme: ${themeLabel} — click to cycle`}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: themeToggle.fontSize,
            color: 'var(--muted)',
            padding: themeToggle.padding,
            borderRadius: '20px',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'color 0.15s',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '13px' }}>{themeIcon}</span>
          <span>{themeLabel}</span>
        </button>
      </div>
    </nav>
  );
}