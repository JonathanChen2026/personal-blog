import { mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const publicDirectory = new URL('../public/', import.meta.url);
const outputDirectory = new URL('planet-scene/', publicDirectory);

// Keep the original PNGs as sources. Display sizes cover at least 2x resolution.
// Every left-facing source is a pixel-exact mirror; CSS uses the right asset twice.
const assets = [
  { name: 'planet', width: 1536 },
  { name: 'walk-right', width: 2432, height: 2700 }, // 8 x 5 cells, each 304 x 540.
  ...['door', 'thoughts', 'photos', 'projects', 'contact'].map((name) => ({
    name: `${name}-right`, width: 512,
  })),
  ...['leftbutton', 'rightbutton'].map((name) => ({ name, width: 256 })),
  ...['star-one', 'star-two', 'comet', 'asteroid'].map((name) => ({ name, width: 192 })),
];

await mkdir(outputDirectory, { recursive: true });
let totalBytes = 0;
for (const { name, width, height } of assets) {
  const source = new URL(`${name}.png`, publicDirectory);
  const output = new URL(`${name}.webp`, outputDirectory);
  await sharp(source.pathname)
    .resize(width, height)
    .webp({ lossless: true, effort: 6 })
    .toFile(output.pathname);
  totalBytes += (await stat(output)).size;
}

console.log(`Generated ${assets.length} scene assets: ${(totalBytes / 1_000_000).toFixed(2)} MB.`);
