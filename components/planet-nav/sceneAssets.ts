import { ALL_DOOR_IMAGE_URLS } from './doorAssets';
import { ALL_SKY_IMAGE_URLS } from './parallaxSkyConfig';

export const SCENE_IMAGES = {
  planet: '/planet-scene/planet.webp',
  character: '/planet-scene/walk-right.webp',
  leftArrow: '/planet-scene/leftbutton.webp',
  rightArrow: '/planet-scene/rightbutton.webp',
} as const;

export const SCENE_IMAGE_URLS = [
  ...Object.values(SCENE_IMAGES),
  ...ALL_DOOR_IMAGE_URLS,
  ...ALL_SKY_IMAGE_URLS,
];
