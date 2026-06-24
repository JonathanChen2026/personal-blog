import { getNextStopCursor, SPRITE, type WalkDirection } from './planetNavModel';

export type MotionMode = 'idle' | 'walking' | 'settling';

export type SettlingMotion = {
  durationMs: number;
  endFrameCursor: number;
  rotationDistance: number;
  startFrameCursor: number;
  startRotation: number;
  startTime: number;
};

export type MotionState = {
  direction: WalkDirection;
  facing: Exclude<WalkDirection, 0>;
  frameCursor: number;
  mode: MotionMode;
  rotation: number;
  settling: SettlingMotion | null;
  velocity: number;
};

export const MAX_ROTATION_VELOCITY = 58;
export const ROTATION_ACCELERATION = 260;
export const MIN_SETTLE_DURATION_MS = 70;
export const CLOCKWISE_SPIN: Exclude<WalkDirection, 0> = 1;

export function createInitialMotion(): MotionState {
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

function moveToward(current: number, target: number, maxDelta: number) {
  if (Math.abs(target - current) <= maxDelta) {
    return target;
  }

  return current + Math.sign(target - current) * maxDelta;
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

export function getFrameFromCursor(frameCursor: number) {
  return Math.floor(((frameCursor % SPRITE.totalFrames) + SPRITE.totalFrames) % SPRITE.totalFrames);
}

export function beginWalking(motion: MotionState, facing: Exclude<WalkDirection, 0>) {
  motion.direction = (facing * -1) as Exclude<WalkDirection, 0>;
  motion.facing = facing;
  motion.mode = 'walking';
  motion.settling = null;
}

export function settleToStopFrame(motion: MotionState, startTime: number) {
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
}

export function advanceMotion(motion: MotionState, now: number, lastTick: number | null) {
  const deltaSeconds = Math.min((now - (lastTick ?? now)) / 1000, 0.05);

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
}
