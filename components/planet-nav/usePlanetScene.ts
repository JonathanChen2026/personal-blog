import { useEffect, useLayoutEffect, useRef } from 'react';
import { preloadDoorImages } from './doorAssets';
import { ALL_SKY_IMAGE_URLS, PARALLAX_SPEED } from './parallaxSkyConfig';
import {
  advanceMotion,
  beginWalking,
  createInitialMotion,
  getFrameFromCursor,
  settleToStopFrame,
  type MotionState,
} from './planetMotion';
import { getActiveDoor, getDoorFacing, getFramePosition, PLANET_DOORS, type PlanetDoorKey } from './planetNavModel';

type WalkDirection = -1 | 0 | 1;

function getSpriteVars(frame: number) {
  const { column, row } = getFramePosition(frame);
  const x = column === 0 ? 0 : (column / 7) * 100;
  const y = row === 0 ? 0 : (row / 4) * 100;

  return {
    x: `${x}%`,
    y: `${y}%`,
  };
}

function setDoorFacing(mount: HTMLDivElement, facing: 'left' | 'right') {
  const leftFace = mount.querySelector<HTMLElement>('[data-side="left"]');
  const rightFace = mount.querySelector<HTMLElement>('[data-side="right"]');

  if (!leftFace || !rightFace) {
    return;
  }

  leftFace.dataset.active = facing === 'left' ? 'true' : 'false';
  rightFace.dataset.active = facing === 'right' ? 'true' : 'false';
}

export function usePlanetScene(onActiveDoorChange: (doorKey: PlanetDoorKey | null) => void) {
  const motionRef = useRef<MotionState>(createInitialMotion());
  const lastTickRef = useRef<number | null>(null);
  const activeDoorRef = useRef<PlanetDoorKey | null>(null);
  const onActiveDoorChangeRef = useRef(onActiveDoorChange);
  const planetLayerRef = useRef<HTMLDivElement>(null);
  const parallaxFarRef = useRef<HTMLDivElement>(null);
  const parallaxMidRef = useRef<HTMLDivElement>(null);
  const spriteStackRef = useRef<HTMLDivElement>(null);
  const walkRightRef = useRef<HTMLDivElement>(null);
  const walkLeftRef = useRef<HTMLDivElement>(null);
  const doorMountRefs = useRef<Partial<Record<PlanetDoorKey, HTMLDivElement>>>({});

  useEffect(() => {
    onActiveDoorChangeRef.current = onActiveDoorChange;
  }, [onActiveDoorChange]);

  useEffect(() => {
    preloadDoorImages();

    for (const url of ALL_SKY_IMAGE_URLS) {
      const image = new Image();
      image.decoding = 'async';
      image.src = url;
    }
  }, []);

  useLayoutEffect(() => {
    let frameId: number;

    function paintScene() {
      const motion = motionRef.current;
      const planetLayer = planetLayerRef.current;
      const parallaxFar = parallaxFarRef.current;
      const parallaxMid = parallaxMidRef.current;
      const spriteStack = spriteStackRef.current;
      const walkRight = walkRightRef.current;
      const walkLeft = walkLeftRef.current;

      const rotation = motion.rotation;

      planetLayer?.style.setProperty('--planet-rotation', `${rotation}deg`);
      parallaxFar?.style.setProperty('--parallax-rotation', `${rotation * PARALLAX_SPEED.far}deg`);
      parallaxMid?.style.setProperty('--parallax-rotation', `${rotation * PARALLAX_SPEED.mid}deg`);

      const frame = getFrameFromCursor(motion.frameCursor);
      const spriteVars = getSpriteVars(frame);
      spriteStack?.style.setProperty('--sprite-x', spriteVars.x);
      spriteStack?.style.setProperty('--sprite-y', spriteVars.y);

      walkRight?.setAttribute('data-active', motion.facing === 1 ? 'true' : 'false');
      walkLeft?.setAttribute('data-active', motion.facing === -1 ? 'true' : 'false');

      for (const door of PLANET_DOORS) {
        const mount = doorMountRefs.current[door.key];
        if (mount) {
          setDoorFacing(mount, getDoorFacing(door, motion.rotation));
        }
      }

      const activeDoor = getActiveDoor(motion.rotation)?.key ?? null;
      if (activeDoor !== activeDoorRef.current) {
        activeDoorRef.current = activeDoor;
        onActiveDoorChangeRef.current(activeDoor);
      }
    }

    function tick(now: number) {
      advanceMotion(motionRef.current, now, lastTickRef.current);
      lastTickRef.current = now;
      paintScene();
      frameId = window.requestAnimationFrame(tick);
    }

    paintScene();
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return {
    motionRef,
    planetLayerRef,
    parallaxFarRef,
    parallaxMidRef,
    spriteStackRef,
    walkRightRef,
    walkLeftRef,
    doorMountRefs,
    beginWalking: (facing: Exclude<WalkDirection, 0>) => beginWalking(motionRef.current, facing),
    settleToStopFrame: (startTime: number) => settleToStopFrame(motionRef.current, startTime),
  };
}
