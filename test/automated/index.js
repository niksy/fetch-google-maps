var assert = require('assert');
var $ = require('jquery');
var fn = require('../../');
require('lie/polyfill');

describe('options', function () {

	after(function () {
		try {
			delete window.google;
		} catch ( e ) {
			window.google = null;
		}
	});

	it('throws if API key is undefined', function () {
		return fn()
			.catch(function ( err ) {
				assert.equal(err instanceof Error, true);
			});
	});

	it('throws if version lower than 3 is provided', function () {
		return fn({
			apiKey: 'foo',
			version: 2
		})
			.catch(function ( err ) {
				assert.equal(err instanceof Error, true);
			});
	});

});

describe('class', function () {

	after(function () {
		try {
			delete window.google;
		} catch ( e ) {
			window.google = null;
		}
	});

	it('google.maps is available', function () {

		return fn({
			apiKey: process.env.OSS_GOOGLE_API_KEY
		})
			.then(function ( maps ) {
				assert.equal(typeof window.google.maps, 'object');
				assert.deepEqual(window.google.maps, maps);
				return;
			});

	});

});

describe('map instance', function () {

	var html = document.getElementsByTagName('html')[0];

	before(function () {
		var fixture = window.__html__['test/automated/fixtures/index.html'];
		document.body.insertAdjacentHTML('beforeend', '<div id="fixture">' + fixture + '</div>');

		return fn({
			apiKey: process.env.OSS_GOOGLE_API_KEY
		})
			.then(function ( maps ) {
				var el = document.getElementById('map');
				var map = new maps.Map(el, {
					zoom: 8,
					center: new maps.LatLng(-34.397, 150.644)
				});
				return el;
			})
			.then(function ( el ) {
				return new Promise(function ( resolve ) {
					setTimeout(function () {
						resolve();
					}, 1500);
				});
			});

	});

	after(function () {
		document.body.removeChild(document.getElementById('fixture'));
		try {
			delete window.google;
		} catch ( e ) {
			window.google = null;
		}
	});

	this.timeout(5000);

	it('map element exists', function () {
		var $el = $('#map');
		assert.equal($el.css('position'), 'relative');
	});

});
