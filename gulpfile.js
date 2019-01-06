const gulp = require('gulp');
const rename_to = require('gulp-rename');
const run = require('gulp-run-command').default;
const {
    spawn
} = require('child_process');
const path = require('path');
const packager = require('electron-packager');
const packageJSON = require('./package.json');

const paths = {
    electron: './electron',
    prebuild: './prebuild',
    installer_scripts: './installer_scripts',
    releases: './releases',
    resources: './src/assets'
};

gulp.task('copy_dev_environment', () => {
    gulp
        .src(`${paths.electron}/env/environment.dev.js`)
        .pipe(rename_to('environment.js'))
        .pipe(gulp.dest(paths.electron))
        .on('error', (err) => {
            console.log('Error copying electron "dev" environment: ', err);
        });
});

gulp.task('copy_electron', () => {
    return gulp
        .src([
            `${paths.electron}/**/*`,
            `!${paths.electron}/node_modules/**/*`,
            `!${paths.electron}/node_modules`,
            `!${paths.electron}/env/**/*`,
            `!${paths.electron}/env`,
            `!${paths.electron}/environment.js`,
        ])
        .pipe(gulp.dest(paths.prebuild))
        .on('error', (err) => {
            console.log('Error copying electron files: ', err);
        });
});

gulp.task('copy_prod_environment', ['copy_electron'], () => {
    return gulp
        .src(`${paths.electron}/env/environment.prod.js`)
        .pipe(rename_to('environment.js'))
        .pipe(gulp.dest(paths.prebuild))
        .on('error', (err) => {
            console.log('Error copying electron "prod" environment: ', err);
        });
});

gulp.task('install_deps', ['copy_prod_environment'], () => {
    return new Promise((resolve) => {
        spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['install', '--save'], {
                cwd: paths.prebuild,
                stdio: 'inherit'
            })
            .on('close', () => {
                resolve();
                console.log('Installation of prepackaged electron dependancies - complete!');
            });
    });
});

gulp.task('copy_installer_scripts', ['install_deps'], () => {
    return gulp
        .src([
            `${paths.installer_scripts}/**/*`,
        ])
        .pipe(gulp.dest(`./${paths.prebuild}/${paths.installer_scripts.replace(/^\.\/+/, '')}`))
        .on('error', (err) => {
            console.log('Error copying electron files: ', err);
        });
});

gulp.task('package_electron', ['copy_installer_scripts'], () => {
    return new Promise((resolve) => {
        const settings = {
            dir: path.join(process.cwd(), paths.prebuild),
            name: packageJSON.name,
            platform: 'win32',
            arch: 'ia32',
            electronVersion: packageJSON.devDependencies['electron'].replace(/[\^~><=]/gi, ''),
            appVersion: packageJSON.version,
            icon: path.join(process.cwd(), paths.resources, 'app-icon.ico'),
            out: path.join(process.cwd(), paths.releases),
            overwrite: true,
            asar: false
        };

        console.log('');
        console.log('Settings, that are used for compiling:');
        console.log(settings);

        //TODO: Create interactive settings
        packager(settings).then(appPath => {
            console.log('');
            console.log(`Application packaged successfully to '${appPath}'`);
            console.log('');
            resolve();
        });
    });
});

gulp.task('package_for_production', ['package_electron'], () => {
    console.log('');
    console.log('------------------------');
    console.log('Build process completed!');
    console.log('');
});
