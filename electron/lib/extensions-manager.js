const fs = require('fs-extra');
const path = require('path');
const electron = require('electron');
const {
    app,
    ipcMain
} = electron;

const env = require('../environment');
const APP_USER_DATA_PATH = app.getPath('userData');
const EXT_CONF_PATH = env.production ? path.join(APP_USER_DATA_PATH, 'extensions-config.json') : path.resolve('www', 'assets', 'extensions-config.json');
const EXT_PATH = env.production ? path.join(APP_USER_DATA_PATH, 'extensions') : path.resolve('www', 'assets', 'extensions');

class ExtensionsManager {

    constructor() {
        this.extensions = [];
        this.syncExtensions();
        ipcMain.on('extensions:get', (event) => {
            this.getConfig().then(contents => {
                event.sender.send('extensions:get:response', contents);
            });
        });
    }

    syncExtensions() {
        // TODO: Copy all extensions from /www/assets/extensions to userData folder
        return new Promise((resolve, reject) => {
            if (fs.existsSync(path.resolve('www', 'assets', 'extensions')))
                fs.copy(path.resolve('www', 'assets', 'extensions'), path.join(APP_USER_DATA_PATH, 'extensions')).then(() => {
                    console.log(`Extensions copied (${path.resolve('www', 'assets', 'extensions')} -> ${path.join(APP_USER_DATA_PATH, 'extensions')})!`);
                    resolve();
                });
            else
                resolve();
        });
    }

    getAllExtensions() {
        return new Promise((resolve, reject) => {
            // const ext_path = env.production ? path.join(APP_USER_DATA_PATH, 'extensions') : path.resolve('www', 'assets', 'extensions');
            fs.readdir(EXT_PATH).then((files) => {
                this.extensions = files.map(file => path.join(EXT_PATH, file)).filter(file => file.match(/\.js$/));
                resolve(this.extensions);
            });
        });
    }

    getConfig() {
        return new Promise((resolve, reject) => {
            // const EXT_CONF_PATH = `${env.production ? path.join(APP_USER_DATA_PATH, 'extensions-config.json') : path.resolve('www', 'assets', 'extensions-config.json')}`;
            if (fs.existsSync(EXT_CONF_PATH))
                fs.readFile(EXT_CONF_PATH).then(contents => {
                    try {
                        this.extensions_config = JSON.parse(contents);
                        Object.entries(this.extensions_config).forEach(([key, value]) => {
                            const ext_path = path.join(EXT_PATH, `${value['name']}.js`);
                            if (fs.existsSync(ext_path))
                                this.extensions_config[key].path = ext_path;
                        });

                        resolve(this.extensions_config);
                    } catch (error) {
                        resolve({});
                    }
                });
            else
                resolve({});
        });
    }
}

module.exports = ExtensionsManager;
