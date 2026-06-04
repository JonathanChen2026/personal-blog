'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
import { config } from '../site.config';
import { TOP_LEVEL_TABS, type TopLevelHref } from './top-level-tabs';
import { useTabSwipe } from './TabSwipeProvider';

const { nav, themeToggle, layout } = config;

const links = TOP_LEVEL_TABS.slice(1);

type Theme = 'light' | 'dark';

function getActiveHref(pathname: string | null): TopLevelHref | null {
  if (pathname === '/') {
    return '/';
  }

  if (pathname?.startsWith('/thoughts')) {
    return '/thoughts';
  }

  if (pathname === '/projects' || pathname === '/contact') {
    return pathname;
  }

  return null;
}

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

function getSystemTheme(mediaQuery?: MediaQueryList): Theme {
  const prefersDark = mediaQuery?.matches ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyTheme(t: Theme | null) {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');

  if (t === 'dark') root.classList.add('dark');
  if (t === 'light') root.classList.add('light');
}

export default function Navbar() {
  const pathname = usePathname();
  const { activeHref: swipeActiveHref, navigateTopLevelTab } = useTabSwipe();
  const [theme, setTheme] = useState<Theme>('light');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [nameHovered, setNameHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeHref = swipeActiveHref ?? getActiveHref(pathname);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedValue = localStorage.getItem('theme');
    const savedTheme = isTheme(savedValue) ? savedValue : null;

    if (savedValue && !savedTheme) {
      localStorage.removeItem('theme');
    }

    applyTheme(savedTheme);

    const timeoutId = window.setTimeout(() => {
      setTheme(savedTheme ?? getSystemTheme(mediaQuery));
    }, 0);

    const handleSystemThemeChange = () => {
      if (!isTheme(localStorage.getItem('theme'))) {
        setTheme(getSystemTheme(mediaQuery));
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      window.clearTimeout(timeoutId);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  function cycleTheme() {
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = isTheme(savedTheme) ? savedTheme : getSystemTheme();
    const next: Theme = currentTheme === 'dark' ? 'light' : 'dark';

    setTheme(next);
    applyTheme(next);
    localStorage.setItem('theme', next);
  }

  function handleTabClick(event: MouseEvent<HTMLAnchorElement>, href: TopLevelHref) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const handled = navigateTopLevelTab(href);

    if (handled) {
      event.preventDefault();
    }

    setMenuOpen(false);
  }

  const themeIcon  = theme === 'dark' ? '●' : '○';
  const themeLabel = theme === 'dark' ? 'Dark' : 'Light';

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
            onClick={(event) => handleTabClick(event, '/')}
            onNavigate={(event) => {
              const handled = navigateTopLevelTab('/');

              if (handled) {
                event.preventDefault();
              }

              setMenuOpen(false);
            }}
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
              const isActive = activeHref === href;
              const isHovered = hoveredLink === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={(event) => handleTabClick(event, href)}
                  onNavigate={(event) => {
                    const handled = navigateTopLevelTab(href);

                    if (handled) {
                      event.preventDefault();
                    }

                    setMenuOpen(false);
                  }}
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
                onClick={(event) => handleTabClick(event, href)}
                onNavigate={(event) => {
                  const handled = navigateTopLevelTab(href);

                  if (handled) {
                    event.preventDefault();
                  }

                  setMenuOpen(false);
                }}
                style={{
                  fontSize: nav.linkFontSize,
                  letterSpacing: nav.linkLetterSpacing,
                  textTransform: 'uppercase',
                  color: activeHref === href ? 'var(--text)' : 'var(--muted)',
                  fontWeight: activeHref === href ? nav.linkActiveFontWeight : nav.linkFontWeight,
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
