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
import ParallaxSkyLayer from './ParallaxSkyLayer';
import PlanetDoorMount from './PlanetDoor';
import styles from './PlanetNav.module.css';
import { FAR_SKY_ELEMENTS, MID_SKY_ELEMENTS } from './parallaxSkyConfig';
import {
  DOOR_CTA_ABOVE_DOOR_PX,
  DOOR_CTA_SLOT_HEIGHT_PX,
  DOOR_LABEL_ABOVE_CTA_PX,
  getActiveDoor,
  PLANET_DOORS,
  type PlanetDoor,
  type PlanetDoorKey,
  type WalkDirection,
} from './planetNavModel';
import { CLOCKWISE_SPIN } from './planetMotion';
import { usePlanetScene } from './usePlanetScene';

const LEFT_KEYS = new Set(['ArrowLeft', 'a', 'A']);
const RIGHT_KEYS = new Set(['ArrowRight', 'd', 'D']);

const ROTATION_CONTROLS = [
  { key: 'left', label: 'Rotate left', facing: -1, image: '/leftbutton.png' },
  { key: 'right', label: 'Rotate right', facing: 1, image: '/rightbutton.png' },
] as const;

type RotationControl = (typeof ROTATION_CONTROLS)[number];
type RotationControlKey = RotationControl['key'];

function isWalkKey(key: string) {
  return LEFT_KEYS.has(key) || RIGHT_KEYS.has(key);
}

function isArrowWalkKey(key: string) {
  return key === 'ArrowLeft' || key === 'ArrowRight';
}

function isLeftKey(key: string) {
  return LEFT_KEYS.has(key);
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

export default function PlanetNav() {
  const router = useRouter();
  const keyStateRef = useRef({ left: false, right: false });
  const lastInputDirectionRef = useRef<WalkDirection>(1);
  const activePointerIdRef = useRef<number | null>(null);
  const [activeDoorKey, setActiveDoorKey] = useState<PlanetDoorKey | null>(null);
  const [pressedControlKey, setPressedControlKey] = useState<RotationControlKey | null>(null);
  const [hasUsedArrowKeys, setHasUsedArrowKeys] = useState(false);

  const handleActiveDoorChange = useCallback((doorKey: PlanetDoorKey | null) => {
    setActiveDoorKey(doorKey);
  }, []);

  const {
    motionRef,
    planetLayerRef,
    parallaxFarRef,
    parallaxMidRef,
    spriteStackRef,
    walkRightRef,
    walkLeftRef,
    doorMountRefs,
    beginWalking,
    settleToStopFrame,
  } = usePlanetScene(handleActiveDoorChange);

  const updateDirectionFromKeys = useCallback(
    (startTime: number) => {
      const facing = getPressedFacing(keyStateRef.current, lastInputDirectionRef.current);

      if (facing === 0) {
        settleToStopFrame(startTime);
        return;
      }

      beginWalking(facing);
      lastInputDirectionRef.current = facing;
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
    function handleKeyDown(event: KeyboardEvent) {
      if (isWalkKey(event.key)) {
        event.preventDefault();

        if (isArrowWalkKey(event.key)) {
          setHasUsedArrowKeys(true);
        }

        if (isLeftKey(event.key)) {
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
      if (!isWalkKey(event.key)) {
        return;
      }

      event.preventDefault();

      if (isLeftKey(event.key)) {
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
  }, [motionRef, navigateToDoor, settleToStopFrame, updateDirectionFromKeys]);

  function handleControlPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    control: RotationControl,
  ) {
    if (activePointerIdRef.current !== null) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    activePointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setPressedControlKey(control.key);
    lastInputDirectionRef.current = control.facing;
    beginWalking(control.facing);
  }

  function handleControlPointerRelease(event: PointerEvent<HTMLButtonElement>) {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    activePointerIdRef.current = null;
    setPressedControlKey(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    settleToStopFrame(performance.now());
  }

  const sceneStyle = {
    '--door-cta-above-door': `${DOOR_CTA_ABOVE_DOOR_PX}px`,
    '--door-cta-slot-height': `${DOOR_CTA_SLOT_HEIGHT_PX}px`,
    '--door-label-above-cta': `${DOOR_LABEL_ABOVE_CTA_PX}px`,
  } as CSSProperties;

  return (
    <section
      aria-label="Tiny planet navigation"
      className={styles.scene}
      onContextMenu={(event) => event.preventDefault()}
      style={sceneStyle}
    >
      <div className={styles.stage}>
        <div aria-hidden="true" className={styles.assetPreload} />
        <div className={styles.rotationHub}>
          <ParallaxSkyLayer
            elements={FAR_SKY_ELEMENTS}
            layer="far"
            layerRef={(node) => {
              parallaxFarRef.current = node;
            }}
          />
          <ParallaxSkyLayer
            elements={MID_SKY_ELEMENTS}
            layer="mid"
            layerRef={(node) => {
              parallaxMidRef.current = node;
            }}
          />
          <div className={styles.planetLayer} ref={planetLayerRef}>
            <div aria-hidden="true" className={styles.planetImage} />
            {PLANET_DOORS.map((door) => {
              const isActive = activeDoorKey === door.key;

              return (
                <PlanetDoorMount
                  door={door}
                  doorRef={(node) => {
                    doorMountRefs.current[door.key] = node ?? undefined;
                  }}
                  isActive={isActive}
                  key={door.key}
                  onNavigate={() => navigateToDoor(isActive ? door : null)}
                />
              );
            })}
          </div>

          <div aria-hidden="true" className={styles.character}>
            <div className={styles.characterSpriteStack} ref={spriteStackRef}>
              <div
                className={`${styles.characterSprite} ${styles.walkRight}`}
                data-active="true"
                ref={walkRightRef}
              />
              <div
                className={`${styles.characterSprite} ${styles.walkLeft}`}
                data-active="false"
                ref={walkLeftRef}
              />
            </div>
          </div>

          <div
            aria-hidden="true"
            className={styles.desktopArrowCta}
            data-visible={hasUsedArrowKeys ? 'false' : 'true'}
          >
            {ROTATION_CONTROLS.map((control) => (
              <span
                className={styles.desktopArrowIcon}
                key={control.key}
                style={{ backgroundImage: `url(${control.image})` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.mobileControls}>
        {ROTATION_CONTROLS.map((control) => (
          <button
            aria-label={control.label}
            className={styles.mobileControlButton}
            data-control={control.key}
            data-pressed={pressedControlKey === control.key ? 'true' : 'false'}
            key={control.key}
            onContextMenu={(event) => event.preventDefault()}
            onPointerCancel={handleControlPointerRelease}
            onPointerDown={(event) => handleControlPointerDown(event, control)}
            onLostPointerCapture={handleControlPointerRelease}
            onPointerUp={handleControlPointerRelease}
            style={{ backgroundImage: `url(${control.image})` }}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
