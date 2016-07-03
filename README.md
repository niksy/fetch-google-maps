# kist-loader-maps

[![Build Status][ci-img]][ci] [![Browserstack][browserstack-img]][browserstack]

Simple maps loader. Wrapper around [basic Google Maps fetching][basic-google-maps-fetching].

## Install

```sh
npm install kist-loader-maps --save
```

## Usage

```js
var loadMaps = require('kist-loader-maps');

loadMaps({
	apiKey: 'YOUR_API_KEY',
	language: 'en',
	libraries: 'geometry'
}).then(function ( maps ) {
	var map = new maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: new maps.LatLng(-34.397, 150.644)
	});
});
```

## API

### loadMaps(options)

Returns: `Promise`

#### options

Type: `Object`

##### apiKey

Type: `String`  
**Required**

Your project’s [Google API key](https://developers.google.com/maps/documentation/javascript/get-api-key).

##### language

Type: `String`  
Default value: `en`

[Language](https://developers.google.com/maps/documentation/javascript/localization) for Google Maps UI.

##### libraries

Type: `String[]`

List of [Google Maps libraries](https://developers.google.com/maps/documentation/javascript/libraries) to load.

## Test

For manual tests, run `npm test -- --watch` and open <http://localhost:9000/> in your browser.

## Browser support

Tested in IE8+ and all modern browsers.

Uses Promises so you need to apply [polyfill][promise-polyfill].

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.org/niksy/kist-loader-maps
[ci-img]: https://img.shields.io/travis/niksy/kist-loader-maps.svg
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://cdn.rawgit.com/niksy/c73069b66d20e2e0005dc8479c125fbd/raw/f644159e3f5f07291f98f59a44146735e9962e0d/browserstack.svg
[basic-google-maps-fetching]: https://gist.github.com/GFoley83/5953448
[promise-polyfill]: https://github.com/calvinmetcalf/lie
