var $ = require('jquery');
var loader = require('kist-loader');
var loadGoogleMaps = require('./src/load-google-maps');

/**
 * @param  {Object}   options
 * @param  {Function} cb
 *
 * @return {Promise}
 */
function loadGmaps ( options, cb ) {

	var dfd = $.Deferred();
	options = options || {};

	function success () {
		dfd.resolve.apply(window, arguments);
		if ( cb ) {
			cb.apply(window, arguments);
		}
		if ( options.success ) {
			options.success.apply(window, arguments);
		}
	}

	function err () {
		dfd.reject.apply(window, arguments);
		if ( options.error ) {
			options.error.apply(window, arguments);
		}
	}

	loadGoogleMaps(options.mapsVersion, options.apiKey, options.language, options.libraries, options.sensor)
		.done(function () {
			var args = [].slice.call(arguments);
			if ( options.plugins ) {
				loader
					.load(options.plugins)
					.done(function () {
						args.push([].slice.call(arguments));
						success.apply(window, args);
					})
					.fail(err);
			} else {
				success.apply(window, args);
			}
		})
		.fail(err);

	return dfd.promise();

}

module.exports = loadGmaps;
