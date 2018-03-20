var gulp = require('gulp');
var gResponsive = require('gulp-responsive');

gulp.task('autoprefixer', function () {
  var postcss = require('gulp-postcss');
  var sourcemaps = require('gulp-sourcemaps');
  var rename = require('gulp-rename');
  var autoprefixer = require('autoprefixer');

  return gulp.src('**/*-gulp.css', {base: '.'})
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(rename(function (path) {
      path.basename += '-build';
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('img-resize', function () {
  return gulp.src('src/*.{jpg,png}')
    .pipe(gResponsive({
      '*.jpg': {
        // Resize all JPG images to 200 pixels wide
        width: 200,
      },
      '*.png': {
        // Resize all PNG images to 50% of original pixels wide
        width: '50%',
      },
      // Resize all images to 100 pixels wide and add suffix -thumbnail
      '*': {
        width: 100,
        rename: { suffix: '-thumbnail' },
      },
    }, {
      // Global configuration for all images
      // The output quality for JPEG, WebP and TIFF output formats
      quality: 70,
      // Use progressive (interlace) scan for JPEG and PNG output
      progressive: true,
      // Zlib compression level of PNG output format
      compressionLevel: 6,
      // Strip all metadata
      withMetadata: false,
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('img-responsive', function () {
  return gulp.src('src/*.{jpg,png}')
    .pipe(gResponsive({
      // Resize all JPG images to three different sizes: 200, 500, and 630 pixels
      '*.jpg': [{
        width: 70,
        rename: { suffix: '-70s' },
      }, {
        width: 70 * 2,
        rename: { suffix: '-70s@2x' },
      }],
      // a weird bug. If the filter matches nothing, it will return an error
      // and causes the previous filter's last resizing result nothing
      // Resize all PNG images to be retina ready
      /*
      '*.png': [{
        width: 250,
      }, {
        width: 250 * 2,
        rename: { suffix: '@2x' },
      }],

      '*.jpg': [{
        // either one of width or rename can be ignored
      }],
      */
    }, {
      // Global configuration for all images
      // The output quality for JPEG, WebP and TIFF output formats
      quality: 100,
      // Use progressive (interlace) scan for JPEG and PNG output
      progressive: true,
      // Strip all metadata
      withMetadata: false,
    }))
    .pipe(gulp.dest('dist'));
});