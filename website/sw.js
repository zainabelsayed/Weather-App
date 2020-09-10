self.addEventListener('install',function(event){
    event.waitUntil(
        caches.open('/').then(function(cache){
            return cache.addAll([
                '/',
                'https://fonts.googleapis.com/css?family=Fira+Sans:900|Merriweather&display=swap',
                'site.webmanifest',
                'images/favicon-32x32.png',
                'index.html',
                'style.css',
                'app.js',
                'images/cloudy.png',
                'images/m-background-01.png'
            ])
        })
    )
})

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
   
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request)
      }).catch(function(error){
          console.log(error)
      })
    );
   });