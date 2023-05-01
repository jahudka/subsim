import { manifest, version } from '@parcel/service-worker';

declare var self: ServiceWorkerGlobalScope;

const cacheKeyPrefix = 'subsim/';
const cacheKey = `${cacheKeyPrefix}${version}`;

async function install(evt: ExtendableEvent) {
  self.skipWaiting();
  evt.waitUntil(cacheAssets());
}

async function activate(evt: ExtendableEvent) {
  evt.waitUntil(self.clients.claim());
  evt.waitUntil(purgeStaleCache());
}

async function handleRequest(evt: FetchEvent) {
  evt.respondWith(fetchFromCache(evt.request));
}

async function cacheAssets() {
  const cache = await caches.open(cacheKey);
  await cache.addAll(manifest.filter((path) => !/\/images\//.test(path)));
}

async function purgeStaleCache() {
  const keys = await caches.keys();

  await Promise.all(
    keys.map((key) => key.startsWith(cacheKeyPrefix) && key !== cacheKey && caches.delete(key))
  );
}

async function fetchFromCache(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

self.addEventListener('install', install);
self.addEventListener('activate', activate);
self.addEventListener('fetch', handleRequest);
