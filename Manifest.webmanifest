/* Easy Rosary service worker: lets the site work offline.
   Bump VERSION whenever you change site files so installed copies clean up old caches. */
var VERSION = 'er-v1';
var SHELL = [
  './', 'index.html', 'pray.html', 'history.html', 'rosaries.html',
  'css/styles.css',
  'js/prayers.js', 'js/rosary-svg.js', 'js/home.js', 'js/pray.js', 'js/pwa.js',
  'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function (cache) { return cache.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== VERSION; })
          .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

function timeout(ms) {
  return new Promise(function (_, reject) { setTimeout(reject, ms); });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !fonts) return;

  // Pages: try the network first so updates show quickly, but give up after a few
  // seconds (weak signal) and use the saved copy.
  if (req.mode === 'navigate') {
    e.respondWith(
      Promise.race([fetch(req), timeout(4000)])
        .then(function (res) {
          var copy = res.clone();
          caches.open(VERSION).then(function (cache) { cache.put(req, copy); });
          return res;
        })
        .catch(function () {
          return caches.match(req, { ignoreSearch: true })
            .then(function (hit) { return hit || caches.match('index.html'); });
        })
    );
    return;
  }

  // Everything else (styles, scripts, fonts, icons): saved copy first, refreshed in the background.
  e.respondWith(
    caches.open(VERSION).then(function (cache) {
      return cache.match(req).then(function (hit) {
        var fresh = fetch(req)
          .then(function (res) {
            if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
            return res;
          })
          .catch(function () { return hit; });
        return hit || fresh;
      });
    })
  );
});