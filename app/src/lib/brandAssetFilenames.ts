/**
 * Public filenames only (no `import.meta`) so Node/tsconfig.node can import from `vite.config.ts`.
 * Re-exported from `brandAssets.ts` for app code.
 *
 * `PRODUCTION_SITE_ORIGIN` must stay aligned with absolute URLs in `app/index.html` and
 * `app/public/tonconnect-manifest.json`.
 */
export const PRODUCTION_SITE_ORIGIN = "https://solaris-cet.com" as const;

export const SOLARIS_CET_LOGO_FILENAME = "solaris-cet-logo.jpg" as const;

/** Absolute production URL for the raster lockup (matches Organization `logo` in `index.html`). */
export function productionBrandLogoUrl(): string {
  return `${PRODUCTION_SITE_ORIGIN}/${SOLARIS_CET_LOGO_FILENAME}`;
}
