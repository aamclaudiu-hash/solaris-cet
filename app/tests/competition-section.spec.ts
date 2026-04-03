import { test, expect, type Page } from '@playwright/test';

async function waitForAppReady(page: Page) {
  await page.locator('.loading-overlay').waitFor({ state: 'hidden', timeout: 4000 }).catch(() => {});
}

/**
 * `CompetitionSection` sits behind `LazyLoadWrapper` (near-screen gate). Scroll until the chunk mounts.
 */
async function ensureCompetitionSectionAttached(page: Page) {
  await expect
    .poll(
      async () => {
        if ((await page.locator('#competition').count()) > 0) return true;
        await page.evaluate(() => window.scrollBy(0, 700));
        return false;
      },
      { timeout: 35_000, intervals: [100, 200, 300, 400] },
    )
    .toBe(true);
}

test.describe('Competition section', () => {
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('matrix and Recharts mount after scrolling to #competition', async ({ page }) => {
    await ensureCompetitionSectionAttached(page);
    const section = page.locator('#competition');
    await section.scrollIntoViewIfNeeded();

    await expect(section).toBeVisible({ timeout: 15000 });
    await expect(section.locator('thead th div', { hasText: /^CET$/ })).toBeVisible();
    await expect(section.getByText('Fetch.ai', { exact: false })).toBeVisible();

    // Viewport gate + lazy chunk: Recharts surfaces use .recharts-wrapper
    await expect(section.locator('.recharts-wrapper').first()).toBeVisible({ timeout: 25_000 });
    await expect(section.locator('.recharts-wrapper')).toHaveCount(2);
  });

  test('deep link /#competition still reveals charts when in view', async ({ page }) => {
    await page.goto('/#competition');
    await waitForAppReady(page);
    await ensureCompetitionSectionAttached(page);
    const section = page.locator('#competition');
    await expect(section).toBeVisible({ timeout: 15000 });
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator('.recharts-wrapper').first()).toBeVisible({ timeout: 25_000 });
  });
});
