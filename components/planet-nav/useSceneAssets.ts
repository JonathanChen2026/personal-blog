import { useEffect, useState } from 'react';
import { preload } from 'react-dom';
import { SCENE_IMAGE_URLS } from './sceneAssets';

export function useSceneAssets() {
  const [isReady, setIsReady] = useState(false);

  // Emitted in the server-rendered HTML, before CSS backgrounds are discovered.
  for (const url of SCENE_IMAGE_URLS) {
    preload(url, { as: 'image' });
  }

  useEffect(() => {
    let cancelled = false;
    const images = SCENE_IMAGE_URLS.map((url) => {
      const image = new Image();
      image.src = url;
      return image;
    });
    const fontFamily = getComputedStyle(document.body).fontFamily;

    // Reveal one complete scene after decoding, including the first text paint.
    // A failed asset must not prevent the rest of the scene from appearing.
    void Promise.allSettled([
      ...images.map((image) => image.decode()),
      document.fonts.load(`400 16px ${fontFamily}`),
      document.fonts.load(`700 16px ${fontFamily}`),
    ]).then(() => {
      if (!cancelled) setIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return isReady;
}
