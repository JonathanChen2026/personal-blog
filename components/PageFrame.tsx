import { config } from '@/site.config';
import HomeReturnLink from './HomeReturnLink';
import styles from './PageFrame.module.css';

export default function PageFrame({
  children,
  showHomeLink = true,
}: {
  children: React.ReactNode;
  showHomeLink?: boolean;
}) {
  const { layout } = config;

  return (
    <div
      className={styles.frame}
      style={{
        maxWidth: layout.maxWidth,
        padding: `${layout.paddingVertical} ${layout.paddingHorizontal}`,
      }}
    >
      {showHomeLink && <HomeReturnLink className={styles.homeLink} />}
      {children}
    </div>
  );
}
