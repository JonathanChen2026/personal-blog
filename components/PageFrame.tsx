import { config } from '@/site.config';
import HomeReturnLink from './HomeReturnLink';
import styles from './PageFrame.module.css';

export default function PageFrame({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
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
      <HomeReturnLink className={styles.homeLink} slug={slug} />
      {children}
    </div>
  );
}
