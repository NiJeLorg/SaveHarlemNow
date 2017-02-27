'use strict';
const gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync').create(),
    path = require('path'),
    paths = {
        sass: 'app/sass/**/*.scss',
        pug: ['!app/shared/**', 'app/**/*.pug'],
        views: ['app/views/*.pug'],
        clientJS: 'public/js/**/*.js'
    };

gulp.task('pug-html', function() {
    gulp.src(paths.pug)
        .pipe(pug())
        .pipe(gulp.dest('public/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('pug-views', function() {
    gulp.src(paths.views)
        .pipe(pug())
        .pipe(gulp.dest('public/views/'))
        .pipe(browserSync.reload({ stream: true }));
});


gulp.task('sass-css', function() {
    gulp.src(paths.sass)
        .pipe(sass())
        .pipe(gulp.dest('public/css/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js-watch', function() {
    browserSync.reload();
});

gulp.task('nodemon', function() {
    nodemon({
            script: 'index.js',
            ignore: 'public/'
        })
        .on('restart', function() {
            console.log('>> node restart');
        });
});

gulp.task('watch-files', function() {
    gulp.watch(paths.pug, ['pug-html']);
    gulp.watch(paths.sass, ['sass-css']);
    gulp.watch(paths.clientJS, ['js-watch']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: 'localhost:8000'
    });
});

gulp.task('build', ['pug-html', 'sass-css', 'pug-views']);
gulp.task('default', ['build', 'nodemon', 'watch-files', 'browser-sync']);
