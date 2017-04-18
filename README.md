# fetch-google-maps

[![Build Status][ci-img]][ci] [![BrowserStack Status][browserstack-img]][browserstack]

Load [Google Maps API][google-maps-api].

## Install

```sh
npm install fetch-google-maps --save
```

## Usage

```js
const fetchGoogleMaps = require('fetch-google-maps');

fetchGoogleMaps({
	apiKey: 'YOUR_GOOGLE_API_KEY',
	language: 'en',
	libraries: ['geometry']
}).then(( Maps ) => {
	const map = new Maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: new Maps.LatLng(-34.397, 150.644)
	});
});
```

## API

### fetchGoogleMaps(options)

Returns: `Promise`

#### options

Type: `Object`

##### apiKey

Type: `String`  
**Required**

[Google API key](https://developers.google.com/maps/documentation/javascript/get-api-key).

##### version

Type: `Number`  
Default: `3`

[Google Maps API version](https://developers.google.com/maps/documentation/javascript/versions).

##### language

Type: `String`  
Default: `'en'`

[Language](https://developers.google.com/maps/documentation/javascript/localization) for Google Maps UI.

##### libraries

Type: `String[]`

List of [Google Maps libraries](https://developers.google.com/maps/documentation/javascript/libraries) to load.

## Test

You need to have process variable `OSS_GOOGLE_API_KEY` set.

For local automated tests, run `npm run test:automated:local`.

For manual tests, run `npm run test:manual:local` and open <http://localhost:9000/> in your browser.

## Browser support

Tested in IE9+ and all modern browsers. Uses Promises so you need to apply [polyfill][promise-polyfill].

## Acknowledgments

* Wrapper around [basic Google Maps fetching][basic-google-maps-fetching].

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.org/niksy/fetch-google-maps
[ci-img]: https://travis-ci.org/niksy/fetch-google-maps.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=RGhpWUE4L2ZEeFlJK3c2MEczYmFmOVUzTExqY3VaVDFaVkZyZjRCbFBGUT0tLUJlRUhiajBpS1VGZFNFaU1XdVRKU2c9PQ==--d2f9e67e34833c7263b15c40b6e3a56ce5772cbd
[basic-google-maps-fetching]: https://gist.github.com/GFoley83/5953448
[promise-polyfill]: https://github.com/calvinmetcalf/lie
[google-maps-api]: https://developers.google.com/maps/documentation/javascript/tutorial
