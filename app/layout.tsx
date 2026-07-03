import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeProvider from '../components/ThemeProvider';
import SiteSplash from '../components/SiteSplash';
import { config } from '../site.config';

export const metadata: Metadata = {
  title: {
    default: 'jonathan chen',
    template: '%s | jonathan chen',
  },
  description: 'Essays and thoughts',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'jonathan chen',
  },
  icons: {
    icon: [{ url: '/favicon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: [{ url: '/favicon.png', type: 'image/png' }],
    apple: [{ url: '/favicon.png', sizes: '180x180', type: 'image/png' }],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#d6dfe7' },
    { media: '(prefers-color-scheme: dark)', color: '#12161a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('theme');
            if (t === 'dark')  document.documentElement.classList.add('dark');
            if (t === 'light') document.documentElement.classList.add('light');
          })();
        `}} />
      </head>
      <body style={{
        fontSize: config.body.fontSize,
        lineHeight: config.body.lineHeight,
        fontWeight: config.body.fontWeight,
      }}>
        <ThemeProvider />
        <main style={{
          maxWidth: '100%',
          width: '100%',
        }}>
          {children}
        </main>
        <SiteSplash />
      </body>
    </html>
  );
}
