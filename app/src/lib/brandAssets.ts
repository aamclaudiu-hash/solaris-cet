import {
  PRODUCTION_SITE_ORIGIN,
  SOLARIS_CET_LOGO_FILENAME,
  productionBrandLogoUrl,
} from './brandAssetFilenames';

export { PRODUCTION_SITE_ORIGIN, SOLARIS_CET_LOGO_FILENAME, productionBrandLogoUrl };

/**
 * When renaming the logo file: update `brandAssetFilenames.ts` (`SOLARIS_CET_LOGO_FILENAME`,
 * `productionBrandLogoUrl`), `.gitignore` `!app/public/…`, `app/index.html` (preload + JSON-LD),
 * and `app/public/tonconnect-manifest.json` `iconUrl`. PWA precache: `vite.config.ts` `includeAssets`.
 */

/** URL for `<img src>` / preload (respects Vite `base`). */
export function solarisCetLogoSrc(): string {
  return `${import.meta.env.BASE_URL}${SOLARIS_CET_LOGO_FILENAME}`;
}
