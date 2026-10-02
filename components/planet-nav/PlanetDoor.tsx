import Image from 'next/image';
import type { CSSProperties } from 'react';
import DoorEnterPrompt from './DoorEnterPrompt';
import styles from './PlanetNav.module.css';
import type { PlanetDoor } from './planetNavModel';

type PlanetDoorProps = {
  door: PlanetDoor;
  isActive: boolean;
  onNavigate: () => void;
};

export default function PlanetDoor({
  door,
  isActive,
  onNavigate,
}: PlanetDoorProps) {
  return (
    <div
      className={styles.doorMount}
      style={{
        '--door-angle': `${door.angle}deg`,
        '--door-radius': -door.surfaceRadius,
        '--door-scale': door.scale,
        '--door-drop': door.drop,
      } as CSSProperties}
    >
      <button
        aria-label={`Enter ${door.label}`}
        className={styles.door}
        data-in-range={isActive ? 'true' : 'false'}
        disabled={!isActive}
        onClick={onNavigate}
        onContextMenu={(event) => event.preventDefault()}
        style={{ pointerEvents: isActive ? 'auto' : 'none' }}
        tabIndex={isActive ? 0 : -1}
        type="button"
      >
        <Image
          alt=""
          className={styles.doorFace}
          draggable={false}
          sizes="(max-width: 700px) 24.5vw, 176px"
          src={door.icon}
          unoptimized
        />
        <span className={styles.doorChrome}>
          {isActive ? (
            <DoorEnterPrompt />
          ) : (
            <span aria-hidden="true" className={styles.doorEnterSlot} />
          )}
          <span className={styles.doorLabel}>{door.label}</span>
        </span>
      </button>
    </div>
  );
}
