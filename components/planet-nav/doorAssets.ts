import { PLANET_DOORS, type PlanetDoorKey } from './planetNavModel';

export function getDoorImageUrl(doorKey: PlanetDoorKey) {
  const name = doorKey === 'about' ? 'door' : doorKey;
  return `/planet-scene/${name}-right.webp`;
}

export const ALL_DOOR_IMAGE_URLS = PLANET_DOORS.map((door) => getDoorImageUrl(door.key));
