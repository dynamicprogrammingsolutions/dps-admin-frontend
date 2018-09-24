const gulp = require('gulp');
const watch = require('gulp-watch');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssvariables = require('postcss-css-variables');
const postcssclean = require('postcss-clean');
const postcssdiscarddublicates = require('postcss-discard-duplicates');
const cssimport = require('postcss-import');
const sass = require('gulp-sass');
const less = require('gulp-less');
const runSequence = require('run-sequence');

var sass_include_paths = ['node_modules/foundation-sites/scss'];

function postcss_pipe(pipe) {
    return pipe.pipe(postcss([cssimport,cssvariables({preserve:true}),postcssdiscarddublicates,postcssclean]))
        .pipe(gulp.dest('styles'))
}

gulp.task('postcss', function() {
    return postcss_pipe(gulp.src(['styles-dev/*.css']));
});


gulp.task('css', function(cb) {
    runSequence(['scss','less'],'postcss',cb);
})


gulp.task('watch_css', ['postcss'], function() {
    return postcss_pipe(watch('styles-dev/*.css')
        .on("data",function(file) {
            var date = new Date();
            console.log('watch_css',date.toLocaleString(),file.history[0].substr(file.cwd.length));
        })
    );
});

//reusable less pipe
function less_pipe(pipe) {
    return pipe
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("styles-dev"));
}

// Recompiling all less files
gulp.task('less', function() {
    return less_pipe(gulp.src('styles-dev/*.less'));
})

// If you are making changes in the root files, only those files will be recompiled
gulp.task('watch_less_root', ['less'], function() {
    return less_pipe(watch('styles-dev/*.less')
        .on("data",function(file) {
            var date = new Date();
            console.log('watch_less',date.toLocaleString(),file.history[0].substr(file.cwd.length));
        })
    );
});

// If you are making changes in the subdirectories, all the root files under styles-dev will be recompiled
gulp.task('watch_less_inc', function() {
    return watch(['styles-dev/*/**/*.less'])
        .on("data",function(file) {
            var date = new Date();
            console.log('watch_less_inc',date.toLocaleString(),file.history[0].substr(file.cwd.length));
            gulp.start('less');
        })
});

gulp.task('watch_less', function(cb) {
    runSequence(['watch_less_root','watch_less_inc'],cb);
})

// Similar structure than for less
function scsspipe(pipe) {
    return pipe
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: sass_include_paths
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("styles-dev"));
}

gulp.task('scss', function() {
    return scsspipe(gulp.src('styles-dev/*.scss'));
})

gulp.task('watch_scss_root', ['scss'], function() {
    return less_pipe(watch('styles-dev/*.less')
        .on("data",function(file) {
            var date = new Date();
            console.log('watch_less',date.toLocaleString(),file.history[0].substr(file.cwd.length));
        })
    );
});

gulp.task('watch_scss_inc', function() {
    return watch(['styles-dev/*/**/*.scss'])
        .on("data",function(file) {
            var date = new Date();
            console.log('watch_scss',date.toLocaleString(),file.history[0].substr(file.cwd.length));
            gulp.start('scss');
        })
});

gulp.task('watch_scss', function(cb) {
    runSequence(['watch_scss_root','watch_scss_inc'],cb);
})

