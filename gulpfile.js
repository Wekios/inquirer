var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
// use ref is for concatenating js files into one main
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
// image minimzer
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');


// Path Variables
var SASS__ALL = 'development/scss/**/*.scss';
var CSS__MASTER = 'development/css';

// Development Tasks
// ----------------
// Browser Sync Task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'development'
    },
  })
})

// SASS Task
gulp.task('sass', function () {
  return gulp.src(SASS__ALL) // Gets all files ending with .scss in development/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(CSS__MASTER)) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
})

// Gulp Watch
gulp.task('watch', function () {
  gulp.watch('development/scss/**/*.scss', ['sass']);
  gulp.watch('development/*.html', browserSync.reload);
  gulp.watch('development/js/**/*.js', browserSync.reload);
});

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function () {
  return gulp.src('development/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('public_html'))
});

// Optimizing Images 
gulp.task('images', function () {
  return gulp.src('development/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
      // build a low-resolution version of the full-sized GIF picture on the screen while the file is still downloading
    })))
    .pipe(gulp.dest('public_html/images'))
});

// Copy Fonts 
gulp.task('fonts', function () {
  return gulp.src('development/fonts/**/*')
    .pipe(gulp.dest('public_html/fonts'))
})

// Cleaning 
gulp.task('clean', function () {
  return del.sync('public_html').then(function (cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:public_html', function () {
  return del.sync(['public_html/**/*', '!public_html/images', '!public_html/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function (callback) {
  runSequence(['sass', 'browserSync'], 'watch',
    callback
  )
})

gulp.task('build', function (callback) {
  runSequence(
    'clean:public_html',
    'sass',
    ['useref', 'images', 'fonts'],
    callback
  )
})