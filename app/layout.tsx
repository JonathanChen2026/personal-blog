import type { Metadata, Viewport } from 'next';
import { Fragment_Mono, Poppins } from 'next/font/google';
import './globals.css';
import SiteCursor from '@/components/SiteCursor';
import { config } from '../site.config';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
  display: 'swap',
});

const fragmentMono = Fragment_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-fragment-mono',
  display: 'swap',
});

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
  themeColor: '#d6dfe7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${fragmentMono.variable}`}>
      <body style={{
        fontSize: config.body.fontSize,
        lineHeight: config.body.lineHeight,
        fontWeight: config.body.fontWeight,
      }}>
        <SiteCursor />
        <main>{children}</main>
      </body>
    </html>
  );
}
