const cacheName = 'mapmaker';

const assets = [
	'./',

	'./manifest.json',

	'./img/tiles/mountain.png',
	'./img/bg/mapbase.png',
	'./img/bg/shield.png',
	'./img/tiles/cliff-tiles.png',
	'./img/tiles/ruin.png',
  './img/LOGO.png',

	'./css/main.css',
	'./css/normalize.css',

	'./js/mapmaker/mapmaker.mjs',
	'./js/mapmaker/SeedGenerator.mjs',

];

self.addEventListener( 'install', async function () {

	const cache = await caches.open( cacheName );

	assets.forEach( function ( asset ) {

		cache.add( asset ).catch( function () {

			console.warn( '[SW] Cound\'t cache:', asset );

		} );

	} );

} );

self.addEventListener( 'fetch', async function ( event ) {

	const request = event.request;
	event.respondWith( networkFirst( request ) );

} );

async function networkFirst( request ) {

	return fetch( request ).catch( async function () {

		const cachedResponse = await caches.match( request );

		if ( cachedResponse === undefined ) {

			console.warn( '[SW] Not cached:', request.url );

		}

		return cachedResponse;

	} );

}
