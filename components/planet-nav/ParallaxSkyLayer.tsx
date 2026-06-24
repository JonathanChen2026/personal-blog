import type { CSSProperties } from 'react';
import styles from './PlanetNav.module.css';
import {
  SKY_ELEMENT_SIZE_PX,
  SKY_IMAGE_SRC,
  type SkyElementConfig,
  type SkyLayer,
} from './parallaxSkyConfig';

type ParallaxSkyLayerProps = {
  elements: readonly SkyElementConfig[];
  layer: SkyLayer;
  layerRef: (node: HTMLDivElement | null) => void;
};

export default function ParallaxSkyLayer({ elements, layer, layerRef }: ParallaxSkyLayerProps) {
  return (
    <div
      aria-hidden="true"
      className={styles.parallaxLayer}
      data-layer={layer}
      ref={layerRef}
    >
      {elements.map((element, index) => (
        <span
          className={styles.skyElement}
          data-kind={element.kind}
          key={`${layer}-${element.kind}-${index}`}
          style={
            {
              '--sky-rotation': `${element.rotationDeg}deg`,
              '--sky-size': `${SKY_ELEMENT_SIZE_PX[layer][element.kind]}px`,
              '--sky-x': `${element.xVmin}vmin`,
              '--sky-y': `${element.yVmin}vmin`,
              backgroundImage: `url(${SKY_IMAGE_SRC[element.kind]})`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
