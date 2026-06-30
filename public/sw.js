/**
 * QoriCash Web Service Worker v2.0
 * www.qoricash.pe — Marketing + Client Portal
 */

const CACHE_VERSION = 'v2.2';
const CACHE_STATIC  = `qcweb-static-${CACHE_VERSION}`;
const CACHE_PAGES   = `qcweb-pages-${CACHE_VERSION}`;
const OFFLINE_URL   = '/offline';

// Core assets to pre-cache
const PRECACHE_ASSETS = [
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/logo-principal.png',
];

const NEVER_CACHE = [
  '/api/',
  '/dashboard',
  '/perfil',
  '/login',
  '/crear-cuenta',
];

// ─── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache =>
      Promise.allSettled(PRECACHE_ASSETS.map(url => cache.add(url).catch(() => {})))
    )
  );
});

// ─── Activate ────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('qcweb-') && k !== CACHE_STATIC && k !== CACHE_PAGES)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (!['https:', 'http:'].includes(url.protocol)) return;

  // Never cache auth/API/dynamic routes
  if (NEVER_CACHE.some(p => url.pathname.startsWith(p))) return;

  // Static assets from Next.js (_next/static) — cache forever
  // Exclude JS chunks: in production they are content-hashed (HTTP cache handles them),
  // in development they change without hash changes and would serve stale code.
  if (url.pathname.startsWith('/_next/static/') && !url.pathname.startsWith('/_next/static/chunks/')) {
    event.respondWith(cacheFirst(request, CACHE_STATIC));
    return;
  }

  // Images, icons, static files
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, CACHE_STATIC));
    return;
  }

  // Navigation — network first
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }
});

function isStaticAsset(url) {
  const ext = url.pathname.split('.').pop();
  return ['css','js','png','jpg','jpeg','gif','svg','ico','woff','woff2','ttf'].includes(ext)
      || url.pathname.startsWith('/icons/')
      || url.hostname.includes('fonts.googleapis.com')
      || url.hostname.includes('fonts.gstatic.com');
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch { return new Response('', { status: 408 }); }
}

async function networkFirstWithOffline(request) {
  const cache = await caches.open(CACHE_PAGES);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    return offline || new Response('Sin conexión', { status: 503 });
  }
}

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
