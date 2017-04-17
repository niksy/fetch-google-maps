/* eslint-disable max-params */

'use strict';

const qs = require('querystring');
const extend = require('xtend');
const load = require('little-loader');
const API_VERSION = 3;

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
module.exports = ( options ) => {

	options = options || {};

	return new Promise(( resolve, reject ) => {

		// Global callback name
		const callbackName = `__fetchGoogleMaps_${Date.now()}`;
		const version = options.version || API_VERSION;

		// Default Parameters
		let params = {
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

			window.google.load('maps', version, {
				'other_params': qs.stringify(params),
				callback: () => {
					internalResolve(resolve);
				}
			});

		// Last, try pure script loading technique to load the Google Maps API in async.
		} else {

			// URL params
			params = extend({
				v: version
			}, params, {
				callback: callbackName
			});

			// Declare the global callback
			window[callbackName] = () => {
				internalResolve(resolve);

				// Delete callback
				setTimeout(() => {
					try {
						delete window[callbackName];
					} catch ( e ) {
						window[callbackName] = null;
					}
				}, 20);
			};

			load(`//maps.googleapis.com/maps/api/js?${qs.stringify(params)}`, ( err ) => {
				if ( err ) {
					reject(err);
					return;
				}
			});

		}

	});

};
