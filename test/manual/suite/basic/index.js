var $ = require('jquery');
var fn = require('../../../../index.js');
require('lie/polyfill');

function successCb ( maps ) {

	var map = new maps.Map($('.sandbox')[0], {
		zoom: 8,
		center: new maps.LatLng(-34.397, 150.644)
	});

	var marker = new maps.Marker({
		map: map,
		position: new maps.LatLng(-34.397, 150.644),
		visible: true
	});

	console.log('Done');
	console.log(maps);

}

function errorCb ( err ) {
	console.log('Fail');
	console.log(err);
}

$('.gmaps-done').on('click', function () {

	fn({
		apiKey: process.env.OSS_GOOGLE_API_KEY
	})
		.then(successCb)
		.catch(errorCb);

});

$('.gmaps-fail').on('click', function () {

	fn()
		.then(successCb)
		.catch(errorCb);

});
