import { PLANET_DOORS, type PlanetDoorKey } from './planetNavModel';

const DOOR_IMAGE_PREFIX: Record<PlanetDoorKey, string> = {
  about: 'door',
  contact: 'contact',
  photos: 'photos',
  projects: 'projects',
  thoughts: 'thoughts',
};

export function getDoorImageUrl(doorKey: PlanetDoorKey) {
  return `/planet-scene/${DOOR_IMAGE_PREFIX[doorKey]}-right.webp`;
}

export const ALL_DOOR_IMAGE_URLS = PLANET_DOORS.map((door) => getDoorImageUrl(door.key));
