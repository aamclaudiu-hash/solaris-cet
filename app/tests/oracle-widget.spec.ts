import { test, expect } from '@playwright/test';

/**
 * Solaris Oracle — desktop + mobile viewport, API failure path, locale query.
 */
test.describe('Solaris Oracle widget — desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('solaris_lang', 'en');
    });
    await page.goto('/');
    await page.locator('.loading-overlay').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  });

  test('Oracle title and initiate control are visible', async ({ page }) => {
    const hero = page.getByTestId('oracle-hero');
    await hero.scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /Solaris Oracle/i }).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: /initiate protocol/i })).toBeVisible();
    const ask = page.getByTestId('oracle-hero-query');
    await expect(ask).toBeVisible();
    const box = await ask.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(40);
  });

  test('Opening modal from a suggested chip shows dialog', async ({ page }) => {
    const heroWidget = page
      .locator('div.max-w-5xl')
      .filter({ has: page.getByRole('heading', { name: /Solaris Oracle/i }) })
      .first();
    await heroWidget.scrollIntoViewIfNeeded();
    const chip = heroWidget.getByRole('button', { name: /What is the RAV Protocol/i });
    await chip.evaluate((el) =>
      (el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' }),
    );
    await chip.evaluate((btn) => (btn as HTMLButtonElement).click());
    await expect(page.getByTestId('oracle-modal-dialog')).toBeVisible({ timeout: 8000 });
  });

  test('Escape closes Oracle modal', async ({ page }) => {
    const heroWidget = page
      .locator('div.max-w-5xl')
      .filter({ has: page.getByRole('heading', { name: /Solaris Oracle/i }) })
      .first();
    await heroWidget.scrollIntoViewIfNeeded();
    const chip = heroWidget.getByRole('button', { name: /What is the RAV Protocol/i });
    await chip.evaluate((el) =>
      (el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' }),
    );
    await chip.evaluate((btn) => (btn as HTMLButtonElement).click());
    await expect(page.getByTestId('oracle-modal-dialog')).toBeVisible({ timeout: 8000 });
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('oracle-modal-dialog')).toHaveCount(0);
  });

  test('static mode shows offline hint when /api/chat fails', async ({ page }) => {
    await page.route('**/api/chat', (route) => route.abort('failed'));
    const heroWidget = page
      .locator('div.max-w-5xl')
      .filter({ has: page.getByRole('heading', { name: /Solaris Oracle/i }) })
      .first();
    await heroWidget.scrollIntoViewIfNeeded();
    const chip = heroWidget.getByRole('button', { name: /What is the RAV Protocol/i });
    await chip.evaluate((el) =>
      (el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' }),
    );
    await chip.evaluate((btn) => (btn as HTMLButtonElement).click());
    await expect(page.getByTestId('oracle-modal-dialog')).toBeVisible({ timeout: 8000 });
    const status = page.getByRole('status');
    await expect(status).toBeVisible({ timeout: 16_000 });
    await expect(status).toContainText(/built-in|No live API/i);
  });
});

test.describe('Solaris Oracle widget — mobile viewport', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('solaris_lang', 'en');
    });
    await page.goto('/');
    await page.locator('.loading-overlay').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  });

  test('Oracle controls usable at phone width', async ({ page }) => {
    await page.getByTestId('oracle-hero').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /Solaris Oracle/i }).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: /initiate protocol/i })).toBeVisible();
    const h = await page.getByTestId('oracle-hero-query').boundingBox();
    expect(h?.height).toBeGreaterThanOrEqual(40);
  });

  test('opens modal from hero question submit (touch flow)', async ({ page }) => {
    await page.getByTestId('oracle-hero').scrollIntoViewIfNeeded();
    await page.getByTestId('oracle-hero-query').fill('What is the CET supply?');
    await page.getByRole('button', { name: /initiate protocol/i }).click();
    await expect(page.getByTestId('oracle-modal-dialog')).toBeVisible({ timeout: 8000 });
    await expect(page.getByText('What is the CET supply?', { exact: true })).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Locale query ?lang=', () => {
  test('?lang=ro shows Romanian Oracle title', async ({ page }) => {
    await page.goto('/?lang=ro');
    await page.locator('.loading-overlay').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await page.getByTestId('oracle-hero').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /Oracolul Solaris/i }).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
