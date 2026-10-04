import Image from 'next/image';
import ServerPhotoAlbum from 'react-photo-album/server';
import 'react-photo-album/masonry.css';
import type { GalleryMedia } from '@/lib/gallery';
import LoopingVideo from './LoopingVideo';
import styles from './PhotosGallery.module.css';

const imageSizes = '(max-width: 767px) calc(100vw - 64px), (max-width: 1023px) calc((84vw - 20px) / 2), (max-width: 1428px) calc((84vw - 40px) / 3), 387px';

export default function PhotosGallery({ media }: { media: GalleryMedia[] }) {
  return (
    <section className={styles.gallery} aria-label="Photos and videos">
      <ServerPhotoAlbum
        unstyled
        layout="masonry"
        photos={media}
        breakpoints={[648, 860]}
        columns={(width) => width >= 860 ? 3 : width >= 648 ? 2 : 1}
        spacing={(width) => width >= 648 ? 20 : 16}
        classNames={{ breakpoints: {
          324: styles.mobileLayout,
          648: styles.tabletLayout,
          860: styles.desktopLayout,
        } }}
        render={{ photo: (_, { photo }) => (
          <figure className={styles.item} data-gallery-item={photo.key}>
            {photo.kind === 'photo' ? (
              <Image
                className={styles.image}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes={imageSizes}
                loading="lazy"
              />
            ) : (
              <LoopingVideo src={photo.src} poster={photo.poster} width={photo.width} height={photo.height} label={photo.alt} />
            )}
          </figure>
        ) }}
      />
    </section>
  );
}
