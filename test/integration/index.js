var assert = require('assert');

describe('basic', function () {

	it('map element exists', function () {

		return browser
			.url('/basic')
			.click('.gmaps-done')
			.pause(1500)
			.getElementSize('.sandbox').then(function ( size ) {
				assert.equal(size.width, 500);
				assert.equal(size.height, 500);
				return;
			})
			.getCssProperty('.sandbox', 'position').then(function ( prop ) {
				assert.equal(prop.value, 'relative');
				return;
			});

	});

});
