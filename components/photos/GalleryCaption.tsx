import styles from './PhotosGallery.module.css';

type GalleryCaptionProps = {
  location: string;
  story: string;
};

export default function GalleryCaption({ location, story }: GalleryCaptionProps) {
  return (
    <figcaption className={styles.caption}>
      <p className={styles.captionLocation}>{location}</p>
      <p className={styles.captionStory}>{story}</p>
    </figcaption>
  );
}
