'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import styles from './PlanetNav.module.css';
import {
  getActiveDoor,
  getDoorScreenAngle,
  getFramePosition,
  getNextStopCursor,
  isRightHemisphere,
  PLANET_DOORS,
  SPRITE,
  type PlanetDoor,
  type PlanetDoorKey,
  type WalkDirection,
} from './planetNavModel';

type MotionMode = 'idle' | 'walking' | 'settling';

type SettlingMotion = {
  durationMs: number;
  endFrameCursor: number;
  rotationDistance: number;
  startFrameCursor: number;
  startRotation: number;
  startTime: number;
};

type MotionState = {
  direction: WalkDirection;
  facing: Exclude<WalkDirection, 0>;
  frameCursor: number;
  mode: MotionMode;
  rotation: number;
  settling: SettlingMotion | null;
  velocity: number;
};

type ViewState = {
  activeDoorKey: PlanetDoorKey | null;
  facing: Exclude<WalkDirection, 0>;
  frame: number;
  rotation: number;
};

const CLOCKWISE_SPIN: Exclude<WalkDirection, 0> = 1;
const MAX_ROTATION_VELOCITY = 58;
const ROTATION_ACCELERATION = 260;
const MIN_SETTLE_DURATION_MS = 70;

function createInitialMotion(): MotionState {
  return {
    direction: 0,
    facing: 1,
    frameCursor: SPRITE.idleFrame,
    mode: 'idle',
    rotation: 0,
    settling: null,
    velocity: 0,
  };
}

function getFrameFromCursor(frameCursor: number) {
  return Math.floor(((frameCursor % SPRITE.totalFrames) + SPRITE.totalFrames) % SPRITE.totalFrames);
}

function getViewState(motion: MotionState): ViewState {
  return {
    activeDoorKey: getActiveDoor(motion.rotation)?.key ?? null,
    facing: motion.facing,
    frame: getFrameFromCursor(motion.frameCursor),
    rotation: motion.rotation,
  };
}

const INITIAL_VIEW_STATE = getViewState(createInitialMotion());

