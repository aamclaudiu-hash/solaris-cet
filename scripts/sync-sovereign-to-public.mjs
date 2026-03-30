#!/usr/bin/env node
/**
 * Copies static/sovereign → app/public/sovereign so Vite production build
 * serves the OMEGA zero-JS surface at /sovereign/ (Coolify: same artifact as SPA).
 */
import { cpSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "static/sovereign");
const dest = join(root, "app/public/sovereign");

if (!existsSync(src)) {
  console.error("[sync-sovereign] missing:", src);
  process.exit(1);
}

cpSync(src, dest, { recursive: true });
console.log("[sync-sovereign]", src, "→", dest);
