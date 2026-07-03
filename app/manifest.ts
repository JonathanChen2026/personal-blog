import type { MetadataRoute } from 'next';
import { config } from '../site.config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: config.nav.yourName,
    short_name: config.nav.yourName,
    description: 'Essays and thoughts',
    start_url: '/',
    display: 'standalone',
    background_color: '#d6dfe7',
    theme_color: '#d6dfe7',
    orientation: 'portrait',
    icons: [
      {
        src: '/favicon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
