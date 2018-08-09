var ns = {};
ns.fromNetwork = (request, timeout) => {
	return new Promise((resolve, reject) => {
		var timeoutId = setTimeout(reject, timeout);

		fetch(request).then((response) => {
			clearTimeout(timeoutId);
			resolve(response);
		}, reject);

	});
}

var dataCacheName = 'weatherData-v1';
var cacheName = 'weatherPWA-final-1';

// Only GET request response can be cached using cache.addAll()
var filesToCache = [
	'./',
	'index.html', // /index.html ./index.html
	'scripts/app.js',
	'styles/inline.css',
	'images/clear.png',
	'images/cloudy-scattered-showers.png',
	'images/cloudy.png',
	'images/fog.png',
	'images/ic_add_white_24px.svg',
	'images/ic_refresh_white_24px.svg',
	'images/partly-cloudy.png',
	'images/rain.png',
	'images/scattered-showers.png',
	'images/sleet.png',
	'images/snow.png',
	'images/thunderstorm.png',
	'images/wind.png'
];

self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching app shell');
			return cache.addAll(filesToCache);

      // By default, fetching a resource from a third party URL will fail if it doesn't support CORS.
      // Turn array of strings to array of obj Request's. Won't be able to tell if the response was successful or not.
/*
			cache.addAll(
				urlsToPrefetch.map(function (urlToPrefetch) {
					return new Request(urlToPrefetch, {mode: 'no-cors'});
				})
			).then(function () {
				console.log('All resources have been fetched and cached.');
			});
*/

		})
	);
});

self.addEventListener('activate', function(e) {
	console.log('[ServiceWorker] Activate');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName && key !== dataCacheName) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
	return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
	//console.log('[Service Worker] Fetch');
	console.log('[Service Worker] Fetch', e.request.url);
	var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
	if (e.request.url.indexOf(dataUrl) > -1) {
		
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
		e.respondWith(
			caches.open(dataCacheName).then(function(cache) {
				return fetch(e.request).then(function(response){
					cache.put(e.request.url, response.clone());
					return response;
				});
			})
		);
	}
	else {
		// return cache if exists, otherwise network fetch without saving to cache
		// Things cached in caches API will have the cache response here. For things that are not added to caches API, they will be always downloaded but not added to caches.
		e.respondWith(
			caches.match(e.request).then( response => {
				return response || fetch(e.request);
      })
		);

	}

	// A few more caching strategies: https://jakearchibald.com/2014/offline-cookbook/

	// return cache if exists, else network fetch and save to cache
	if (1 == 0) {
		e.respondWith(
			caches.open(cacheName).then(function(cache) {
				return cache.match(e.request).then((response) => {
					return response ||
						fetch(e.request).then((response) => {
							cache.put(e.request, response.clone());
							return response;
						});
				})
			})
		);
	}

	// Similar to above, but save network fetch result to cache.
	// return cache if exists, else network fetch and save to cache and the cache is always refreshed
	if (1== 0) {
		e.respondWith(
			caches.open(cacheName).then(function (cache) {
				return cache.match(e.request).then((response) => {
					var fetchPromise = fetch(e.request).then((response) => {
						cache.put(e.request, response.clone());
						return response;
					});
					return response || fetchPromise;
				})
			})
		);
	}

	// Always network fetch. May take a long time to fail.
	// If fail, return the cache if exists.
	if (1 == 0) {
		e.respondWith(
			fetch(e.request).catch(() => {
				return caches.match(event.request);
			})
		);
	}

	// network fetch first, after 400ms no response, fetch from cache
	if (1==0) {
		e.respondWith(
			fromNetwork(e.request, 400)
				.catch( () => {
					return fromCache(e.request);
				})
		);
	}

	// To pass cookies in fetch()
  //fetch(url, { credentials: 'include' })

});
