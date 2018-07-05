var gulp = require('gulp');
var gResponsive = require('gulp-responsive');
// https://github.com/mahnunchik/gulp-responsive

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
      /*
      '*.jpg': {
        // Resize all JPG images to 200 pixels wide
        width: 200,
      },
      '*.png': {
        // Resize all PNG images to 50% of original pixels wide
        width: '50%',
      },
      */
      // Resize all images to 100 pixels wide and add suffix -thumbnail
      '*': {
        rename: { suffix: '-square' },
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

function padLeft(nr, n, str){
  return Array(n-String(nr).length+1).join(str||'0')+nr;
}
gulp.task('rename-img-add-index', function () {
  var rename = require('gulp-rename');
  var index = 0;

  return gulp.src('src/*.{jpg,JPG}')
    .pipe(rename(function (path) {
      path.basename = '2018-' + padLeft(++index,3);
      path.extname = '.JPG';
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('img-resize-square', function () {
  // case sensitive
  return gulp.src('src/*.JPG')
    .pipe(gResponsive({
      '*': {
        width: 140,
        height: 140,
        format: 'jpeg' // specify output format
      },
    }, {
      quality: 100,
      progressive: true,
      withMetadata: false,
      //errorOnUnusedConfig: false, // don't emit error when a filter is not used
      //errorOnUnusedImage: false // don't emit error when an image is not used
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('img-convert-webp', function () {
  // case sensitive
  return gulp.src('src/*.png')
    .pipe(gResponsive({
      '*': {
        //width: 140, height: 140, // convert only
        // format: 'jpeg' // not needed as it follows rename: {extname}
        rename: {
          suffix: '-webp',
          extname: '.webp'
        }

      },
    }, {
      quality: 100, // default 80 for all formats
      //progressive: true, // for JPEG and PNG output only. default false
      // withMetadata: false, // default false
      //errorOnUnusedConfig: false, // don't emit error when a filter is not used
      //errorOnUnusedImage: false // don't emit error when an image is not used
    }))
    .pipe(gulp.dest('dist'));
});