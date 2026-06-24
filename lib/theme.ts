export type Theme = 'light' | 'dark';

export function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

export function getSystemTheme(mediaQuery?: MediaQueryList): Theme {
  const prefersDark =
    mediaQuery?.matches ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function applyTheme(theme: Theme | null) {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');

  if (theme === 'dark') root.classList.add('dark');
  if (theme === 'light') root.classList.add('light');
}

export function cycleTheme() {
  const savedTheme = localStorage.getItem('theme');
  const currentTheme = isTheme(savedTheme) ? savedTheme : getSystemTheme();
  const next: Theme = currentTheme === 'dark' ? 'light' : 'dark';

  applyTheme(next);
  localStorage.setItem('theme', next);
}
