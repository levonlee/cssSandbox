/**
 * Configuration.
 *
 * Project Configuration for gulp tasks.
 *
 * In paths you can add <<glob or array of globs>>. Edit the variables as per your project requirements.
 */

module.exports = {

  // gulp-sass
  outputStyle: 'compact', // Available options → 'compact' or 'compressed' or 'nested' or 'expanded'
  errLogToConsole: true,
  precision: 10,

  // gulp-uglifycss
  maxLineLen: 10, // ditch because it causes final .css have errors e.g. break at @support conditional operators `or`

  // JS Vendor options.
  jsVendorSRC: [
    './assets/js/vendor/*.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/popper.js/dist/umd/popper.js',
    'node_modules/owl.carousel/dist/owl.carousel.js'
  ], // Path to JS vendor folder.
  jsVendorDestination: './assets/js/', // Path to place the compiled JS vendors file.
  jsVendorFile: 'vendors', // Compiled JS vendors file name. Default set to vendors i.e. vendors.js.

  // Browsers you care about for autoprefixing. Browserlist https://github.com/ai/browserslist
  BROWSERS_LIST: [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
  ]

};
