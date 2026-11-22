const V = 'warshik-20261122074053';
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(V).then(function(c){
    return c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png']);
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k !== V; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function(hit){
    if (hit) return hit;
    return fetch(e.request).then(function(res){
      if (res && res.ok && res.type === 'basic') { var copy = res.clone(); caches.open(V).then(function(c){ c.put(e.request, copy); }); }
      return res;
    }).catch(function(){ return caches.match('./index.html'); });
  }));
});
