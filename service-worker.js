const CACHE = "othniel2to-v1";
const FILES = [
  "index.html",
  "manifest.json",
  "icon.svg"
];
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if (k !== CACHE) return caches.delete(k) }))).then(() => clients.claim())
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      return caches.open(CACHE).then(c => {
        if (e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)) {
          c.put(e.request, res.clone());
        }
        return res;
      });
    }).catch(() => caches.match('index.html')))
  );
});
