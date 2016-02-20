var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulp = require('gulp');

var files = ['./src/injected_scripts/detectIOProps.js', './src/panel/scripts/init.js', './src/panel/scripts/devtool.js', './src/panel/scripts/parser.js'];

gulp.task('JS', function(){
  for(file in files) {
    var b = browserify(files[file]);

    b.bundle()
      .on('error', function(err) {
        console.log(err.message);
        this.emit('end');
      })
      .pipe(source(files[file])) 
      .pipe(gulp.dest('./src/dist/'));
  }
});

gulp.task('watch', function() {
  gulp.watch(files, ['JS']);
});