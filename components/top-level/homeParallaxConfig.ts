export type HomeParallaxLayerConfig = {
  start: {
    x: number;
    y: number;
    scale: number;
  };
  end: {
    x: number;
    y: number;
    scale: number;
  };
};

export const HOME_PARALLAX = {
  scrollInput: [0, 1],
  layers: {
    background: {
      // Speed is the distance between start and end. Keep this small for subtle motion.
      start: { x: 0, y: -120, scale: 1.0 },
      end: { x: 0, y: -110, scale: 1.00 },
    },
    midground: {
      start: { x: 0, y: 185, scale: 1.03 },
      end: { x: 0, y: 200, scale: 1.00 },
    },
    foreground: {
      start: { x: 0, y: 100, scale: 1 },
      end: { x: 0, y: 0, scale: 8 },
    },
  } satisfies Record<string, HomeParallaxLayerConfig>,
  glass: {
    // Lower blur keeps the pixel-art background legible through the glass.
    panelTintColor: '210, 230, 218',
    panelTintOpacity: 0.2,
    panelShadeColor: '12, 27, 18',
    panelShadeOpacity: 0.06,
    contentDelaySeconds: 0.68,
    panelEntranceY: '105vh',
    panelEntranceStiffness: 120,
    panelEntranceDamping: 23,
    panelEntranceMass: 0.7,
    panelBlurPx: 7,
    panelSaturation: 110,
    panelBrightness: 100,
    panelContrast: 112,
  },
};
