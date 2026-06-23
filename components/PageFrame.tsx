import { config } from '@/site.config';

export default function PageFrame({ children }: { children: React.ReactNode }) {
  const { layout } = config;

  return (
    <div
      style={{
        maxWidth: layout.maxWidth,
        margin: '0 auto',
        padding: `${layout.paddingVertical} ${layout.paddingHorizontal}`,
      }}
    >
      {children}
    </div>
  );
}
