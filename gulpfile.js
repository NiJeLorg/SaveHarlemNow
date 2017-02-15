'use strict';
const gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync').create(),
    path = require('path'),
    paths = {
        sass: 'app/sass/**/*.scss',
        pug: ['!app/shared/**', 'app/**/*.pug']
    };

gulp.task('pug-html', function() {
    gulp.src(paths.pug)
        .pipe(pug())
        .pipe(gulp.dest('public/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass-css', function() {
    gulp.src(paths.sass)
        .pipe(sass())
        .pipe(gulp.dest('public/css/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('nodemon', function() {
    nodemon({
            script: 'index.js'
        })
        .on('restart', function() {
            console.log('>> node restart');
        });
});

gulp.task('watch-files', function() {
    gulp.watch(paths.pug, ['pug-html']);
    gulp.watch(paths.sass, ['sass-css']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: 'localhost:8000'
    });
});

gulp.task('build', ['pug-html', 'sass-css']);
gulp.task('default', ['build', 'nodemon', 'watch-files', 'browser-sync']);
