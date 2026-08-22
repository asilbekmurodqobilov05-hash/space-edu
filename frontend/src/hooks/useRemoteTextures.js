import { useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * Load textures that live on somebody else's server, without betting the page
 * on them being up.
 *
 * `SpaceLabView` fetched eight of these through `useLoader` — three from
 * `unpkg.com` and five from `raw.githubusercontent.com`. Two problems with that:
 *
 * 1. `useLoader` throws when a load fails, and there was no boundary between
 *    the view and the root one, so a blocked network, a rate limit, or an
 *    offline moment on a third-party host replaced the entire application with
 *    the crash screen. (A route boundary now exists too; this stops the throw
 *    at source.)
 * 2. `raw.githubusercontent.com` is not an asset host. GitHub rate-limits it
 *    and does not support it for production traffic, so this is a dependency
 *    that fails on exactly the day the class all opens the page at once.
 *
 * This returns `null` per texture that did not load. Callers give the material
 * a plain colour instead — an untextured Earth rather than no page.
 *
 * The proper fix is to host the eight files ourselves. That is deliberately not
 * done here: they are several megabytes raw, the repository is already under a
 * large-asset budget (ticket Q3), and they need downscaling and re-encoding
 * first. See docs/HANDOVER.md.
 */
export function useRemoteTextures(urls) {
  const [textures, setTextures] = useState(() => urls.map(() => null));

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    const loaded = urls.map(() => null);
    let outstanding = urls.length;
    if (!outstanding) return undefined;

    const settle = () => {
      outstanding -= 1;
      if (outstanding === 0 && !cancelled) setTextures([...loaded]);
    };

    urls.forEach((url, index) => {
      loader.load(
        url,
        (texture) => {
          if (cancelled) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          loaded[index] = texture;
          settle();
        },
        undefined,
        settle,
      );
    });

    return () => {
      cancelled = true;
      // The game leaked a texture per unmount before ticket F3; do not add
      // another eight.
      for (const texture of loaded) texture?.dispose?.();
    };
    // The url list is a module-level constant at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return textures;
}
