import 'server-only';

import { access, open, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createFile, MP4BoxBuffer } from 'mp4box';
import sharp from 'sharp';

export type GalleryMedia = {
  key: string;
  src: string;
  kind: 'photo' | 'video';
  width: number;
  height: number;
  alt: string;
  poster?: string;
};

const photoExtensions = /\.(jpe?g|png|webp|avif)$/i;
const descriptions: Record<string, string> = {
  'DJI_0333-HDR.jpg': 'Winding river through green wetlands at sunset',
  'DJI_0344-HDR.jpg': 'Aerial view of a river winding through wetlands',
  'DSC_0049.jpg': 'Terraced fields descending into a mountain valley',
  'DSC_0065-2.jpg': 'A solitary figure on a rocky beach in black and white',
  'DSC_0085.jpg': 'A sign beside a green field under a cloudy sky',
  'DSC_0162.jpg': 'A person crossing a city street in evening light',
  'DSC_0188.jpg': 'Street musicians playing accordion, guitar, and double bass',
  'DSC_0202-2.jpg': 'People walking past a turquoise wall',
  'DSC_0350.jpg': 'A visitor standing in front of a wooden temple',
  'DSC_0409.jpg': 'Two people in traditional dress beside a tree-lined path',
  'DSC_0418.jpg': 'A smiling man holding a red accordion',
  'DSC_0585.jpg': 'Rows of sculpted figures in black and white',
  'DSC_0881.jpg': 'A mountain reflected in a still lake',
  'IMG_3212.jpg': 'Terraced hillsides in black and white',
  'IMG_7433.jpg': 'A pagoda rising over trees at sunset',
  'boatimage 2.jpg': 'Silhouettes of two people on a boat in warm evening light',
  'guilinicecream 2.jpg': 'Colorful ice cream cones displayed at night',
  'guilinlantern 2.jpg': 'Red lanterns hanging above a street with mountains beyond',
  'guilinmotorbike 2.jpg': 'A scooter parked on a street lined with shops',
};

async function filesIn(directory: string) {
  try {
    return (await readdir(directory, { withFileTypes: true }))
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

/** Explicit entries first; newly discovered media follow in a stable order. */
export function orderGalleryFiles(files: string[], order: string) {
  const remaining = new Set(files);
  const ordered: string[] = [];
  for (const line of order.split(/\r?\n/)) {
    const filename = line.trim();
    if (!filename || filename.startsWith('#')) continue;
    if (!remaining.delete(filename)) {
      console.warn(`[gallery] Ignoring missing or duplicate order entry: ${filename}`);
      continue;
    }
    ordered.push(filename);
  }
  return [...ordered, ...[...remaining].sort()];
}

async function videoDimensions(filename: string) {
  const file = await open(filename, 'r');
  const parser = createFile(false);
  let dimensions: { width: number; height: number } | undefined;
  let parseError: string | undefined;
  parser.onError = (message) => { parseError = message; };
  parser.onReady = (info) => {
    const track = info.videoTracks[0];
    if (!track?.video) return;
    if (!track.codec.startsWith('avc1') && !track.codec.startsWith('avc3')) {
      parseError = 'Export this clip as an H.264 MP4 for browser playback.';
      return;
    }
    const rotated = Math.abs(track.matrix[1]) > Math.abs(track.matrix[0]);
    const width = track.track_width || track.video.width;
    const height = track.track_height || track.video.height;
    dimensions = rotated ? { width: height, height: width } : { width, height };
  };
  try {
    const { size } = await file.stat();
    let offset = 0;
    // MP4Box can skip the video payload and seek straight to trailing metadata.
    while (offset < size && !dimensions && !parseError) {
      const buffer = new ArrayBuffer(Math.min(64 * 1024, size - offset));
      const { bytesRead } = await file.read(new Uint8Array(buffer), 0, buffer.byteLength, offset);
      if (!bytesRead) break;
      const next = parser.appendBuffer(MP4BoxBuffer.fromArrayBuffer(buffer.slice(0, bytesRead), offset));
      offset = next > offset ? next : offset + bytesRead;
    }
    if (parseError) throw new Error(parseError);
    if (!dimensions) throw new Error('No readable video track. Export this clip as an H.264 MP4.');
    return dimensions;
  } finally {
    await file.close();
  }
}

function publicUrl(filename: string) {
  return `/${filename.split('/').map(encodeURIComponent).join('/')}`;
}

export async function getGalleryMedia(root = process.cwd()): Promise<GalleryMedia[]> {
  const publicDirectory = path.join(root, 'public');
  const [photos, videos, order] = await Promise.all([
    filesIn(path.join(publicDirectory, 'photos')),
    filesIn(path.join(publicDirectory, 'Video')),
    readFile(path.join(root, 'gallery-order.txt'), 'utf8').catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return '';
      throw error;
    }),
  ]);
  const files = orderGalleryFiles([
    ...photos.filter((name) => photoExtensions.test(name)).map((name) => `photos/${name}`),
    ...videos.filter((name) => /\.mp4$/i.test(name)).map((name) => `Video/${name}`),
  ], order);

  return Promise.all(files.map(async (filename) => {
    try {
      const kind = filename.startsWith('Video/') ? 'video' : 'photo';
      const absolutePath = path.join(publicDirectory, filename);
      const dimensions = kind === 'photo'
        ? (await sharp(absolutePath).metadata()).autoOrient
        : await videoDimensions(absolutePath);
      const { width, height } = dimensions;
      if (!(width > 0 && height > 0)) throw new Error('Media dimensions must be positive.');
      const media: GalleryMedia = {
        key: filename,
        src: publicUrl(filename),
        kind,
        width,
        height,
        alt: descriptions[path.basename(filename)] ??
          `${kind === 'photo' ? 'Photograph' : 'Silent video'} by Jonathan Chen: ${path.parse(filename).name.replace(/[_-]/g, ' ')}`,
      };
      if (kind === 'video') {
        const poster = filename.replace(/\.mp4$/i, '.poster.jpg');
        if (await access(path.join(publicDirectory, poster)).then(() => true, () => false)) {
          media.poster = publicUrl(poster);
        }
      }
      return media;
    } catch (error) {
      throw new Error(`[gallery] Cannot read ${filename}: ${(error as Error).message}`, { cause: error });
    }
  }));
}
