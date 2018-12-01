const gulp = require('gulp');
const rename_to = require('gulp-rename');
const run = require('gulp-run-command').default;
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

gulp.task('create_build_for_packing', () => {
    const packed_folder = './packed';

    gulp
        .src(['./electron/**/*', '!./electron/env/**/*', '!./electron/env'])
        .pipe(gulp.dest(packed_folder + '/electron'))
        .on('error', (err) => {
            console.log('Error copying electron to production: ', err);
        });

    gulp
        .src('./electron/env/environment.prod.js')
        .pipe(rename_to('environment.js'))
        .pipe(gulp.dest(packed_folder + '/electron'))
        .on('error', (err) => {
            console.log('Error copying electron to production: ', err);
        });

    gulp
        .src('./package.json')
        .pipe(gulp.dest(packed_folder + ''))
        .on('error', (err) => {
            console.log('Error copying package.json to production: ', err);
        });
});

gulp.task('run_interacive_builder', () => {
    run('electron-packager-interactive');
});

gulp.task(
    'setup_electron_before', [
        'copy_prod_environment',
    ],
    run(['ng build --configuration=production', [
        `--output-path=./${require('./electron/environment').html_src}`,
    ].join(' ')].join(' '))
);

gulp.task(
    'setup_electron_after', [
        'copy_dev_environment'
    ]
);
