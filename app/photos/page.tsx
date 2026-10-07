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
          <h1 id="photography-heading" className={styles.title}>@Johnnyc.photography</h1>
          <div className={styles.description}>
            <p className={styles.principlesLead}>A few principles</p>
            <ol className={styles.principlesList}>
              <li>
                Beyond aesthetics, what makes a photo meaningful to me is the story behind it - a
                reminder of where I was and how that moment felt.
                <br />
                Hover over any photo to read my little &ldquo;field notes.&rdquo;
              </li>
              <li>
                I also like treating gear as a challenge, not a limitation. My DSLR is almost as old
                as I am (a hand-me-down from my uncle :) and for video I use a tiny pocket camera
                with a sensor smaller than a modern iPhone&apos;s. I'm always learning more (I'll prob have a distaste for my old photos soon enough lol), but just start filming.
              </li>
            </ol>
          </div>
        </div>
      </section>
      <PhotosGallery media={media} />
    </div>
  );
}
