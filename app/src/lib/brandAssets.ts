import { SOLARIS_CET_LOGO_FILENAME } from './brandAssetFilenames';

export { SOLARIS_CET_LOGO_FILENAME };

/**
 * When renaming the logo file: update `brandAssetFilenames.ts`, `.gitignore` `!app/public/…`,
 * `app/index.html` (preload + Organization `logo` URL), and `app/public/tonconnect-manifest.json` `iconUrl`.
 * PWA precache uses `SOLARIS_CET_LOGO_FILENAME` via `vite.config.ts` `includeAssets`.
 */

/** URL for `<img src>` / preload (respects Vite `base`). */
export function solarisCetLogoSrc(): string {
  return `${import.meta.env.BASE_URL}${SOLARIS_CET_LOGO_FILENAME}`;
}
