import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import { config } from '../site.config';

const { layout } = config;

export const metadata: Metadata = {
  title: config.nav.yourName,
  description: 'Essays and thoughts',
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
        <Navbar />
        <main style={{
          maxWidth: layout.maxWidth,
          margin: '0 auto',
          padding: `${layout.paddingVertical} ${layout.paddingHorizontal}`,
        }}>
          {children}
        </main>
      </body>
    </html>
  );
}