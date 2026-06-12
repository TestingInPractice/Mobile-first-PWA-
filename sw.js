const CACHE = 'ocpwa-v1';
const PRECACHE = [
  '/Mobile-first-PWA-/',
  '/Mobile-first-PWA-/index.html',
  '/Mobile-first-PWA-/css/style.css',
  '/Mobile-first-PWA-/js/app.js',
  '/Mobile-first-PWA-/js/github.js',
  '/Mobile-first-PWA-/js/chat.js',
  '/Mobile-first-PWA-/js/dashboard.js',
  '/Mobile-first-PWA-/manifest.json',
  '/Mobile-first-PWA-/icon-192.svg',
  '/Mobile-first-PWA-/icon-512.svg',
  '/Mobile-first-PWA-/.build-loop/phases.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.github.com')) {
    e.respondWith(networkFirst(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => new Response('Offline', {status: 503})))
  );
});

function networkFirst(req) {
  return fetch(req).then(res => {
    const clone = res.clone();
    caches.open(CACHE).then(c => c.put(req, clone));
    return res;
  }).catch(() => caches.match(req));
}
