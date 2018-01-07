const gulp = require('gulp');
const rename_to = require('gulp-rename');
const fs = require('fs');
const path = require('path');

gulp.task('copy_dev_environment', () => {
    gulp
        .src('./electron/env/environment.dev.js')
        .pipe(rename_to('environment.js'))
        .pipe(gulp.dest('./electron'))
        .on('error', (err) => {
            console.log('Error copying electron "dev" environment: ', err);
        });
});

gulp.task('copy_prod_environment', () => {
    gulp
        .src('./electron/env/environment.prod.js')
        .pipe(rename_to('environment.js'))
        .pipe(gulp.dest('./electron'))
        .on('error', (err) => {
            console.log('Error copying electron "prod" environment: ', err);
        });
});
