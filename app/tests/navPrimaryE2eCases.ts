import { expect, type Page } from '@playwright/test';
import { NAV_PRIMARY_IN_PAGE } from '@/lib/navPrimaryHrefs';
import { scrollUntilSelectorAttached } from './e2e-helpers';

/** Match `sovereign-static.spec.ts`: fixed language for stable nav + section copy. */
export const E2E_I18N_START = '/?lang=en';

export type NavPrimaryInPageHref = (typeof NAV_PRIMARY_IN_PAGE)[number]['href'];

/** Hash links: pointer hit-test can fail in headless (logo / glass layers). */
export async function clickHeaderNavHash(page: Page, href: NavPrimaryInPageHref): Promise<void> {
  await page
    .locator(`header nav a[href="${href}"]`)
    .evaluate((el) => (el as HTMLAnchorElement).click());
}

const desktopAssertByHref: {
  [K in NavPrimaryInPageHref]: (page: Page) => Promise<void>;
} = {
  '#nova-app': async (page) => {
    const nova = page.locator('#nova-app');
    await expect(nova).toBeAttached({ timeout: 15_000 });
    await nova.scrollIntoViewIfNeeded();
    await expect(nova.getByText('Mobile Mining')).toBeVisible({ timeout: 10_000 });
  },
  '#staking': async (page) => {
    const staking = page.locator('#staking');
    await expect(staking).toBeAttached({ timeout: 15_000 });
    await staking.scrollIntoViewIfNeeded();
    await expect(staking.getByText('9,000').first()).toBeVisible({ timeout: 10_000 });
  },
  '#roadmap': async (page) => {
    await scrollUntilSelectorAttached(page, '#roadmap');
    await expect(page.locator('#roadmap').locator('.roadmap-card').first()).toBeVisible({
      timeout: 15_000,
    });
  },
  '#team': async (page) => {
    await scrollUntilSelectorAttached(page, '#team');
    await expect(page.locator('#team').getByText('AI CORPORATE STRUCTURE')).toBeVisible({
      timeout: 15_000,
    });
  },
  '#how-to-buy': async (page) => {
    await scrollUntilSelectorAttached(page, '#how-to-buy');
    await expect(page.locator('#how-to-buy').getByText('HOW TO BUY')).toBeVisible({
      timeout: 15_000,
    });
  },
  '#resources': async (page) => {
    await scrollUntilSelectorAttached(page, '#resources');
    await expect(page.locator('#resources').getByText('ECOSYSTEM RESOURCES')).toBeVisible({
      timeout: 15_000,
    });
  },
  '#faq': async (page) => {
    await scrollUntilSelectorAttached(page, '#faq');
    await expect(page.locator('#faq').locator('.faq-trigger').first()).toBeVisible({
      timeout: 15_000,
    });
  },
};

export async function runDesktopNavPrimaryCase(page: Page, href: NavPrimaryInPageHref): Promise<void> {
  await clickHeaderNavHash(page, href);
  await expect(page).toHaveURL((u) => u.hash === href);
  await desktopAssertByHref[href](page);
}

export const NAV_PRIMARY_DESKTOP_E2E = NAV_PRIMARY_IN_PAGE.map((item) => ({
  navKey: item.navKey,
  href: item.href,
}));
