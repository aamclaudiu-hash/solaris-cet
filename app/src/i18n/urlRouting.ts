import type { LangCode } from './translations';

export const URL_LOCALES = ['en', 'es', 'zh', 'ru', 'ro', 'pt', 'de'] as const;

export type UrlLocale = (typeof URL_LOCALES)[number];

export function urlLocaleFromLang(lang: LangCode): UrlLocale {
  return (URL_LOCALES as readonly string[]).includes(lang) ? (lang as UrlLocale) : 'en';
}

function normalizePathname(raw: string) {
  if (!raw) return '/';
  const trimmed = raw.startsWith('/') ? raw : `/${raw}`;
  return trimmed.replace(/\/+/, '/');
}

export function isLikelyFileRequest(pathname: string) {
  return /\.[a-z0-9]{1,8}$/i.test(pathname);
}

export function shouldLocalePrefixPathname(pathnameRaw: string) {
  const pathname = normalizePathname(pathnameRaw);
  if (pathname === '/' || pathname === '/index.html') return false;
  if (isLikelyFileRequest(pathname)) return false;
  if (pathname.startsWith('/assets/') || pathname.startsWith('/images/') || pathname.startsWith('/fonts/')) return false;
  if (pathname.startsWith('/api/')) return false;
  return true;
}

export function parseUrlLocaleFromPathname(pathnameRaw: string) {
  const pathname = normalizePathname(pathnameRaw);
  const parts = pathname.split('/').filter(Boolean);
  const first = parts[0] ?? '';
  if ((URL_LOCALES as readonly string[]).includes(first)) {
    const rest = `/${parts.slice(1).join('/')}`;
    return { locale: first as UrlLocale, pathnameNoLocale: rest === '/' ? '/' : rest };
  }
  return { locale: null, pathnameNoLocale: pathname };
}

export function localizePathname(pathnameNoLocaleRaw: string, locale: UrlLocale) {
  const pathnameNoLocale = normalizePathname(pathnameNoLocaleRaw);
  if (locale === 'en') return pathnameNoLocale;
  if (!shouldLocalePrefixPathname(pathnameNoLocale)) return pathnameNoLocale;
  return normalizePathname(`/${locale}${pathnameNoLocale}`);
}
