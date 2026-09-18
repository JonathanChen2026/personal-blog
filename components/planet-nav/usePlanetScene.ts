import { useCallback, useLayoutEffect, useRef } from 'react';
import { PARALLAX_SPEED } from './parallaxSkyConfig';
import {
  advanceMotion,
  beginWalking,
  createInitialMotion,
  getFrameFromCursor,
  settleToStopFrame,
  type MotionState,
} from './planetMotion';
import {
  getActiveDoor,
  getDoorFacing,
  getFramePosition,
  PLANET_DOORS,
  SPRITE,
  type PlanetDoorKey,
  type WalkDirection,
} from './planetNavModel';

export function usePlanetScene(
  isReady: boolean,
  onActiveDoorChange: (doorKey: PlanetDoorKey | null) => void,
) {
  const motionRef = useRef<MotionState>(createInitialMotion());
  const planetLayerRef = useRef<HTMLDivElement>(null);
  const parallaxFarRef = useRef<HTMLDivElement>(null);
  const parallaxMidRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const doorMountRefs = useRef<Partial<Record<PlanetDoorKey, HTMLDivElement>>>({});

  useLayoutEffect(() => {
    if (!isReady) return;

    let frameId: number;
    let lastTick: number | null = null;
    let paintedRotation: number | undefined;
    let paintedFrame = -1;
    let paintedFacing = 0;
    let activeDoorKey: PlanetDoorKey | null = null;
    const planetLayer = planetLayerRef.current;
    const parallaxFar = parallaxFarRef.current;
    const parallaxMid = parallaxMidRef.current;
    const sprite = spriteRef.current;

    function paintScene() {
      const motion = motionRef.current;
      const rotation = motion.rotation;
      if (rotation !== paintedRotation) {
        // Write transforms directly; inherited CSS variables invalidate descendants.
        if (planetLayer) planetLayer.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        if (parallaxFar) parallaxFar.style.transform = `rotate(${rotation * PARALLAX_SPEED.far}deg)`;
        if (parallaxMid) parallaxMid.style.transform = `rotate(${rotation * PARALLAX_SPEED.mid}deg)`;

        for (const door of PLANET_DOORS) {
          const mount = doorMountRefs.current[door.key];
          const facing = getDoorFacing(door, rotation);
          if (mount && mount.dataset.facing !== facing) mount.dataset.facing = facing;
        }

        const activeDoor = getActiveDoor(rotation)?.key ?? null;
        if (activeDoor !== activeDoorKey) {
          activeDoorKey = activeDoor;
          onActiveDoorChange(activeDoor);
        }
        paintedRotation = rotation;
      }

      const frame = getFrameFromCursor(motion.frameCursor);
      if (sprite && frame !== paintedFrame) {
        const { column, row } = getFramePosition(frame);
        sprite.style.backgroundPosition = `${(column / (SPRITE.columns - 1)) * 100}% ${(row / (SPRITE.rows - 1)) * 100}%`;
        paintedFrame = frame;
      }

      if (sprite && motion.facing !== paintedFacing) {
        sprite.style.transform = `scaleX(${motion.facing})`;
        paintedFacing = motion.facing;
      }
    }

    function tick(now: number) {
      advanceMotion(motionRef.current, now, lastTick);
      lastTick = now;
      paintScene();
      frameId = window.requestAnimationFrame(tick);
    }

    paintScene();
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isReady, onActiveDoorChange]);

  const startWalking = useCallback((facing: Exclude<WalkDirection, 0>) => {
    beginWalking(motionRef.current, facing);
  }, []);

  const stopWalking = useCallback((startTime: number) => {
    settleToStopFrame(motionRef.current, startTime);
  }, []);

  return {
    motionRef,
    planetLayerRef,
    parallaxFarRef,
    parallaxMidRef,
    spriteRef,
    doorMountRefs,
    beginWalking: startWalking,
    settleToStopFrame: stopWalking,
  };
}
