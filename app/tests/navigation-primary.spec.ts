import { test, expect } from '@playwright/test';
import { waitForAppReady, scrollUntilSelectorAttached } from './e2e-helpers';

/**
 * Desktop header in-page anchors (`Navigation` middle column, xl+).
 * Href-based locators stay valid across locales.
 */
test.describe('Primary navigation (desktop)', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('nav link #staking reveals tokenomics metrics', async ({ page }) => {
    // Hash links: avoid pointer hit-test (logo / glass layers can intercept in headless layout).
    await page.locator('header nav a[href="#staking"]').evaluate((el) => (el as HTMLAnchorElement).click());
    await expect(page).toHaveURL(/#staking/);
    const staking = page.locator('#staking');
    await expect(staking).toBeAttached({ timeout: 15_000 });
    await staking.scrollIntoViewIfNeeded();
    await expect(staking.getByText('9,000').first()).toBeVisible({ timeout: 10_000 });
  });

  test('nav link #roadmap reaches roadmap after lazy mount', async ({ page }) => {
    await page.locator('header nav a[href="#roadmap"]').evaluate((el) => (el as HTMLAnchorElement).click());
    await expect(page).toHaveURL(/#roadmap/);
    await scrollUntilSelectorAttached(page, '#roadmap');
    await expect(page.locator('#roadmap').locator('.roadmap-card').first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
