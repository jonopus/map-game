var
del = require('del'),
gulp = require('gulp'),
historyApiFallback = require('connect-history-api-fallback'),
connect = require('gulp-connect'),
concat = require('gulp-concat'),
watch = require('gulp-watch'),
less = require('gulp-less'),
transform = require('vinyl-transform'),
browserify = require('browserify'),
path = require('path');

var paths = {
	html: 'src/index.html',
	scripts: ['src/js/**/*.js'],
	app: ['src/js/App.js'],
	less: ['src/less/**/*.less'],
	build: 'build'
};

gulp.task('clean', function(cb) {
	del.sync([paths.build], cb);
});

gulp.task('html', function() {
	return gulp.src(paths.html)
	.pipe(gulp.dest(paths.build))
	.pipe(connect.reload());
});

gulp.task('scripts', function() {
	return gulp.src(paths.app)
	.pipe(transform(function(filename) {
		var b = browserify(filename);
		return b.bundle().on('error', function(err){
			// print the error (can replace with gulp-util)
			console.log(err.message);
			// end this stream
			this.emit('end');
		});
	}))
	.pipe(gulp.dest(paths.build + '/js'))
	.pipe(connect.reload());

});

gulp.task('less', function () {
	return gulp.src(paths.less)
	.pipe(less({
		paths: [ path.join(__dirname, 'less', 'includes') ]
	}))
	.pipe(concat('styles.css'))
	.pipe(gulp.dest(paths.build + '/css'))
	.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(paths.html, ['html']);
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.less, ['less']);
});

gulp.task('serve', function() {
	connect.server({
		root: paths.build,
		livereload: true,
		middleware: function(connect, opt) {
			return [historyApiFallback];
		}
	});
});

gulp.task('build', ['clean', 'scripts', 'less', 'html']);

gulp.task('default', ['build', 'serve', 'watch']);
