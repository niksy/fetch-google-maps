/*! kist-loader-maps 0.1.0 - Google Maps plugin for kist-loader. | Author: Ivan Nikolić <niksy5@gmail.com> (http://ivannikolic.com/), 2014 | License: MIT */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self);var f=o;f=f.jQuery||(f.jQuery={}),f=f.kist||(f.kist={}),f=f.loader||(f.loader={}),f.loadGmaps=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var loader = (typeof window !== "undefined" ? window.$.kist.loader : typeof global !== "undefined" ? global.$.kist.loader : null);
var loadGoogleMaps = require(2);

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
			var args = [].call(arguments);
			if ( options.plugins ) {
				loader
					.load(options.plugins)
					.done(function () {
						args.push([].call(arguments));
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
/* jshint maxparams:false */

var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});