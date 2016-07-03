var path = require('path');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var nunjucks = require('gulp-nunjucks-render');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var del = require('del');
var ws = require('local-web-server');
var opn = require('opn');
var minimist = require('minimist');
var globby = require('globby');
var es = require('event-stream');

var args = minimist(process.argv.slice(2), {
	'default': {
		watch: false,
		port: 9000
	}
});
var watch = args.watch;
var port = args.port;

gulp.task('test:cleanup', function () {
	return del([
		'./test-dist'
	]);
});

gulp.task('test:markup', ['test:cleanup'], function () {
	function bundle () {
		return gulp.src('./test/manual/suite/**/*.html')
				.pipe(nunjucks())
				.pipe(gulp.dest('./test-dist'))
				.pipe(debug({ title: 'Markup:' }));
	}
	if ( watch ) {
		gulp.watch(['./test/manual/suite/**/*.html'], bundle);
	}
	return bundle();
});

gulp.task('test:style', ['test:cleanup'], function () {
	function bundle () {
		return gulp.src('./test/manual/assets/**/*.css')
				.pipe(gulp.dest('./test-dist/assets'))
				.pipe(debug({ title: 'Style:' }));
	}
	if ( watch ) {
		gulp.watch(['./test/manual/assets/**/*.css'], bundle);
	}
	return bundle();
});

gulp.task('test:script', ['test:cleanup'], function ( done ) {

	globby(['./test/manual/suite/**/*.js'])
		.then(function ( files ) {

			function handleError ( msg ) {
				gutil.log(gutil.colors.red(msg.message));
				this.emit('end');
			}

			function task ( file ) {

				var b = browserify({
					entries: [file],
					debug: true,
					cache: {},
					packageCache: {}
				});
				b.transform('es3ify');
				b.transform('envify', {
					OSS_GOOGLE_API_KEY: undefined // eslint-disable-line no-undefined
				});
				if ( watch ) {
					b.plugin(watchify);
				}

				function bundle () {
					return b.bundle()
						.on('error', handleError)
						.pipe(plumber(handleError))
						.pipe(source(path.basename(file)))
						.pipe(buffer())
						.pipe(sourcemaps.init({
							loadMaps: true
						}))
						.pipe(sourcemaps.write())
						.pipe(plumber.stop())
						.pipe(gulp.dest(path.join('./test-dist', path.dirname(file).split(path.sep).pop())));
				}

				if ( watch ) {
					b.on('update', function () {
						bundle()
							.pipe(debug({ title: 'Script:' }));
					});
					b.on('log', gutil.log);
				}

				return bundle();

			}

			if ( files.length ) {
				es.merge(files.map(task))
					.pipe(debug({ title: 'Script:' }))
					.on('data', function () {})
					.on('end', done);
			} else {
				done();
			}

			return files;

		})
		.catch(function ( err ) {
			done(err);
		});

});

gulp.task('test:prepare', ['test:cleanup', 'test:markup', 'test:style', 'test:script']);

gulp.task('test:local:manual', ['test:prepare'], function () {
	if ( watch ) {
		ws({
			'static': {
				root: './test-dist'
			},
			serveIndex: {
				path: './test-dist'
			}
		}).listen(port);
		opn('http://localhost:' + port);
	}
});