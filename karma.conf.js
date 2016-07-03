module.exports = function ( config ) {
	/* eslint-disable quote-props */

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
		reporters: ['mocha'],
		port: 9001,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		browserStack: {
			startTunnel: true,
			project: 'kist-loader-maps',
			name: 'Automated (Karma)'
		},
		client: {
			mocha: {
				ui: 'bdd'
			}
		},
		browserify: {
			transform: [
				'es3ify',
				['envify', { OSS_GOOGLE_API_KEY: undefined }] // eslint-disable-line no-undefined
			]
		},
		customLaunchers: {
			'BS-Chrome': {
				base: 'BrowserStack',
				browser: 'Chrome',
				os: 'Windows',
				'os_version': '7',
				project: 'kist-loader-maps',
				build: 'Automated (Karma)',
				name: 'Chrome'
			},
			'BS-Firefox': {
				base: 'BrowserStack',
				browser: 'Firefox',
				os: 'Windows',
				'os_version': '7',
				project: 'kist-loader-maps',
				build: 'Automated (Karma)',
				name: 'Firefox'
			},
			'BS-IE8': {
				base: 'BrowserStack',
				browser: 'IE',
				'browser_version': '8',
				os: 'Windows',
				'os_version': '7',
				project: 'kist-loader-maps',
				build: 'Automated (Karma)',
				name: 'IE8'
			}
		},
		browsers: ['BS-Chrome', 'BS-Firefox', 'BS-IE8'],
		singleRun: true,
		concurrency: Infinity
	});

};
