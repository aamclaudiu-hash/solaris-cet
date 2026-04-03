import { expect, type Page } from '@playwright/test';

export async function waitForAppReady(page: Page, options?: { timeout?: number }) {
  const timeout = options?.timeout ?? 4000;
  await page.locator('.loading-overlay').waitFor({ state: 'hidden', timeout }).catch(() => {});
}

/**
 * Scroll until an element exists (sections behind `LazyLoadWrapper` are not in DOM until near viewport).
 */
export async function scrollUntilSelectorAttached(
  page: Page,
  selector: string,
  options?: { timeout?: number; stepPx?: number; intervals?: number[] },
) {
  const timeout = options?.timeout ?? 35_000;
  const stepPx = options?.stepPx ?? 700;
  const intervals = options?.intervals ?? [100, 200, 300, 400];

  await expect
    .poll(
      async () => {
        if ((await page.locator(selector).count()) > 0) return true;
        await page.evaluate((px) => window.scrollBy(0, px), stepPx);
        return false;
      },
      { timeout, intervals },
    )
    .toBe(true);
}
