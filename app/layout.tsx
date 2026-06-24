import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeProvider from '../components/ThemeProvider';
import { config } from '../site.config';

export const metadata: Metadata = {
  title: config.nav.yourName,
  description: 'Essays and thoughts',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: config.nav.yourName,
  },
  icons: {
    apple: '/planet.png',
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
          maxWidth: '100vw',
          width: '100vw',
        }}>
          {children}
        </main>
      </body>
    </html>
  );
}
