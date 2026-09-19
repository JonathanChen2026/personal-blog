import Image from 'next/image';
import Link from 'next/link';
import styles from './HomeReturnLink.module.css';

type HomeReturnLinkProps = {
  className?: string;
  slug: string;
};

export default function HomeReturnLink({ className, slug }: HomeReturnLinkProps) {
  const classNames = className ? `${styles.root} ${className}` : styles.root;

  return (
    <div className={classNames}>
      <Link aria-label="Return to home" className={styles.link} href="/">
        <Image
          alt=""
          className={styles.icon}
          height={180}
          priority
          src="/favicon.png"
          unoptimized
          width={180}
        />
        <span>jonathan chen</span>
      </Link>
      <span className={styles.slug}>/ {slug}</span>
    </div>
  );
}
