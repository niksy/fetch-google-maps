'use strict';

const fn = require('../../../../index');
require('lie/polyfill');

function successCb ( Maps ) {

	const map = new Maps.Map(document.querySelector('.Sandbox'), {
		zoom: 8,
		center: new Maps.LatLng(-34.397, 150.644)
	});

	const marker = new Maps.Marker({
		map: map,
		position: new Maps.LatLng(-34.397, 150.644),
		visible: true
	});

	console.log('Done');
	console.log(Maps);

}

function errorCb ( err ) {
	console.log('Fail');
	console.log(err);
}

document.querySelector('.Action--success').addEventListener('click', () => {

	fn({
		apiKey: process.env.OSS_GOOGLE_API_KEY
	})
		.then(successCb)
		.catch(errorCb);

}, false);

document.querySelector('.Action--fail').addEventListener('click', () => {

	fn()
		.then(successCb)
		.catch(errorCb);

}, false);
