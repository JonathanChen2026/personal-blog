'use client';

import { useEffect } from 'react';
import { applyTheme, getSystemTheme, isTheme } from '../lib/theme';

export { cycleTheme } from '../lib/theme';

export default function ThemeProvider() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedValue = localStorage.getItem('theme');
    const savedTheme = isTheme(savedValue) ? savedValue : null;

    if (savedValue && !savedTheme) {
      localStorage.removeItem('theme');
    }

    applyTheme(savedTheme);

    const handleSystemThemeChange = () => {
      if (!isTheme(localStorage.getItem('theme'))) {
        applyTheme(getSystemTheme(mediaQuery));
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return null;
}
