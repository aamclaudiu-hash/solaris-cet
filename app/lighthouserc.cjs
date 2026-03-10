/**
 * Lighthouse CI configuration for Solaris CET.
 *
 * Blocks merge if Performance, Accessibility, Best Practices, or SEO
 * scores fall below 0.98 (98 out of 100).
 *
 * Runs 3 consecutive audits per URL and takes the median result to
 * reduce measurement noise.
 */
module.exports = {
  ci: {
    collect: {
      /* Build the app first, then serve the dist/ folder */
      staticDistDir: './dist',
      numberOfRuns: 3,
      settings: {
        /* Use desktop preset for a consistent, deterministic baseline */
        preset: 'desktop',
        /* Throttling disabled for the static-server environment */
        throttlingMethod: 'provided',
        /* Only audit the categories we care about */
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      /* Fail the CI run if any assertion does not pass */
      preset: 'lighthouse:no-pwa',
      assertions: {
        /* Core categories — must be ≥ 0.98 */
        'categories:performance': ['error', { minScore: 0.98 }],
        'categories:accessibility': ['error', { minScore: 0.98 }],
        'categories:best-practices': ['error', { minScore: 0.98 }],
        'categories:seo': ['error', { minScore: 0.98 }],

        /* ── Accessibility quick-wins that prevent score drops ────────── */
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'image-alt': 'error',
        'link-name': 'error',
        'meta-description': 'error',

        /* ── SEO fundamentals ─────────────────────────────────────────── */
        'canonical': 'error',
        'robots-txt': 'warn',

        /* ── Best-practices / security ────────────────────────────────── */
        'no-vulnerable-libraries': 'error',
        'csp-xss': 'warn',
        'is-on-https': 'warn',

        /* ── Performance ────────────────────────────────────────────── */
        'render-blocking-resources': 'warn',
        'uses-text-compression': 'warn',
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
        'unused-javascript': 'warn',
        'unused-css-rules': 'warn',
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
      },
    },
    upload: {
      /* Store reports as local files — the GitHub Actions workflow uploads
         them as artifacts, so no external storage service is needed. */
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
