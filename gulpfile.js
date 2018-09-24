const gulp = require('gulp');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssvariables = require('postcss-css-variables');
const postcssclean = require('postcss-clean');
const postcssdiscarddublicates = require('postcss-discard-duplicates');
const cssimport = require('postcss-import');
const sass = require('gulp-sass');

var sass_include_paths = ['node_modules/foundation-sites/scss'];

function postcss_pipe(pipe) {
    return pipe.pipe(postcss([cssimport,cssvariables({preserve:true}),postcssdiscarddublicates,postcssclean]))
        .pipe(gulp.dest('styles'))
}

gulp.task('postcss', function() {
    return postcss_pipe(gulp.src(['styles-dev/*.css']));
});

function scss() {
    return gulp.src('styles-dev/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: sass_include_paths
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("styles-dev"));
}

gulp.task('scss', function() {
    return scss();
})

gulp.task('watch_scss', ['scss'], function() {
    return watch(['styles-dev/**/*.scss'])
        .on("data",function(file) {
            var date = new Date();
            console.log('watch_scss',date.toLocaleString(),file.history[0].substr(file.cwd.length));
            gulp.start('scss');
        })
});

gulp.task('watch_css', ['postcss'], function() {
    return postcss_pipe(watch('styles-dev/*.css')
        .on("data",function(file) {
            var date = new Date();
            console.log('watch_css',date.toLocaleString(),file.history[0].substr(file.cwd.length));
        })
    );
});

