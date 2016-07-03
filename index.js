/* eslint-disable max-params */

var qs = require('querystring');
var now = require('date-now');
var extend = require('xtend');
var load = require('little-loader');

/**
 * Declare internal resolve function, pass google.maps for the Promise resolve
 *
 * @param  {Function} resolve
 */
function internalResolve ( resolve ) {
	resolve(window.google && window.google.maps ? window.google.maps : false);
}

/**
 * @param  {Object} options
 * @param  {String} options.apiKey
 * @param  {String} options.language
 * @param  {String[]} options.libraries
 *
 * @return {Promise}
 */
module.exports = function ( options ) {

	options = options || {};

	return new Promise(function ( resolve, reject ) {

		// Global callback name
		var callbackName = '__kistLoaderMaps_' + now();

		// Default Parameters
		var params = {
			key: options.apiKey,
			language: options.language || 'en',
			libraries: (options.libraries || []).join(',')
		};

		if ( typeof options.apiKey === 'undefined' ) {
			throw new Error('Google Maps API key is not provided.');
		}

		// If google.maps exists, then Google Maps API was probably loaded with the <script> tag
		if ( window.google && window.google.maps ) {
			internalResolve(resolve);

		// If the google.load method exists, lets load the Google Maps API in Async.
		} else if ( window.google && window.google.load ) {
			window.google.load('maps', 3, {
				'other_params': qs.stringify(params),
				callback: function () {
					internalResolve(resolve);
				}
			});

		// Last, try pure script loading technique to load the Google Maps API in async.
		} else {

			// URL params
			params = extend({}, params, {
				v: 3,
				callback: callbackName
			});

			// Declare the global callback
			window[callbackName] = function () {
				internalResolve(resolve);

				// Delete callback
				setTimeout(function () {
					try {
						delete window[callbackName];
					} catch ( e ) {
						window[callbackName] = null;
					}
				}, 20);
			};

			load('//maps.googleapis.com/maps/api/js?' + qs.stringify(params), function ( err ) {
				if ( err ) {
					reject(err);
					return;
				}
			});

		}

	});

};
