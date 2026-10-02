import { mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const publicDirectory = new URL('../public/', import.meta.url);
const outputDirectory = new URL('planet-scene/', publicDirectory);

// Keep the original PNGs as sources. Display sizes cover at least 2x resolution.
// The character's left-facing source is a pixel-exact mirror of the right asset.
const assets = [
  { name: 'planet', width: 1536 },
  { name: 'walk-right', width: 2432, height: 2700 }, // 8 x 5 cells, each 304 x 540.
  ...['backpack', 'journal', 'camera', 'toolbox'].map((name) => ({
    name, width: 320, trim: true,
  })),
  ...['leftbutton', 'rightbutton'].map((name) => ({ name, width: 256 })),
  ...['star-one', 'star-two', 'comet', 'asteroid'].map((name) => ({ name, width: 192 })),
];

await mkdir(outputDirectory, { recursive: true });
let totalBytes = 0;
for (const { name, width, height, trim } of assets) {
  const source = new URL(`${name}.png`, publicDirectory);
  const output = new URL(`${name}.webp`, outputDirectory);
  const image = sharp(source.pathname);
  if (trim) image.trim();
  await image
    .resize(width, height)
    .webp({ lossless: true, effort: 6 })
    .toFile(output.pathname);
  totalBytes += (await stat(output)).size;
}

console.log(`Generated ${assets.length} scene assets: ${(totalBytes / 1_000_000).toFixed(2)} MB.`);
