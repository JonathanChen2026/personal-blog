import type { Metadata } from 'next';
import HomeReturnLink from '@/components/HomeReturnLink';
import PhotosGallery from '@/components/photos/PhotosGallery';
import { getGalleryMedia } from '@/lib/gallery';
import { config } from '@/site.config';
import styles from './PhotosPage.module.css';

export const metadata: Metadata = {
  title: 'photos',
};

export default async function PhotosPage() {
  const media = await getGalleryMedia();
  return (
    <div className={styles.page}>
      <header className={styles.header} style={{
        maxWidth: config.layout.maxWidth,
        padding: `${config.layout.paddingVertical} ${config.layout.paddingHorizontal} 0`,
      }}>
        <HomeReturnLink slug="photos" />
      </header>
      <PhotosGallery media={media} />
    </div>
  );
}
