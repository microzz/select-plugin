var gulp = require('gulp');
var uglify = require('gulp-uglify');//压缩js
var babel = require('gulp-babel');

gulp.task('default', function () {
    return gulp.src('./s*.js')
    .pipe(babel({
           presets: ['es2015']
       }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));

});
