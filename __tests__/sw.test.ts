/**
 * Tests for public/sw.js — Service Worker caching rules.
 *
 * Tests 11-14.
 *
 * These tests mirror the key functions from sw.js in a Node-friendly form and
 * also read the actual sw.js source to verify critical constants.  If sw.js
 * changes, keep the mirrored functions below in sync.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SW_PATH   = join(__dirname, '../public/sw.js');
const swSource  = readFileSync(SW_PATH, 'utf-8');

// ── Mirror sw.js helpers (keep in sync with public/sw.js) ───────────────────

const NEVER_CACHE = ['/api/', '/dashboard', '/perfil', '/login', '/crear-cuenta'];

function isNeverCache(pathname: string): boolean {
  return NEVER_CACHE.some(p => pathname.startsWith(p));
}

function isStaticAsset(url: { pathname: string; hostname: string }): boolean {
  // FIX 2: chunks are excluded from SW caching
  if (url.pathname.startsWith('/_next/static/chunks/')) return false;
  const ext = url.pathname.split('.').pop() ?? '';
  return ['css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'woff', 'woff2', 'ttf'].includes(ext)
      || url.pathname.startsWith('/icons/')
      || url.hostname.includes('fonts.googleapis.com')
      || url.hostname.includes('fonts.gstatic.com');
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('sw.js — NEVER_CACHE (test 11)', () => {

  it('11a: /api/ routes are always excluded from SW cache', () => {
    expect(isNeverCache('/api/rates')).toBe(true);
    expect(isNeverCache('/api/platform/public/exchange-rates')).toBe(true);
    expect(isNeverCache('/api/')).toBe(true);
  });

  it('11b: auth/dashboard routes are excluded from SW cache', () => {
    expect(isNeverCache('/dashboard')).toBe(true);
    expect(isNeverCache('/login')).toBe(true);
    expect(isNeverCache('/perfil')).toBe(true);
    expect(isNeverCache('/crear-cuenta')).toBe(true);
  });

  it('11c: non-sensitive routes are NOT in NEVER_CACHE', () => {
    expect(isNeverCache('/')).toBe(false);
    expect(isNeverCache('/servicios')).toBe(false);
    expect(isNeverCache('/nosotros')).toBe(false);
    expect(isNeverCache('/offline')).toBe(false);
  });

  it('11d: sw.js source still contains /api/ in NEVER_CACHE', () => {
    expect(swSource).toContain("'/api/'");
  });

});

describe('sw.js — chunks NO longer cached via isStaticAsset (test 12)', () => {

  it('12a: /_next/static/chunks/*.js returns false from isStaticAsset', () => {
    expect(isStaticAsset({ pathname: '/_next/static/chunks/3192-abc123.js', hostname: 'qoricash.pe' })).toBe(false);
    expect(isStaticAsset({ pathname: '/_next/static/chunks/main-def456.js', hostname: 'qoricash.pe' })).toBe(false);
    expect(isStaticAsset({ pathname: '/_next/static/chunks/pages/_app-xyz.js', hostname: 'qoricash.pe' })).toBe(false);
    expect(isStaticAsset({ pathname: '/_next/static/chunks/framework-ghi.js', hostname: 'qoricash.pe' })).toBe(false);
  });

  it('12b: sw.js source contains the chunks exclusion guard', () => {
    expect(swSource).toContain("/_next/static/chunks/");
    expect(swSource).toContain("return false");
  });

});

describe('sw.js — legitimate static assets still cached (test 13)', () => {

  it('13a: images and icons are cached', () => {
    expect(isStaticAsset({ pathname: '/logo-principal.png',      hostname: 'qoricash.pe' })).toBe(true);
    expect(isStaticAsset({ pathname: '/icons/icon-192x192.png',  hostname: 'qoricash.pe' })).toBe(true);
    expect(isStaticAsset({ pathname: '/icons/apple-touch-icon.png', hostname: 'qoricash.pe' })).toBe(true);
    expect(isStaticAsset({ pathname: '/banner.jpg',              hostname: 'qoricash.pe' })).toBe(true);
    expect(isStaticAsset({ pathname: '/img/hero.svg',            hostname: 'qoricash.pe' })).toBe(true);
    expect(isStaticAsset({ pathname: '/favicon.ico',             hostname: 'qoricash.pe' })).toBe(true);
  });

  it('13b: fonts are cached', () => {
    expect(isStaticAsset({ pathname: '/font.woff2',  hostname: 'qoricash.pe' })).toBe(true);
    expect(isStaticAsset({ pathname: '/font.woff',   hostname: 'qoricash.pe' })).toBe(true);
    expect(isStaticAsset({ pathname: '/font.ttf',    hostname: 'qoricash.pe' })).toBe(true);
    expect(isStaticAsset({ pathname: '/anything',    hostname: 'fonts.googleapis.com' })).toBe(true);
    expect(isStaticAsset({ pathname: '/anything',    hostname: 'fonts.gstatic.com' })).toBe(true);
  });

  it('13c: CSS is cached', () => {
    expect(isStaticAsset({ pathname: '/_next/static/css/main.css', hostname: 'qoricash.pe' })).toBe(true);
    expect(isStaticAsset({ pathname: '/styles.css',                hostname: 'qoricash.pe' })).toBe(true);
  });

  it('13d: non-chunk JS (e.g. /_next/static/something.js) is still cached', () => {
    // Only /_next/static/chunks/ are excluded; other JS paths are still cached.
    expect(isStaticAsset({ pathname: '/_next/static/something.js', hostname: 'qoricash.pe' })).toBe(true);
  });

  it('13e: /icons/ prefix path is cached regardless of extension', () => {
    expect(isStaticAsset({ pathname: '/icons/custom-icon',        hostname: 'qoricash.pe' })).toBe(true);
  });

  it('13f: GIF is cached', () => {
    expect(isStaticAsset({ pathname: '/loading.gif', hostname: 'qoricash.pe' })).toBe(true);
  });

});

describe('sw.js — CACHE_VERSION bumped (test 14)', () => {

  it('14: CACHE_VERSION is v2.3 (bumped to invalidate old caches after SW fix)', () => {
    expect(swSource).toContain("const CACHE_VERSION = 'v2.3'");
  });

  it('14b: cache name constants use CACHE_VERSION template literal', () => {
    // sw.js uses template literals so the evaluated string is never in source;
    // verify the template expression references the correct variable.
    expect(swSource).toContain('qcweb-static-${CACHE_VERSION}');
    expect(swSource).toContain('qcweb-pages-${CACHE_VERSION}');
  });

});
