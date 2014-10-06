var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

var paths = {
  scripts: 'kif-parser.js',
  tests: 'spec/*.js'
};

gulp.task('test', function() {
  return gulp.src(paths.tests)
    .pipe(jasmine());
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['test']);
  gulp.watch(paths.tests, ['test']);
});

gulp.task('default', ['watch', 'test'], function() {
});
