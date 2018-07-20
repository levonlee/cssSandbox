var gulp = require('gulp'),
  gResponsive = require('gulp-responsive'),
  // https://github.com/mahnunchik/gulp-responsive
  gSvgSprite = require('gulp-svg-sprite'),
  gImageMin = require('gulp-imagemin');

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
        height: 15
        //rename: { suffix: '-square' },
      },
    }, {
      // Global configuration for all images
      quality: 100, // default 80. The output quality for JPEG, WebP and TIFF output formats
      progressive: true, // Use progressive (interlace) scan for JPEG and PNG output
      compressionLevel: 6, // default. Zlib compression level of PNG output format
      withMetadata: false, // default. Strip all metadata
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

gulp.task('img-resize-max-width', function () {
  // case sensitive
  return gulp.src('src/*.{jpg,png}')
    .pipe(gResponsive({
      '*': {
        width: 1440, /* Smartphone max physical pixels https://www.mydevice.io/ */
        height: 99999,
        max:true, //
        progressive: true
      },
    }, {
      errorOnEnlargement:false // skip error when final image is enlarged or shrunk
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

gulp.task('img-min', () => {
  gulp.src('src/*')
  .pipe(gImageMin(
    // [plugins], default is
    //[imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo()]

    // fine tune for lossless optimizers
    [
      gImageMin.gifsicle({interlaced: true}),
      gImageMin.jpegtran({progressive: true}),
      gImageMin.optipng({optimizationLevel: 5}),
      gImageMin.svgo() // default will move <style> to attributes and remove svg[id]
    ]
    ,{
      verbose:true // default false. Log for every image passed
    })
  )
  .pipe(gulp.dest('dist'));
});

gulp.task('svg-sprite', function() {
  // https://github.com/jkphl/svg-sprite#configuration-basics
  // https://github.com/jkphl/svg-sprite/blob/master/docs/configuration.md
  /*
   {
   dest: <String>, // Main output directory
   log: <String|Logger>, // Logging verbosity or custom logger, default null
   shape: <Object>, // SVG shape configuration
   svg: <Object>, // Common SVG options
   variables: <Object>, // Custom templating variables
   mode: <Object> // Output mode configurations
   }
   */
  var config = {
    /*
    shape: {
      //transform: ['svgo'], // default. already optimized
      transform: [{
        svgo: {
          plugins: [
            //{convertStyleToAttrs: true} // enable a plugin
            {inlineStyles: {onlyMatchedOnce: false}} // Since HTML5 has <style> stripped when svg file is not inline with HTML, we need to move styles to attributes
          ]
        }
      }]
      dimension: {
        maxWidth: 2000, // Max. shape width. default
        maxHeight: 2000, // Max. shape height. default
        precision: 2, // default
      }
     },
    */
    mode: {
      symbol: { // symbol mode to build the SVG
        // extra css/scss files are not needed because the example html for symbol mode is enough
        render: {
          css: false, // false to not generate CSS output option for icon sizing. {example:true}.
          scss: false // SCSS output option for icon sizing
        },
        dest: 'sprite', // destination folder combined with gulp.dest e.g. dist/sprite
        prefix: '.svg--%s', // BEM-style prefix if styles rendered. See dimensions
        // dimensions: '-dims', // combine with prefix, the css class is .svg--plus-dims. So that you can inline svg
        /*
         <svg class="svg--plus-dims">
           <use xlink:href="#plus"></use>
         </svg>
         */
        // or external
        /*
         <svg class="svg--plus-dims">
           <use xlink:href="sprite.svg#plus"></use>
         </svg>
         */
        // if source file is in a child folder in src e.g. src/a/minus.svg then
        // .svg--a--minus-dims sprite.svg#a--minus
        sprite: 'sprite.svg', //generated sprite name
        //bust:true, // add hash to sprite.svg e.g. sprite-88ac2671.svg
        example: true // e.g. dist/sprite/sprite.symbol.html
      }
    }
  };

  return gulp.src('**/*.svg', { cwd: 'src'})
    .pipe(gSvgSprite(config))
    .pipe(gulp.dest('dist'));
});

gulp.task('svg-sprite-css-inline', function() {
  var config = {
     shape: {
      transform: [{
        svgo: {
          plugins: [
            //{convertStyleToAttrs: true} // enable a plugin
            {inlineStyles: {onlyMatchedOnce: false}} // Since HTML5 has <style> stripped when svg file is not inline with HTML, we need to move styles to attributes
          ]
        }
      }],
     },
    mode: {
      symbol: { // symbol mode to build the SVG
        render: {
          css: false, // false to not generate CSS output option for icon sizing. {example:true}.
          scss: false // SCSS output option for icon sizing
        },
        dest: 'sprite', // destination folder combined with gulp.dest e.g. dist/sprite
        prefix: '.svg--%s', // BEM-style prefix if styles rendered. See dimensions
        sprite: 'sprite-css-inline.svg', //generated sprite name
        //bust:true, // add hash to sprite.svg e.g. sprite-88ac2671.svg
        example: { dest: 'sprite-css-inline.html' } // Build a sample page, please! e.g. dist/sprite/sprite.symbol.html
      }
    }
  };

  return gulp.src('**/*.svg', { cwd: 'src'})
    .pipe(gSvgSprite(config))
    .pipe(gulp.dest('dist'));
});

gulp.task('svg-sprite-no-style-tag', function() {
  var config = {
    shape: {
      id: { generator: 'icon-%s' }, // change shape ID's. Default shape ID is individual svg file name
      transform: [{
        svgo: {
          plugins: [
            {removeXMLProcInst: true}, // it seems xml header is not removed..
            {removeStyleElement: true}
          ]
        }
      }],
    },
    mode: {
      symbol: { // symbol mode to build the SVG
        render: {
          css: false, // false to not generate CSS output option for icon sizing. {example:true}.
          scss: false // SCSS output option for icon sizing
        },
        dest: 'sprite', // destination folder combined with gulp.dest e.g. dist/sprite
        prefix: '.svg--%s', // BEM-style prefix if styles rendered. See dimensions
        sprite: 'sprite-no-style-tag.svg', //generated sprite name
        //bust:true, // add hash to sprite.svg e.g. sprite-88ac2671.svg
        example: { dest: 'sprite-no-style-tag.html' } // Build a sample page, please! e.g. dist/sprite/sprite.symbol.html
      }
    }
  };

  return gulp.src('**/*.svg', { cwd: 'src'})
    .pipe(gSvgSprite(config))
    .pipe(gulp.dest('dist'));
});

gulp.task('svg-sprite-mode-view', function() {
  var config = {
    shape: {
      id: { generator: 'icon-%s' }, // change shape ID's. Default shape ID is individual svg file name
      transform: [{
        svgo: {
          plugins: [
            //{removeStyleElement: true}
          ]
        }
      }],
    },
    mode: {
      view: { // symbol mode to build the SVG
        // mode common properties
        render: {
          css: false, // false to not generate CSS output option for icon sizing. {example:true}.
          scss: false // SCSS output option for icon sizing
        },
        dest: 'sprite', // destination folder combined with gulp.dest e.g. dist/sprite
        prefix: '.svg--%s', // BEM-style prefix if styles rendered. See dimensions
        sprite: 'sprite-mode-view.svg', //generated sprite name
        //bust:true, // add hash to sprite.svg e.g. sprite-88ac2671.svg
        example: { dest: 'sprite-mode-view.html' } // Build a sample page, please! e.g. dist/sprite/sprite.symbol.html
      }
    }
  };

  return gulp.src('**/*.svg', { cwd: 'src'})
    .pipe(gSvgSprite(config))
    .pipe(gulp.dest('dist'));
});