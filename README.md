# kist-loader-maps

Convenient Google Maps loader for [kist-loader](https://github.com/niksy/kist-loader), with some [starting code](https://gist.github.com/GFoley83/5953448) applied.

## Installation

```sh
npm install kist-loader-maps --save

bower install niksy/kist-loader-maps --save
```

## API

### `.loadGmaps(options, [success])`

#### options

Type: `Object`  
*Required*

##### apiKey

Type: `String`

Your project’s API key

##### plugins

Type: `String|Array`

Google Maps plugins such as Infobox.

##### language

Type: `String`

Language for Google Maps UI.

##### libraries

Type: `String`

Google Maps libraries such as Geometry

##### success

Type: `Function`

Callback after everything has been successfully loaded.

##### error

Type: `Function`

Callback if (some) resources haven’t successfully loaded.

#### success

Type: `Function`

Callback after everything has been successfully loaded.

## Examples

```js
var loadGmaps = require('kist-loader-maps');

loadGmaps({
	apiKey: 'YOUR_API_KEY',
	plugins: [ 'infobox.js', 'maplabel.js' ],
	language: 'en',
	libraries: 'geometry'
})
.done(function () {
	console.log( 'Google Maps loaded!' );
});
```

### AMD and global

```js
define(['kist-loader-maps'], cb);

window.$.kist.loader.loadGmaps;
```

## Browser support

Tested in IE8+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
