gulp.task('autoprefixer', function () {
  var postcss = require('gulp-postcss');
  var sourcemaps = require('gulp-sourcemaps');
  var rename = require('gulp-rename');
  var autoprefixer = require('autoprefixer');

  return gulp.src('*-gulp.css', {base: '.'})
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(rename(function (path) {
      path.basename += '-build';
    }))
    .pipe(gulp.dest('.'));
});