function moveToward(current: number, target: number, maxDelta: number) {
  if (Math.abs(target - current) <= maxDelta) {
    return target;
  }

  return current + Math.sign(target - current) * maxDelta;
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

function getPressedFacing(keys: { left: boolean; right: boolean }, fallback: WalkDirection) {
  if (!keys.left && !keys.right) {
    return 0;
  }

  if (keys.left && keys.right) {
    return fallback || CLOCKWISE_SPIN;
  }

  return keys.right ? 1 : -1;
}

function getSpritePositionStyle(frame: number) {
  const { column, row } = getFramePosition(frame);
  const x = column === 0 ? 0 : (column / (SPRITE.columns - 1)) * 100;
  const y = row === 0 ? 0 : (row / (SPRITE.rows - 1)) * 100;

  return {
    '--sprite-x': `${x}%`,
    '--sprite-y': `${y}%`,
  } as CSSProperties;
}

function getDoorImage(door: PlanetDoor, rotation: number) {
  const screenAngle = getDoorScreenAngle(door.angle, rotation);
  return isRightHemisphere(screenAngle) ? '/door-right.png' : '/door-left.png';
}

export default function PlanetNav() {
  const router = useRouter();
  const motionRef = useRef<MotionState>(createInitialMotion());
  const keyStateRef = useRef({ left: false, right: false });
  const lastInputDirectionRef = useRef<WalkDirection>(1);
  const activePointerIdRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const [view, setView] = useState<ViewState>(INITIAL_VIEW_STATE);

  const beginWalking = useCallback((facing: Exclude<WalkDirection, 0>) => {
    const motion = motionRef.current;
    motion.direction = (facing * -1) as Exclude<WalkDirection, 0>;
    motion.facing = facing;
    motion.mode = 'walking';
    motion.settling = null;
    lastInputDirectionRef.current = facing;
  }, []);

  const settleToStopFrame = useCallback((startTime: number) => {
    const motion = motionRef.current;
    const endFrameCursor = getNextStopCursor(motion.frameCursor);
    const frameDistance = endFrameCursor - motion.frameCursor;

    motion.direction = 0;

    if (frameDistance <= 0.02) {
      motion.frameCursor = endFrameCursor;
      motion.mode = 'idle';
      motion.settling = null;
      motion.velocity = 0;
      return;
    }

    const durationMs = Math.max(MIN_SETTLE_DURATION_MS, frameDistance * SPRITE.settleFrameMs);
    const spinSign = Math.sign(motion.velocity) || CLOCKWISE_SPIN;
    const settleVelocity =
      spinSign * Math.max(Math.abs(motion.velocity), MAX_ROTATION_VELOCITY * 0.35);

    motion.mode = 'settling';
    motion.settling = {
      durationMs,
      endFrameCursor,
      rotationDistance: settleVelocity * (durationMs / 1000) * 0.5,
      startFrameCursor: motion.frameCursor,
      startRotation: motion.rotation,
      startTime,
    };
  }, []);

  const updateDirectionFromKeys = useCallback(
    (startTime: number) => {
      const facing = getPressedFacing(keyStateRef.current, lastInputDirectionRef.current);

      if (facing === 0) {
        settleToStopFrame(startTime);
        return;
      }

      beginWalking(facing);
    },
    [beginWalking, settleToStopFrame],
  );

  const navigateToDoor = useCallback(
    (door: PlanetDoor | null) => {
      if (door) {
        router.push(door.href);
      }
    },
    [router],
  );

  useEffect(() => {
    function tick(now: number) {
      const previousTick = lastTickRef.current ?? now;
      const deltaSeconds = Math.min((now - previousTick) / 1000, 0.05);
      const motion = motionRef.current;

      lastTickRef.current = now;

      if (motion.mode === 'walking') {
        const targetVelocity = motion.direction * MAX_ROTATION_VELOCITY;
        motion.velocity = moveToward(
          motion.velocity,
          targetVelocity,
          ROTATION_ACCELERATION * deltaSeconds,
        );
        motion.rotation += motion.velocity * deltaSeconds;
        motion.frameCursor += (deltaSeconds * 1000) / SPRITE.walkFrameMs;
      }

      if (motion.mode === 'settling' && motion.settling) {
        const settling = motion.settling;
        const progress = Math.min((now - settling.startTime) / settling.durationMs, 1);
        const easedProgress = easeOutCubic(progress);

        motion.rotation = settling.startRotation + settling.rotationDistance * easedProgress;
        motion.frameCursor =
          settling.startFrameCursor +
          (settling.endFrameCursor - settling.startFrameCursor) * easedProgress;

        if (progress >= 1) {
          motion.frameCursor = settling.endFrameCursor;
          motion.mode = 'idle';
          motion.settling = null;
          motion.velocity = 0;
        }
      }

      setView(getViewState(motion));
      animationFrameRef.current = window.requestAnimationFrame(tick);
    }

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();

        if (event.key === 'ArrowLeft') {
          keyStateRef.current.left = true;
          lastInputDirectionRef.current = -1;
        } else {
          keyStateRef.current.right = true;
          lastInputDirectionRef.current = 1;
        }

        updateDirectionFromKeys(performance.now());
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        navigateToDoor(getActiveDoor(motionRef.current.rotation));
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }

      event.preventDefault();

      if (event.key === 'ArrowLeft') {
        keyStateRef.current.left = false;
      } else {
        keyStateRef.current.right = false;
      }

      updateDirectionFromKeys(performance.now());
    }

    function handleBlur() {
      keyStateRef.current.left = false;
      keyStateRef.current.right = false;
      settleToStopFrame(performance.now());
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [
    navigateToDoor,
    settleToStopFrame,
    updateDirectionFromKeys,
  ]);

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (activePointerIdRef.current !== null) {
      return;
    }

    activePointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    beginWalking(event.clientX < window.innerWidth / 2 ? -1 : 1);
  }

  function handlePointerRelease(event: PointerEvent<HTMLElement>) {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    activePointerIdRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    settleToStopFrame(performance.now());
  }

  const planetStyle = { '--planet-rotation': `${view.rotation}deg` } as CSSProperties;

  return (
    <section
      aria-label="Tiny planet navigation"
      className={styles.scene}
      onPointerCancel={handlePointerRelease}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerRelease}
      style={planetStyle}
    >
      <div className={styles.stage}>
        <div aria-hidden="true" className={styles.spritePreload}>
          <span className={styles.preloadWalkRight} />
          <span className={styles.preloadWalkLeft} />
        </div>
        <div className={styles.planetLayer}>
          <div aria-hidden="true" className={styles.planetImage} />
          {PLANET_DOORS.map((door) => {
            const isActive = view.activeDoorKey === door.key;

            return (
              <div
                className={styles.doorMount}
                key={door.key}
                style={{ '--door-angle': `${door.angle}deg` } as CSSProperties}
              >
                <button
                  aria-label={`Enter ${door.label}`}
                  className={styles.door}
                  disabled={!isActive}
                  onClick={() => navigateToDoor(isActive ? door : null)}
                  onPointerDown={(event) => {
                    if (isActive) {
                      event.stopPropagation();
                    }
                  }}
                  style={
                    {
                      backgroundImage: `url(${getDoorImage(door, view.rotation)})`,
                      pointerEvents: isActive ? 'auto' : 'none',
                    } as CSSProperties
                  }
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                />
              </div>
            );
          })}
        </div>

        <div aria-hidden="true" className={styles.character}>
          <div
            className={styles.characterSpriteStack}
            style={getSpritePositionStyle(view.frame)}
          >
            <div
              className={`${styles.characterSprite} ${styles.walkRight}`}
              data-active={view.facing === 1}
            />
            <div
              className={`${styles.characterSprite} ${styles.walkLeft}`}
              data-active={view.facing === -1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
