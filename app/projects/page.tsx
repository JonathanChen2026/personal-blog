import { config } from "@/site.config";
const { projects } = config;

export default function ProjectsPage() {
  return (
    <div>
      <h1 style={{ fontSize: projects.titleFontSize, fontWeight: projects.titleFontWeight, letterSpacing: projects.titleLetterSpacing, textTransform: 'uppercase', marginBottom: '24px' }}>
        PROJECTS
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: projects.fontSize, lineHeight: projects.lineHeight }}>Coming soon...</p>
    </div>
  );
}