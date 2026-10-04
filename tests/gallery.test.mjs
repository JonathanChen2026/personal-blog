import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import sharp from 'sharp';
import { getGalleryMedia, orderGalleryFiles } from '../lib/gallery.ts';

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'gallery-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'public/photos'), { recursive: true });
  await mkdir(path.join(root, 'public/Video'), { recursive: true });
  return root;
}

async function photo(root, name, width = 90, height = 60, orientation = 1) {
  await sharp({ create: { width, height, channels: 3, background: 'navy' } })
    .withMetadata({ orientation }).jpeg().toFile(path.join(root, 'public/photos', name));
}

test('mixed order retains explicit entries and appends new files deterministically', (t) => {
  const warning = t.mock.method(console, 'warn', () => {});
  assert.deepEqual(orderGalleryFiles(
    ['photos/b.jpg', 'Video/a.mp4', 'photos/new.jpg', 'photos/a.jpg'],
    '# comment\n photos/b.jpg \r\nVideo/a.mp4\nphotos/deleted.jpg\nphotos/b.jpg\n',
  ), ['photos/b.jpg', 'Video/a.mp4', 'photos/a.jpg', 'photos/new.jpg']);
  assert.equal(warning.mock.callCount(), 2);
});

test('empty and missing folders produce an empty gallery', async (t) => {
  const root = await fixture(t);
  assert.deepEqual(await getGalleryMedia(root), []);
  await rm(path.join(root, 'public'), { recursive: true });
  assert.deepEqual(await getGalleryMedia(root), []);
});

test('discovers additions and deletions, escapes URLs, and applies EXIF orientation', async (t) => {
  const root = await fixture(t);
  await photo(root, 'landscape #1.jpg');
  await photo(root, 'portrait.jpg', 90, 60, 6);
  await writeFile(path.join(root, 'public/photos/notes.txt'), 'ignored');
  await writeFile(path.join(root, 'gallery-order.txt'), 'photos/portrait.jpg\n');
  const media = await getGalleryMedia(root);
  assert.deepEqual(media.map(({ width, height }) => [width, height]), [[60, 90], [90, 60]]);
  assert.equal(media[1].src, '/photos/landscape%20%231.jpg');
  await photo(root, 'new.jpg');
  assert.equal((await getGalleryMedia(root)).length, 3);
  await rm(path.join(root, 'public/photos/new.jpg'));
  assert.equal((await getGalleryMedia(root)).length, 2);
});

test('reads MP4 dimensions, rotation, and optional posters without displaying posters', async (t) => {
  const root = await fixture(t);
  for (const name of ['landscape', 'rotated']) {
    await copyFile(new URL(`./fixtures/gallery-${name}.mp4`, import.meta.url), path.join(root, `public/Video/${name}.mp4`));
  }
  await sharp({ create: { width: 160, height: 90, channels: 3, background: 'navy' } })
    .jpeg().toFile(path.join(root, 'public/Video/landscape.poster.jpg'));
  const media = await getGalleryMedia(root);
  assert.equal(media.length, 2);
  assert.deepEqual(media.map(({ kind, width, height }) => [kind, width, height]), [
    ['video', 160, 90], ['video', 90, 160],
  ]);
  assert.equal(media[0].poster, '/Video/landscape.poster.jpg');
  assert.equal(media[1].poster, undefined);
});

test('discovers every supported photo format and excludes subfolders', async (t) => {
  const root = await fixture(t);
  for (const extension of ['jpeg', 'png', 'webp', 'avif']) {
    await sharp({ create: { width: 60, height: 90, channels: 3, background: 'navy' } })
      .toFile(path.join(root, `public/photos/portrait.${extension}`));
  }
  await mkdir(path.join(root, 'public/photos/ignored.jpg'));
  const media = await getGalleryMedia(root);
  assert.equal(media.length, 4);
  assert.ok(media.every((item) => item.width === 60 && item.height === 90));
});

test('invalid photo and video metadata report the failing filename', async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, 'public/photos/broken.jpg'), 'not an image');
  await assert.rejects(getGalleryMedia(root), /Cannot read photos\/broken.jpg/);
  await rm(path.join(root, 'public/photos/broken.jpg'));
  await writeFile(path.join(root, 'public/Video/broken.mp4'), 'not a video');
  await assert.rejects(getGalleryMedia(root), /Cannot read Video\/broken.mp4/);
});
