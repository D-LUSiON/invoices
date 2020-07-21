const {
    app,
    ipcMain
} = require('electron');
const path = require('path');
const fs = require('fs-extra');
const ini = require('ini');
const knex = require('knex');
const environment = require('../environment');
const loadModule = require('../tools/load-module');
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
        this._loadGeneralTranslations();
        this._loadControllers();

        this._loadCurrentSettings();

        this.startListeners();
    }

    _loadGeneralTranslations() {
        this.moduleTranslations['_general'] = {};
        // FIXME: Test this when compiled
        const trn_path = path.resolve(environment.html_src, 'assets', 'i18n');
        if (fs.existsSync(trn_path) && fs.statSync(trn_path).isDirectory()) {
            fs.readdir(trn_path).then((dir) => {
                if (dir.length) {
                    dir.forEach(trn_file => {
                        if (trn_file.endsWith('.json'))
                            fs.readJSON(path.join(trn_path, trn_file), {
                                encoding: 'utf8',
                            }).then((translation) => {
                                this.moduleTranslations['_general'][trn_file.replace('.json', '')] = translation;
                            });
                    });
                }
            });
        }
    }

    _loadControllers() {
        const modules_path = path.resolve('resources', 'modules');
        console.log(`Looking for modules in: ${modules_path}...`);
        fs.readdir(modules_path).then((dir) => {
            console.log(`Modules found: ${dir.length}`);
            if (dir.length) {
                dir.forEach(entry => {
                    console.log(`Loading module: "${entry}"...`);
                    const mod_info = path.resolve(modules_path, entry, 'electron', 'package.json');
                    if (fs.existsSync(mod_info)) {
                        this.moduleControllers[entry] = {
                            info: fs.readJSONSync(mod_info),
                        };

                        if (this.moduleControllers[entry].info.main) {
                            const ctrl_path = path.resolve(modules_path, entry, 'electron', this.moduleControllers[entry].info.main);

                            if (fs.statSync(path.resolve(modules_path, entry)).isDirectory() && fs.existsSync(ctrl_path) && !fs.statSync(ctrl_path).isDirectory()) {
                                const Mod = loadModule(ctrl_path);
                                this.moduleControllers[entry].controller = new Mod(this.database);
                                console.info(`${entry.charAt(0).toUpperCase()}${entry.substr(1)} module initialized!`);
                            }
                        }
                    }

                    const trans_path = path.resolve(modules_path, entry, 'i18n');
                    this.moduleTranslations[entry] = {};
                    if (fs.existsSync(trans_path) && fs.statSync(trans_path).isDirectory()) {
                        fs.readdir(trans_path).then((trn_files) => {
                            if (trn_files.length) {
                                trn_files.forEach(trn_file => {
                                    if (trn_file.endsWith('.json'))
                                        fs.readJSON(path.join(trans_path, trn_file)).then(translation => {
                                            this.moduleTranslations[entry][trn_file.replace('.json', '')] = translation;
                                        });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    _initControllers() {
        Object.keys(this.moduleControllers).forEach(entry => {
            // TODO: Create method "init" in each module and execute it here
            console.info(`${entry.charAt(0).toUpperCase()}${entry.substr(1)} module initialized!`);
        });
    }

    _loadTranslations(module) {
        return new Promise((resolve, reject) => {
            if (module) {
                if (this.moduleTranslations[module])
                    resolve(this.moduleTranslations[module]);
                else
                    resolve({});
            } else {
                resolve(this.moduleTranslations);
            }
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

    startListeners() {
        ipcMain.on('translations:all', (event, args) => {
            this._loadTranslations(args && args.scope ? args.scope : null).then(result => {
                event.sender.send('translations:all:response', result);
            });
        });

        ipcMain.on('translations:langs:all', (event, args) => {
            this._getAvailableLanguages().then(result => {
                event.sender.send('translations:langs:all:response', result);
            });
        });

        ipcMain.on('file:get', (event, args) => {
            if (args instanceof Array)
                Promise.all(
                    args.map(file => fs.readFile(file, 'utf8'))
                ).then(result => {
                    event.sender.send('file:get:response', [...result]);
                });
            else
                fs.readFile(args, 'utf8').then(result => {
                    event.sender.send('file:get:response', result);
                });
        });

        ipcMain.on('module-info:get', (event) => {
            const result = Object.keys(this.moduleControllers).map(ctrl => this.moduleControllers[ctrl].info);
            result.forEach(mod => {
                delete mod.scripts;
                delete mod.main;
            });
            event.sender.send('module-info:get:response', result);
        });
    }

}

module.exports = DataExchange;
