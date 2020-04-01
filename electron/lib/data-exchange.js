const {
    app,
    ipcMain
} = require('electron');
const path = require('path');
const fs = require('fs-extra');
const http = require('http');
const ini = require('ini');
const readline = require('readline');
const requireJSON = require('./require-json');
const package_json = requireJSON(path.resolve('package.json'));
const knex = require('knex');

const DEFAULT_SETTINGS = {};

class DataExchange {

    constructor(el_app) {
        this.USER_DATA = el_app.getPath('userData');
        this.settings_ini_path = path.join(this.USER_DATA, 'settings.ini');

        this.moduleControllers = {};
        this.moduleTranslations = {};

        this.database = knex({
            client: 'sqlite3',
            connection: {
                filename: path.join(app.getPath('userData'), 'database.sqlite')
            },
            useNullAsDefault: true,
            // debug: true
        });

        this._loadControllers();

        this._loadCurrentSettings();

        this.getTranslations();
        this.getTranslationLangs();

        this.getSettingsAll();
        this.getDefaultSettings();
        this.saveSettings();
    }

    _loadControllers() {
        const modules_path = path.resolve('resources', 'modules');
        fs.readdir(modules_path).then((dir) => {
            if (dir.length) {
                dir.forEach(entry => {
                    const ctrl_path = path.resolve(modules_path, entry, 'electron', 'data-controller.js');
                    if (fs.statSync(path.resolve(modules_path, entry)).isDirectory() && fs.existsSync(ctrl_path)) {
                        const Mod = require(ctrl_path);
                        this.moduleControllers[entry] = new Mod(this.database);
                    }

                    const trans_path = path.resolve(modules_path, entry, 'i18n');
                    this.moduleTranslations[entry] = {};
                    if (fs.existsSync(trans_path) && fs.statSync(trans_path).isDirectory()) {
                        console.log(`Reading ${trans_path} translations...`);
                        fs.readdir(trans_path).then((trn_files) => {
                            console.log(`Found translations for module "${entry}":`, trn_files);
                            if (trn_files.length) {
                                trn_files.forEach(trn_file => {
                                    if (trn_file.endsWith('.json'))
                                        requireJSON(path.join(trans_path, trn_file)).then(translation => {
                                            this.moduleTranslations[entry][trn_file.replace('.json', '')] = translation;
                                        });
                                });
                            }
                        });
                    }
                    // if (entry.endsWith('.js')) {
                    //     const mod_path = path.resolve(modules_path, entry);
                    //     if (fs.existsSync(mod_path)) {
                    //         const Mod = require(mod_path);
                    //         this.moduleControllers[entry] = new Mod(this.database);
                    //     }
                    // }
                });

            }
        });
    }

    _loadTranslations(module) {
        return new Promise((resolve, reject) => {
            if (this.moduleTranslations[module])
                resolve(this.moduleTranslations[module]);
            else
                resolve({});
        });
    }

    _getAvailableLanguages() {
        return new Promise((resolve, reject) => {
            let langs = [];
            Object.keys(this.moduleTranslations).forEach(mod => {
                langs = [...langs, ...Object.keys(this.moduleTranslations[mod])];
            });
            resolve([...new Set(langs)]);
        });
    }

    _loadCurrentSettings() {
        return new Promise((resolve, reject) => {
            if (!this.settings) this.settings = { ...DEFAULT_SETTINGS };
            if (!fs.existsSync(this.settings_ini_path))
                fs.writeFileSync(this.settings_ini_path, ini.stringify(this.settings), { encoding: 'utf-8' });

            fs.readFile(this.settings_ini_path, { encoding: 'utf-8' }, (err, sett_ini_file) => {
                const sett_ini_parsed = ini.parse(sett_ini_file, 'utf-8');
                Object.keys(sett_ini_parsed).forEach(key => {
                    if (!isNaN(sett_ini_parsed[key]) && !['true', 'false'].includes((sett_ini_parsed[key] || '').toString()))
                        this.settings[key] = +sett_ini_parsed[key];
                    else
                        this.settings[key] = sett_ini_parsed[key];
                });
                resolve(this.settings);
            });
        });
    }

    getTranslations() {
        ipcMain.on('translations:all', (event, args) => {
            this._loadTranslations(args.scope).then(result => {
                event.sender.send('translations:all:response', result);
            });
        });
    }

    getTranslationLangs() {
        ipcMain.on('translations:langs:all', (event, args) => {
            this._getAvailableLanguages().then(result => {
                event.sender.send('translations:langs:all:response', result);
            });
        });
    }

    getSettingsAll() {
        // ipcMain.on('settings:all', (event, args) => {
        //     this._loadCurrentSettings().then(() => {
        //         const settings = { ...this.settings };
        //         if (settings.sender && settings.sender.pasword)
        //             delete settings.sender.pasword;
        //         event.sender.send('settings:all:response', {
        //             ...settings,
        //             ...{
        //                 cwd: process.cwd(),
        //                 app_name: app.name,
        //                 userData: app.getPath('userData'),
        //                 version: package_json.version
        //             }
        //         });
        //     });
        // });
    }

    getDefaultSettings() {
        // ipcMain.on('settings:all', (event, args) => {
        //     event.sender.send('settings:default:all:response', DEFAULT_SETTINGS);
        // });
    }

    saveSettings() {
        // ipcMain.on('settings:save', (event, args) => {
        //     fs.writeFile(this.settings_ini_path, ini.stringify(args), { encoding: 'utf-8' });
        //     this._loadCurrentSettings().then(() => {
        //         event.sender.send('settings:save:response', {
        //             ...this.settings,
        //             ...{
        //                 cwd: process.cwd(),
        //                 app_name: app.name,
        //                 userData: app.getPath('userData'),
        //                 version: package_json.version
        //             }
        //         });
        //     });
        // });
    }

}

module.exports = DataExchange;
