import type { Metadata } from 'next';
import Image from 'next/image';
import HomeReturnLink from '@/components/HomeReturnLink';
import PhotosGallery from '@/components/photos/PhotosGallery';
import photographer from '@/public/photographer.png';
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
      <section className={styles.intro} aria-labelledby="photography-heading">
        <Image
          className={styles.photographer}
          src={photographer}
          alt="Illustration of Jonathan holding a camera"
          sizes="(max-width: 767px) 180px, 236px"
          preload
        />
        <div className={styles.introCopy}>
          <h1 id="photography-heading" className={styles.title}>Johnnyc.photography</h1>
          <p className={styles.description}>
            lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum lorem ipsum lorem ipsum lorem ipsum
          </p>
        </div>
      </section>
      <PhotosGallery media={media} />
    </div>
  );
}
