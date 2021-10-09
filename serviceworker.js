// Register Service Worker <<
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/fallback.json',
  '/css/main.css',
  '/js/jquery.min.js',
  '/js/main.js',
  'img/logo.jpeg'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
  );
});
// >>


// Using Service Worker <<
self.addEventListener('fetch', function(event) {

    var request = event.request
    var url = new URL(request.url)

    // Pisahkan Request API dan Internal

    if(url.origin === location.origin){
        event.respondWith(
            caches.match(request).then(function(response){
                return response || fetch(request)
            })
        );
    }else{
        event.respondWith(
            caches.open('products-cache').then(function(cache){
                return fetch(request).then(function(liveResponse){
                    cache.put(request, liveResponse.clone())
                    return liveResponse
                }).catch(function(){
                    return caches.match(request).then(function(response){
                        if(response){
                            return response
                        }else{
                            return caches.match('/fallback.json')
                        }
                    })
                })
            })
        )
    }

    
});
// >>


// Update Service Worker <<
self.addEventListener('activate', function(event) {

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
            cacheNames.filter(function(cacheName){
                return cacheName != CACHE_NAME;
            }).map(function(cacheName){
                return caches.delete(cacheName)
            })
            );
        })
    );
});
// >>