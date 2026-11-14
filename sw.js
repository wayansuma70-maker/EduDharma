/* Service worker EduDharma — cache cangkang aplikasi; data GAS TIDAK pernah di-cache di sini. */
const VERSI = 'edudharma-v1.1.0';
const CANGKANG = ['./', 'index.html', 'css/style.css', 'js/config.js', 'js/ui.js', 'js/api.js', 'js/siswa.js', 'js/guru.js', 'js/admin.js', 'js/app.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSI).then((c) => c.addAll(CANGKANG)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSI).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;   // GAS, Google Fonts, GIS: langsung ke jaringan
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const k = r.clone(); caches.open(VERSI).then((c) => c.put(e.request, k)); } return r; }).catch(() => caches.match(e.request).then((m) => m || caches.match('index.html'))));
});