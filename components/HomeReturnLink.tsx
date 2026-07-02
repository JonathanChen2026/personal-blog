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
        height={23}
        priority
        src="/favicon.png"
        width={23}
      />
      <span>JONATHAN CHEN</span>
    </Link>
  );
}
