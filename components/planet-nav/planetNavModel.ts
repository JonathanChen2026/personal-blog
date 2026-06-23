export type PlanetDoorKey = 'about' | 'thoughts' | 'projects' | 'contact';

export type PlanetDoor = {
  key: PlanetDoorKey;
  href: string;
  label: string;
  angle: number;
};

export type WalkDirection = -1 | 0 | 1;

export const PLANET_DOORS = [
  { key: 'about', href: '/about', label: 'About', angle: 44 },
  { key: 'thoughts', href: '/thoughts', label: 'Thoughts', angle: 142 },
  { key: 'projects', href: '/projects', label: 'Projects', angle: 251 },
  { key: 'contact', href: '/contact', label: 'Contact', angle: 304 },
] as const satisfies readonly PlanetDoor[];

export const SPRITE = {
  frameWidth: 608,
  frameHeight: 1080,
  columns: 8,
  rows: 5,
  totalFrames: 39,
  stopFrames: [11, 32],
  idleFrame: 11,
  walkFrameMs: 30,
  settleFrameMs: 36,
} as const;

export const DOOR_ACTIVATION_DEGREES = 13;

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

export function isRightHemisphere(angle: number) {
  const normalized = normalizeAngle(angle);
  return normalized > 0 && normalized < 180;
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
