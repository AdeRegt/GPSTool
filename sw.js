self.cacheName = "SandersGPS";

self.addEventListener('install', function (e) {
    e.waitUntil((async () => {
        await caches.open(self.cacheName).then(function (cache) {
            return cache.addAll([
                "https://gpstool.sanderslando.nl/index.html"
            ])
        });
    }));
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.open("SandersGPS").then(function(ct){
            return ct.match(e.request);
        });
        if (r) {
            return r;
        }
        const response = await fetch(e.request).catch(function(e){console.error(e);});
        if(response){
            await caches.open("SandersGPS").then(function(fetcher){
                return fetcher.put(e.request,response.clone());
            }).catch(function(e){console.error(e);});
        }
        return response;
    })());
});