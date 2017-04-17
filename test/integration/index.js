'use strict';

const assert = require('assert');

describe('fetch-google-maps', function () {

	it('should have map element', function () {

		return browser
			.url('/basic')
			.click('.Action--success')
			.pause(5000)
			.getElementSize('.Sandbox--success')
				.then(( size ) => {
					assert.equal(size.width, 500);
					assert.equal(size.height, 500);
				})
			.getCssProperty('.Sandbox--success', 'position')
				.then(( prop ) => {
					assert.equal(prop.value, 'relative');
				});

	});

});
