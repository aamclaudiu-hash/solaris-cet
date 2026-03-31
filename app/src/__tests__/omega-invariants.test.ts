import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FORBIDDEN_CDN_PATTERNS = [
  /fonts\.googleapis\.com/i,
  /fonts\.gstatic\.com/i,
  /cdn\.jsdelivr\.net/i,
  /unpkg\.com/i,
  /cdnjs\.cloudflare\.com/i,
  /cdn\.tailwindcss\.com/i,
];

describe("OMEGA invariants", () => {
  // app/src/__tests__ -> ../../.. = repository root
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
  const sovereignHtmlPath = join(repoRoot, "static/sovereign/index.html");
  const appIndexHtmlPath = join(repoRoot, "app/index.html");

  const sovereignHtml = readFileSync(sovereignHtmlPath, "utf8");
  const appIndexHtml = readFileSync(appIndexHtmlPath, "utf8");

  it("keeps sovereign surface script-free", () => {
    expect(sovereignHtml).not.toMatch(/<script\b/i);
  });

  it("blocks external CDN/font hosts in shipped entrypoint HTML", () => {
    for (const pattern of FORBIDDEN_CDN_PATTERNS) {
      expect(sovereignHtml).not.toMatch(pattern);
      expect(appIndexHtml).not.toMatch(pattern);
    }
  });

  it("preserves canonical Solaris CET anchors on sovereign surface", () => {
    expect(sovereignHtml).toMatch(/9,000\s*CET/i);
    expect(sovereignHtml).toMatch(/\bTON\b/i);
    expect(sovereignHtml).toMatch(/Cetățuia,\s*Romania/i);
  });
});
