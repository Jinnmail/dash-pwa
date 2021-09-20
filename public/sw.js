console.warn("sw file in public folder")

let cacheData = "appV1";

this.addEventListener('install', (event) => {
  event.AT_TARGET.waitUntil(
    caches.open(cacheData).then((cache) => {
      cache.addAll([
        '/static/js/main.chunk.js',
        '/static/js/vendors~main.chunk.js', 
        '/static/js/bundle.js',
        '/index.html',
        '/'
      ])
    })
  )
})

this.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      if (res) {
        return res;
      }
    })
  )
})