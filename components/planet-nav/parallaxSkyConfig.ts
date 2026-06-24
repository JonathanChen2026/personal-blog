export type SkyElementKind = 'asteroid' | 'comet' | 'star-one' | 'star-two';
export type SkyLayer = 'far' | 'mid';

export type SkyElementConfig = {
  kind: SkyElementKind;
  rotationDeg: number;
  xVmin: number;
  yVmin: number;
};

export const PARALLAX_SPEED = {
  far: 0.1,
  mid: 0.25,
} as const;

export const SKY_IMAGE_SRC: Record<SkyElementKind, string> = {
  'star-one': '/star-one.png',
  'star-two': '/star-two.png',
  comet: '/comet.png',
  asteroid: '/asteroid.png',
};

export const SKY_ELEMENT_SIZE_PX: Record<SkyLayer, Record<SkyElementKind, number>> = {
  far: {
    'star-one': 9,
    'star-two': 12,
    comet: 45,
    asteroid: 36,
  },
  mid: {
    'star-one': 11,
    'star-two': 15,
    comet: 57,
    asteroid: 48,
  },
};

const GOLDEN_ANGLE_DEG = 137.508;

const SKY_LAYER_COUNTS: Record<SkyLayer, Record<SkyElementKind, number>> = {
  far: {
    'star-one': 9,
    'star-two': 5,
    comet: 3,
    asteroid: 3,
  },
  mid: {
    'star-one': 4,
    'star-two': 7,
    comet: 3,
    asteroid: 3,
  },
};

const SKY_LAYER_SEED: Record<SkyLayer, number> = {
  far: 11,
  mid: 29,
};

function expandKinds(counts: Record<SkyElementKind, number>): SkyElementKind[] {
  const kinds: SkyElementKind[] = [];

  for (const kind of ['star-one', 'star-two', 'comet', 'asteroid'] as const) {
    for (let index = 0; index < counts[kind]; index += 1) {
      kinds.push(kind);
    }
  }

  return kinds;
}

function buildSkyLayer(layer: SkyLayer): SkyElementConfig[] {
  const kinds = expandKinds(SKY_LAYER_COUNTS[layer]);
  const layerSeed = SKY_LAYER_SEED[layer];
  const minRadiusVmin = layer === 'far' ? 46 : 42;
  const radiusSpreadVmin = 54;

  return kinds.map((kind, index) => {
    const angleDeg = (index * GOLDEN_ANGLE_DEG + layerSeed) % 360;
    const radiusVmin = minRadiusVmin + ((index * 9.7 + layerSeed * 2.3) % radiusSpreadVmin);
    const rotationDeg = (index * 61 + layerSeed * 19) % 360;
    const angleRad = (angleDeg * Math.PI) / 180;

    return {
      kind,
      rotationDeg,
      xVmin: Math.cos(angleRad) * radiusVmin,
      yVmin: Math.sin(angleRad) * radiusVmin,
    };
  });
}

export const FAR_SKY_ELEMENTS = buildSkyLayer('far');
export const MID_SKY_ELEMENTS = buildSkyLayer('mid');

export const ALL_SKY_IMAGE_URLS = Object.values(SKY_IMAGE_SRC);
