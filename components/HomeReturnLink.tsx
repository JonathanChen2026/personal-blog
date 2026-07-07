import Image from 'next/image';
import Link from 'next/link';
import styles from './HomeReturnLink.module.css';

type HomeReturnLinkProps = {
  className?: string;
};

export default function HomeReturnLink({ className }: HomeReturnLinkProps) {
  const classNames = className ? `${styles.link} ${className}` : styles.link;

  return (
    <Link aria-label="Return to home" className={classNames} href="/">
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
  );
}
