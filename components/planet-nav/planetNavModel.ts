import type { StaticImageData } from 'next/image';
import backpack from '@/public/planet-scene/backpack.webp';
import journal from '@/public/planet-scene/journal.webp';
import camera from '@/public/planet-scene/camera.webp';
import toolbox from '@/public/planet-scene/toolbox.webp';

export type PlanetDoorKey = 'about' | 'photos' | 'projects' | 'thoughts';

export type PlanetDoor = {
  key: PlanetDoorKey;
  href: string;
  label: string;
  angle: number;
  surfaceRadius: number;
  scale: number;
  /** Fraction of the planet size, applied straight down in planet space. */
  drop: number;
  icon: StaticImageData;
};

export type WalkDirection = -1 | 0 | 1;

export const PLANET_DOORS = [
  // Mount each illustrated base into the uneven planet outline at its own angle.
  { key: 'about', href: '/about', label: 'Start Here', angle: 44, surfaceRadius: 0.436, scale: 0.86, drop: 0.012, icon: backpack },
  { key: 'thoughts', href: '/thoughts', label: 'Thoughts', angle: 142, surfaceRadius: 0.416, scale: 0.94, drop: 0.014, icon: journal },
  { key: 'photos', href: '/photos', label: 'Photos', angle: 196, surfaceRadius: 0.418, scale: 0.92, drop: 0, icon: camera },
  { key: 'projects', href: '/projects', label: 'Projects', angle: 251, surfaceRadius: 0.419, scale: 1.08, drop: 0, icon: toolbox },
] as const satisfies readonly PlanetDoor[];

export const SPRITE = {
  columns: 8,
  rows: 5,
  totalFrames: 39,
  stopFrames: [11, 32],
  idleFrame: 11,
  walkFrameMs: 30,
  settleFrameMs: 36,
} as const;

export const DOOR_ACTIVATION_DEGREES = 28;

export function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function signedDistanceFromTop(angle: number) {
  const normalized = normalizeAngle(angle);
  return normalized > 180 ? normalized - 360 : normalized;
}

export function getDoorScreenAngle(doorAngle: number, planetRotation: number) {
  return normalizeAngle(doorAngle + planetRotation);
}

export function getActiveDoor(rotation: number) {
  let closestDoor: PlanetDoor | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const door of PLANET_DOORS) {
    const distance = Math.abs(signedDistanceFromTop(getDoorScreenAngle(door.angle, rotation)));

    if (distance < closestDistance) {
      closestDistance = distance;
      closestDoor = door;
    }
  }

  return closestDoor && closestDistance <= DOOR_ACTIVATION_DEGREES ? closestDoor : null;
}

export function getFramePosition(frame: number) {
  const boundedFrame = frame % SPRITE.totalFrames;

  return {
    column: boundedFrame % SPRITE.columns,
    row: Math.floor(boundedFrame / SPRITE.columns),
  };
}

export function getNextStopCursor(frameCursor: number) {
  const currentFrame = normalizeFrameCursor(frameCursor);

  if (SPRITE.stopFrames.some((stopFrame) => Math.abs(stopFrame - currentFrame) < 0.02)) {
    return frameCursor + Math.round(currentFrame) - currentFrame;
  }

  const distanceToStop = SPRITE.stopFrames.map((stopFrame) => {
    const distance = stopFrame - currentFrame;
    return distance > 0 ? distance : distance + SPRITE.totalFrames;
  });

  return frameCursor + Math.min(...distanceToStop);
}

function normalizeFrameCursor(frameCursor: number) {
  return ((frameCursor % SPRITE.totalFrames) + SPRITE.totalFrames) % SPRITE.totalFrames;
}
