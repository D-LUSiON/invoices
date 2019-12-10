const fs = require('fs-extra');
const path = require('path');
const electron = require('electron');
const {
    ipcMain
} = electron;

const env = require('../environment');

class ExtensionsManager {

    constructor(app_user_data_path) {
        this.app_user_data_path = app_user_data_path;
        this.extensions = [];
        this.syncExtensions();
        ipcMain.on('extensions:get', (event) => {
            this.getConfig().then(contents => {
                event.sender.send('extensions:get:response', contents);
            });
            // this.getAllExtensions().then(files => {
            //     console.log(files);
            //     event.sender.send('extensions:get:response', files);
            // });
        });
    }

    syncExtensions() {
        return new Promise((resolve, reject) => {
            // TODO: Copy all extensions from /www/assets/extensions to usedData folder
            resolve();
        });
    }

    getAllExtensions() {
        return new Promise((resolve, reject) => {
            const ext_path = env.production ? path.join(this.app_user_data_path, 'extensions') : path.resolve('www', 'assets', 'extensions');
            fs.readdir(ext_path).then((files) => {
                this.extensions = files.map(file => path.join(ext_path, file)).filter(file => file.match(/\.js$/));
                resolve(this.extensions);
            });
        });
    }

    getConfig() {
        return new Promise((resolve, reject) => {
            const conf_path = `${env.production ? path.join(this.app_user_data_path, 'extensions-config.json') : path.resolve('www', 'assets', 'extensions-config.json')}`;
            if (fs.existsSync(conf_path))
                fs.readFile(conf_path).then(contents => {
                    try {
                        this.extensions_config = JSON.parse(contents);
                        Object.entries(this.extensions_config).forEach(([key, value]) => {
                            const ext_path = env.production ? path.join(this.app_user_data_path, 'extensions') : path.resolve('www', 'assets', 'extensions', `${value['name']}.js`);
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
