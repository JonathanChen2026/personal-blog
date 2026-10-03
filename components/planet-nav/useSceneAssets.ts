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
    const rootStyle = getComputedStyle(document.documentElement);
    const sansFamily = getComputedStyle(document.body).fontFamily;
    const monoFamily = rootStyle.getPropertyValue('--font-fragment-mono').trim();

    // Reveal one complete scene after decoding, including the first text paint.
    // A failed asset must not prevent the rest of the scene from appearing.
    void Promise.allSettled([
      ...images.map((image) => image.decode()),
      document.fonts.load(`400 16px ${sansFamily}`),
      document.fonts.load(`700 16px ${sansFamily}`),
      monoFamily ? document.fonts.load(`400 16px ${monoFamily}`) : Promise.resolve(),
    ]).then(() => {
      if (!cancelled) setIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return isReady;
}
