import styles from './PlanetNav.module.css';

export default function DoorEnterPrompt() {
  return (
    <span className={styles.doorEnter}>
      <span className={styles.doorEnterLabelDesktop}>press [enter]</span>
      <span className={styles.doorEnterLabelMobile}>[tap] to enter</span>
    </span>
  );
}
