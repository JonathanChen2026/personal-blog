'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { config } from '../site.config';

const { nav, themeToggle, layout } = config;

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) { setTheme(saved); applyTheme(saved); }
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

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
    <>
      {/* ── Outer bar — full width, border ── */}
      <div style={{
        borderBottom: menuOpen ? 'none' : '1px solid var(--border)',
        width: '100%',
      }}>
        {/* ── Inner — constrained to same max width as body text ── */}
        <div style={{
          maxWidth: layout.navMaxWidth,
          margin: '0 auto',
          padding: `${nav.paddingVertical} ${nav.paddingHorizontal}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // scrollbar-gutter prevents the layout shift when
          // a page becomes scrollable and the scrollbar appears
          scrollbarGutter: 'stable',
        }}>

          {/* ── Your name ── */}
          <Link
            href="/"
            onMouseEnter={() => setNameHovered(true)}
            onMouseLeave={() => setNameHovered(false)}
            style={{
              fontWeight: nav.nameFontWeight,
              letterSpacing: nav.nameLetterSpacing,
              fontSize: nav.nameFontSize,
              textTransform: 'uppercase',
              flexShrink: 0,
              color: nameHovered ? 'var(--muted)' : 'var(--text)',
              transition: 'color 0.2s ease',
            }}
          >
            {nav.yourName}
          </Link>

          {/* ── Desktop nav links — hidden below 600px ── */}
          <div style={{
            display: 'flex',
            gap: nav.linkGap,
            alignItems: 'center',
          }}
            className="desktop-nav"
          >
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
                    color: isActive || isHovered ? 'var(--text)' : 'var(--muted)',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Right side: theme toggle + hamburger ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <button
              onClick={cycleTheme}
              title={`Theme: ${themeLabel}`}
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
                justifyContent: 'center',
                gap: '5px',
                transition: 'color 0.15s',
                width: '80px',        // ← fixed width — never changes size
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '13px' }}>{themeIcon}</span>
              <span className="theme-label">{themeLabel}</span>
            </button>

            {/* ── Hamburger — only visible below 600px ── */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="hamburger"
              aria-label="Toggle menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'none',         // shown via CSS below
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              {/* Three lines — middle one fades out when open */}
              <span style={{
                display: 'block', width: '20px', height: '1.5px',
                background: 'var(--text)',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
              }} />
              <span style={{
                display: 'block', width: '20px', height: '1.5px',
                background: 'var(--text)',
                transition: 'opacity 0.2s ease',
                opacity: menuOpen ? 0 : 1,
              }} />
              <span style={{
                display: 'block', width: '20px', height: '1.5px',
                background: 'var(--text)',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg)',
        }}>
          <div style={{
            maxWidth: layout.maxWidth,
            margin: '0 auto',
            padding: `0 ${nav.paddingHorizontal} 20px`,
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: nav.linkFontSize,
                  letterSpacing: nav.linkLetterSpacing,
                  textTransform: 'uppercase',
                  color: pathname.startsWith(href) ? 'var(--text)' : 'var(--muted)',
                  fontWeight: pathname.startsWith(href) ? nav.linkActiveFontWeight : nav.linkFontWeight,
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Responsive CSS ── */}
      <style>{`
        /* Fix layout shift from scrollbar appearing/disappearing */
        html {
          scrollbar-gutter: stable;
        }

        /* Below 600px: hide desktop links, show hamburger */
        @media (max-width: 600px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
          .theme-label { display: none; }
        }
      `}</style>
    </>
  );
}