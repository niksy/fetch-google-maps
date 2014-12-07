/* jshint maxparams:false */

var $ = require('jquery');
var now = $.now();
var dfd;

/**
 * Google Maps loader
 *
 * Ref. https://gist.github.com/GFoley83/5953448
 *
 * @param  {Number} version
 * @param  {String} apiKey
 * @param  {String} language
 * @param  {Array} libraries
 * @param  {String} sensor
 *
 * @return {Promise}
 */
function loadGoogleMaps ( version, apiKey, language, libraries, sensor ) {

	if (dfd) {
		return dfd.promise();
	}

	// Create a Deferred Object
	dfd = $.Deferred();

	// Global callback name
	var callbackName = 'loadGoogleMaps_' + (now++);

	// Default Parameters
	var params = {
		'sensor': sensor || 'false',
		'key': apiKey,
		'language': language,
		'libraries': libraries
	};

	// Declare a resolve function, pass google.maps for the done functions
	function resolve () {
		dfd.resolve(window.google && window.google.maps ? window.google.maps : false);
	}

	// If google.maps exists, then Google Maps API was probably loaded with the <script> tag
	if (window.google && window.google.maps) {
		resolve();

	// If the google.load method exists, lets load the Google Maps API in Async.
	} else if (window.google && window.google.load) {
		window.google.load('maps', version || 3, {
			'other_params': $.param(params),
			'callback': resolve
		});

	// Last, try pure jQuery AJAX technique to load the Google Maps API in Async.
	} else {

		// AJAX URL params
		params = $.extend(params, {
			'callback': callbackName
		});

		// Declare the global callback
		window[callbackName] = function () {
			resolve();

			// Delete callback
			setTimeout(function () {
				try {
					delete window[callbackName];
				} catch (e) {}
			}, 20);
		};

		// Can't use the jXHR promise because 'script' doesn't support 'callback=?'
		$.ajax({
			dataType: 'script',
			data: params,
			url: '//maps.googleapis.com/maps/api/js'
		});

	}

	return dfd.promise();

}

module.exports = loadGoogleMaps;
