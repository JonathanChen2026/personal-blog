import type { CSSProperties } from 'react';
import DoorEnterPrompt from './DoorEnterPrompt';
import { getDoorImageUrls } from './doorAssets';
import styles from './PlanetNav.module.css';
import { getDoorFacing, type PlanetDoor } from './planetNavModel';

const INITIAL_PLANET_ROTATION = 0;

type PlanetDoorProps = {
  door: PlanetDoor;
  doorRef: (node: HTMLDivElement | null) => void;
  isActive: boolean;
  onNavigate: () => void;
};

export default function PlanetDoor({
  door,
  doorRef,
  isActive,
  onNavigate,
}: PlanetDoorProps) {
  const images = getDoorImageUrls(door.key);
  const facing = getDoorFacing(door, INITIAL_PLANET_ROTATION);

  return (
    <div
      className={styles.doorMount}
      ref={doorRef}
      style={{ '--door-angle': `${door.angle}deg` } as CSSProperties}
    >
      <button
        aria-label={`Enter ${door.label}`}
        className={styles.door}
        disabled={!isActive}
        onClick={onNavigate}
        onContextMenu={(event) => event.preventDefault()}
        style={{ pointerEvents: isActive ? 'auto' : 'none' }}
        tabIndex={isActive ? 0 : -1}
        type="button"
      >
        <span
          aria-hidden="true"
          className={styles.doorFace}
          data-active={facing === 'left' ? 'true' : 'false'}
          data-side="left"
          style={{ backgroundImage: `url(${images.left})` }}
        />
        <span
          aria-hidden="true"
          className={styles.doorFace}
          data-active={facing === 'right' ? 'true' : 'false'}
          data-side="right"
          style={{ backgroundImage: `url(${images.right})` }}
        />
      </button>
      <div className={styles.doorChrome}>
        <span className={styles.doorLabel}>{door.label}</span>
        {isActive ? (
          <DoorEnterPrompt />
        ) : (
          <span aria-hidden="true" className={styles.doorEnterSlot} />
        )}
      </div>
    </div>
  );
}
