import { manifest, version } from '@parcel/service-worker';

declare var self: ServiceWorkerGlobalScope;

async function install() {
  const cache = await caches.open(version);
  await cache.addAll(manifest.filter((path) => !/\/images\//.test(path)));
}

async function activate() {
  const keys = await caches.keys();

  await Promise.all(
    keys.map((key) => key !== version && caches.delete(key))
  );
}

async function fetchFromCache(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

self.addEventListener('install', (evt) => evt.waitUntil(install()));
self.addEventListener('activate', (evt) => evt.waitUntil(activate()));
self.addEventListener('fetch', (evt) => evt.respondWith(fetchFromCache(evt.request)));
