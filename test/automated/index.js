'use strict';

const assert = require('assert');
const fn = require('../../index');
require('lie/polyfill');

before(function () {
	var fixture = window.__html__['test/automated/fixtures/index.html'];
	document.body.insertAdjacentHTML('beforeend', `<div id="fixture">${fixture}</div>`);
});

after(function () {
	try {
		delete window.google;
	} catch ( e ) {
		window.google = null;
	}
	document.body.removeChild(document.getElementById('fixture'));
});

it('should reject if API key is undefined', function () {
	return fn()
		.catch(( err ) => {
			assert.equal(err instanceof Error, true);
		});
});

it('should have `google.maps` available on window', function () {

	return fn({
		apiKey: process.env.OSS_GOOGLE_API_KEY
	})
		.then(( maps ) => {
			assert.equal(typeof window.google.maps, 'object');
			assert.deepEqual(window.google.maps, maps);
		});

});

it('should create map instance', function () {

	this.timeout(5000);

	const el = document.querySelector('.Sandbox');

	return fn({
		apiKey: process.env.OSS_GOOGLE_API_KEY
	})
		.then(( Maps ) => {
			const map = new Maps.Map(el, {
				zoom: 8,
				center: new Maps.LatLng(-34.397, 150.644)
			});
			return map;
		})
		.then(( map ) => {
			return new Promise(( resolve ) => {
				setTimeout(() => {
					resolve(map);
				}, 1500);
			});
		})
		.then(() => {
			const style = window.getComputedStyle(el);
			assert.equal(style.getPropertyValue('position'), 'relative');
			assert.equal(el.firstChild.tagName, 'DIV');
		});

});
