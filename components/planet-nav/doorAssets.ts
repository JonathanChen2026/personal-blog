import { PLANET_DOORS, type PlanetDoorKey } from './planetNavModel';

const DOOR_IMAGE_PREFIX: Record<PlanetDoorKey, string> = {
  about: 'door',
  contact: 'contact',
  photos: 'photos',
  projects: 'projects',
  thoughts: 'thoughts',
};

export function getDoorImageUrls(doorKey: PlanetDoorKey) {
  const prefix = DOOR_IMAGE_PREFIX[doorKey];

  return {
    left: `/${prefix}-left.png`,
    right: `/${prefix}-right.png`,
  };
}

export const ALL_DOOR_IMAGE_URLS = PLANET_DOORS.flatMap((door) => {
  const urls = getDoorImageUrls(door.key);
  return [urls.left, urls.right];
});

export function preloadDoorImages() {
  for (const url of ALL_DOOR_IMAGE_URLS) {
    const image = new Image();
    image.decoding = 'async';
    image.src = url;
  }
}
