export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  title: string;
  description: string;
  links?: ProjectLink[];
  images?: ProjectImage[];
};

/**
 * Add a project by appending an object. Put image files in `public/`
 * and point `src` at them, for example `/projects/photo.jpg`.
 *
 * {
 *   title: 'Project name',
 *   description: 'One or two sentences about what it is.',
 *   links: [
 *     { label: 'Code', href: 'https://github.com/...' },
 *     { label: 'Demo', href: 'https://...' },
 *   ],
 *   images: [
 *     { src: '/projects/photo-1.jpg', alt: 'What the photo shows' },
 *     { src: '/projects/photo-2.jpg', alt: 'What the photo shows' },
 *   ],
 * }
 */
export const projects: Project[] = [
  {
    title: 'Project title',
    description:
      'A short description of the project sits here. It can run a sentence or two and wraps under the title, before the links and photos.',
    links: [
      { label: 'Devpost', href: 'https://example.com' },
      { label: 'Demo', href: 'https://example.com' },
      { label: 'Code', href: 'https://github.com' },
    ],
    images: [
      { src: '/projects/placeholder-a.jpg', alt: 'Placeholder photo' },
      { src: '/projects/placeholder-b.jpg', alt: 'Placeholder photo' },
    ],
  },
];
