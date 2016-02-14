var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulp = require('gulp');


var files = ['./detectIOProps.js', './init.js'];

gulp.task('JS', function(){
  for(file in files) {
    var b = browserify(files[file]);

    b.bundle()
      .pipe(source(files[file]))
      .pipe(gulp.dest('./dist/'));
  }
});