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

    _loadControllers() {
        const modules_path = path.resolve('resources', 'modules');
        console.info(`Looking for modules in: ${modules_path}...`);
        fs.readdir(modules_path).then((dir) => {
            console.info(`Modules found: ${dir.length}`);
            if (dir.length) {
                dir.forEach(entry => {
                    console.info(`Loading module: "${entry}"...`);
                    const mod_info = path.resolve(modules_path, entry, 'electron', 'package.json');
                    if (fs.existsSync(mod_info)) {
                        this.moduleControllers[entry] = {
                            module_path: path.join(modules_path, entry),
                            info: fs.readJSONSync(mod_info),
                            translations: {}
                        };

                        if (this.moduleControllers[entry].info.main) {
                            const ctrl_path = path.resolve(modules_path, entry, 'electron', this.moduleControllers[entry].info.main);

                            if (fs.statSync(path.resolve(modules_path, entry)).isDirectory() && fs.existsSync(ctrl_path) && !fs.statSync(ctrl_path).isDirectory()) {
                                const Mod = loadModule(ctrl_path);
                                this.moduleControllers[entry].controller = new Mod(this.database);
                            }
                        } else {
                            console.error(`Module "${entry}" entry point doesn't exist! Please, define it in module package.json "main" key!`);
                        }
                    }
                });
            }
        }).then(() => {
            this._checkDatabases()
                .then(() => this._loadTranslations())
                .then(() => {
                    this._initControllers();
                });
        });
    }

    async _checkDatabases() {
        const controllers = Object.keys(this.moduleControllers);
        for (let idx = 0; idx < controllers.length; idx++) {
            const key = controllers[idx];
            console.info(`Checking DB for ${key}...`);
            await this.moduleControllers[key].controller.checkDBCreated();
        }
    }

    _initControllers() {
        Object.keys(this.moduleControllers).forEach(entry => {
            this.moduleControllers[entry].controller.init();
            console.info(`${entry.charAt(0).toUpperCase()}${entry.substr(1)} module initialized!`);
        });
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

    _loadTranslations() {
        return new Promise((resolve, reject) => {
            Object.keys(this.moduleControllers).forEach((module, idx, all_keys) => {
                const trans_path = path.resolve(this.moduleControllers[module].module_path, 'i18n');
                this.moduleControllers[module].translations = {};
                if (fs.existsSync(trans_path) && fs.statSync(trans_path).isDirectory()) {
                    fs.readdir(trans_path).then((trn_files) => {
                        if (trn_files.length) {
                            trn_files.forEach(trn_file => {
                                if (trn_file.endsWith('.json')) {
                                    console.info(`Loading translations file ${trn_file} for ${module}...`);
                                    fs.readJSON(path.join(trans_path, trn_file)).then(translation => {
                                        this.moduleControllers[module].translations[trn_file.replace('.json', '')] = translation;
                                        if (idx === all_keys.length - 1)
                                            resolve();
                                    });
                                }
                            });
                        }
                    });
                } else {
                    if (idx === all_keys.length - 1)
                        resolve();
                }
            });
        });
    }

    _resolveTranslations(module) {
        return new Promise((resolve, reject) => {
            if (module) {
                if (this.moduleControllers[module] && this.moduleControllers[module].translations)
                    resolve(this.moduleControllers[module].translations);
                else
                    resolve({});
            } else {
                const translations = {};
                translations['_general'] = { ...this.moduleTranslations['_general'] };
                Object.keys(this.moduleControllers).forEach(module => {
                    translations[module] = this.moduleControllers[module].translations;
                });
                resolve(translations);
            }
        });
    }

    _getAvailableLanguages() {
        return new Promise((resolve, reject) => {
            let langs = [];
            Object.keys(this.moduleControllers).forEach(module => {
                langs = [...langs, ...Object.keys(this.moduleControllers[module].translations || {})];
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
            this._resolveTranslations(args && args.scope ? args.scope : null).then(result => {
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
