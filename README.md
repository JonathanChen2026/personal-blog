This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Photos and looping videos

1. Add JPEG, PNG, WebP, or AVIF photos to `public/photos/`. Add browser-ready
   **H.264 MP4** clips to `public/Video/` (create the folder when needed).
   Keep clips short and compressed; the gallery does not transcode video.
2. Optionally reorder paths in `gallery-order.txt`, one path per line, relative
   to `public/`. Photos and videos share the same list:

   ```text
   photos/DSC_0049.jpg
   Video/street-loop.mp4
   photos/DJI_0333-HDR.jpg
   ```

   Listed files appear first. Unlisted files appear automatically at the end,
   alphabetically. Blank lines and `#` comments are allowed. Deleted or duplicate
   entries are ignored with a warning. Desktop masonry places successive items
   in the shortest column; mobile follows the exact list sequence.
3. Refresh `/photos` locally to preview changes. Include the new files and order
   list in the next deployment to update the live gallery.

Media dimensions are read automatically on the server. Missing folders are
allowed; invalid supported files report their filename during the build.
Filenames, folder names, and order entries are case-sensitive on deployment.

An optional `public/Video/street-loop.poster.jpg` supplies a poster for
`street-loop.mp4`. Posters do not become gallery items. Videos load near the
viewport, loop silently while visible, and pause offscreen or in hidden tabs.
Reduced-motion settings disable automatic playback; play/pause is available by
keyboard, on hover, and on touch screens.

The gallery uses React Photo Album's server component and optimized Next.js
images. Its layout and filesystem/metadata libraries add no gallery JavaScript
to the browser; only video playback needs a small client component.

Run discovery and metadata tests with `npm run test:gallery`.

## Next.js resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
