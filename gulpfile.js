const gulp = require('gulp');
const rename_to = require('gulp-rename');
const run = require('gulp-run-command').default;
const {
    spawn
} = require('child_process');
const path = require('path');
const packager = require('electron-packager');
const packageJSON = require('./package.json');

const util = require('util');
const inquirer = require('inquirer');

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
            overwrite: true,
            name: packageJSON.name,
            appVersion: packageJSON.version,
            icon: path.join(process.cwd(), paths.resources, 'app-icon.ico'),
            dir: path.join(process.cwd(), paths.prebuild),
            electronVersion: packageJSON.devDependencies['electron'].replace(/[\^~><=]/gi, ''),
            platform: process.platform,
            arch: process.arch,
            out: path.join(process.cwd(), paths.releases),
            asar: true
        };

        console.log('');
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: 'Do you want to overwrite output directory?',
                default: settings.overwrite
            },
            {
                type: 'input',
                name: 'name',
                message: 'Enter your application name:',
                default: settings.name
            },
            {
                type: 'input',
                name: 'appVersion',
                message: 'Enter your application version:',
                default: settings.appVersion
            },
            {
                type: 'input',
                name: 'icon',
                message: 'Enter your application icon file:',
                default: settings.icon
            },
            {
                type: 'input',
                name: 'dir',
                message: 'Enter your application prebuild sources location:',
                default: settings.dir
            },
            {
                type: 'input',
                name: 'electronVersion',
                message: 'Enter version of Electron you wish to compile with:',
                default: settings.electronVersion
            },
            {
                type: 'checkbox',
                name: 'platform',
                message: 'Select platforms:',
                choices: ['all', 'linux', 'darwin', 'win32'].map(x => { return { value: x, checked: (x === settings.platform)} })
            },
            {
                type: 'checkbox',
                name: 'arch',
                message: 'Select architecture:',
                choices: ['all', 'ia32', 'x64', 'armv7l'].map(x => { return { value: x, checked: (x === settings.arch) } })
            },
            {
                type: 'input',
                name: 'out',
                message: 'Enter your application compiled output path:',
                default: settings.out
            },
            {
                type: 'confirm',
                name: 'asar',
                message: 'Do you wish to use Asar?',
                default: settings.asar
            },
        ]).then(answers => {
            const options = util._extend(settings, answers);

            options.arch = answers.arch.join(',')
            if (options.arch === '') {
                console.log(`No arch specified, defaulting to ${process.arch}`);
                options.arch = process.arch;
            }

            options.platform = answers.platform.join(',');
            if (options.platform === '') {
                console.log(`No platform specified, defaulting to ${process.platform}`);
                options.platform = process.platform;
            }

            if (options.arch && options.platform) {
                if ((options.platform.includes('darwin') || options.platform.includes('all')) && (options.arch.includes('ia32') || options.arch.includes('all')))
                    console.error('Sorry, building for darwin ia32 is not supported by Electron!');

                if (options.arch === 'armv7l' && options.platform !== 'linux')
                    console.error('Sorry, Electron only supports building Linux targets using the armv7l architecture!');
            }

            options.ignore = answers.out

            console.log('');
            console.log('Settings that are going to be used for compiling:');
            console.log(options);
            console.log('-------------------------------------------------');
            console.log('');
            console.log('Compiling...');

            packager(settings).then(appPath => {
                console.log('-------------------------------------------------');
                console.log('');
                console.log(`Application packaged successfully to '${appPath}'! Enjoy!`);
                console.log('');

                if (options.platform === 'win32') {
                    inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'create_installer',
                            message: 'Do you want to create windows installer?',
                            default: true
                        }
                    ]).then(conf => {
                        if (conf.create_installer) {
                            spawn('node', ['installer_scripts/createinstaller-win.js'], {
                                cwd: path.resolve(paths.prebuild, '..'),
                                stdio: 'inherit'
                            })
                            .on('close', () => {
                                console.log('-------------------------------------------------');
                                console.log('');
                                console.log('Installation of prepackaged electron dependancies - complete!');
                                console.log('');
                                resolve();
                            });
                        } else
                            resolve();
                    });
                } else
                    resolve();
            });
        });
    });
});

gulp.task('package_for_production', ['package_electron'], () => {
    console.log('');
    console.log('------------------------');
    console.log('Build process completed!');
    console.log('');
});
