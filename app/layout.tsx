import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import { TabSwipeProvider } from '../components/TabSwipeProvider';
import TopLevelTabs from '../components/TopLevelTabs';
import { config } from '../site.config';

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
        <TabSwipeProvider>
          <Navbar />
          <main style={{
            maxWidth: '100vw',
            width: '100vw',
          }}>
            <TopLevelTabs fallback={children} />
          </main>
        </TabSwipeProvider>
      </body>
    </html>
  );
}
