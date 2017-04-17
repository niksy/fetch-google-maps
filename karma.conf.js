/* globals process:false */
/* eslint-disable no-process-env */

'use strict';

module.exports = function ( config ) {

	config.set({
		basePath: '',
		frameworks: ['browserify', 'mocha'],
		files: [
			'test/automated/**/*.html',
			'test/automated/**/*.js'
		],
		exclude: [],
		preprocessors: {
			'test/automated/**/*.html': ['html2js'],
			'test/automated/**/*.js': ['browserify']
		},
		reporters: ['mocha', 'coverage'],
		port: 9001,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		browserStack: {
			startTunnel: true,
			project: 'fetch-google-maps',
			name: 'Automated (Karma)',
			build: 'Automated (Karma)'
		},
		client: {
			captureConsole: true,
			mocha: {
				ui: 'bdd'
			}
		},
		browserConsoleLogOptions: {
			level: 'log',
			format: '%b %T: %m',
			terminal: true
		},
		browserify: {
			debug: true,
			transform: [
				'babelify',
				['browserify-babel-istanbul', { defaultIgnore: true }],
				['envify', { OSS_GOOGLE_API_KEY: undefined }] // eslint-disable-line no-undefined
			]
		},
		coverageReporter: {
			reporters: [
				{
					type: 'html'
				},
				{
					type: 'text'
				}
			],
			check: {
				global: {
					statements: 80
				}
			}
		},
		customLaunchers: {
			'BS-Chrome': {
				base: 'BrowserStack',
				browser: 'Chrome',
				os: 'Windows',
				'os_version': '7',
				project: 'fetch-google-maps',
				build: 'Automated (Karma)',
				name: 'Chrome'
			},
			'BS-Firefox': {
				base: 'BrowserStack',
				browser: 'Firefox',
				os: 'Windows',
				'os_version': '7',
				project: 'fetch-google-maps',
				build: 'Automated (Karma)',
				name: 'Firefox'
			},
			'BS-IE9': {
				base: 'BrowserStack',
				browser: 'IE',
				'browser_version': '9',
				os: 'Windows',
				'os_version': '7',
				project: 'fetch-google-maps',
				build: 'Automated (Karma)',
				name: 'IE9'
			},
		},
		browsers: ['BS-Chrome', 'BS-Firefox', 'BS-IE9'],
		singleRun: true,
		concurrency: Infinity
	});

};
