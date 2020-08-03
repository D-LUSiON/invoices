const {
    BrowserWindow,
    ipcMain
} = require('electron');
const CryptoJS = require('crypto-js');
const MachineID = require('node-machine-id');

class SettingsController {
    constructor(db_instance) {
        this.database = db_instance;
        this.machine_id = MachineID.machineIdSync();
    }

    init() {
        this.startListeners();
    }

    checkDBCreated() {
        return this.database.schema.hasTable('Settings').then((exists) => {
            if (!exists) {
                return this.database.schema.createTable('Settings', (table) => {
                    table.increments('id').primary();
                    table.string('name', 255);
                    table.unique('name');
                    table.json('value', 255);
                });
            }
        });
    }

    startListeners() {
        ipcMain.on('settings:all', (event, args) => {
            this.getAllSettings().then(results => {
                event.sender.send('settings:all:response', results);
            }).catch(err => {
                console.error(`Error when getting settings from the database!`, err);
                event.sender.send('settings:save:response', {});
            });
        });

        ipcMain.on('settings:save', (event, settings) => {
            this.saveSettings(settings).then(res => {
                this.getAllSettings().then(settings => {
                    event.sender.send('settings:save:response', settings);
                    const lang = (settings && settings.general && settings.general.language) ? settings.general.language : '';
                    if (lang) {
                        const window = BrowserWindow.getFocusedWindow();
                        window.webContents.send('translations:current-lang', lang);
                    }
                });
            });
        });

        ipcMain.on('translations:current-lang:get', (event) => {
            this.getAllSettings().then(settings => {
                const lang = (settings && settings.general && settings.general.language) ? settings.general.language : '';
                event.sender.send('translations:current-lang:get:response', lang);
            });
        });
    }

    getAllSettings() {
        return new Promise((resolve, reject) => {
            this.database.select().table('Settings').then(results => {
                const settings = {};
                results.forEach(row => {
                    try {
                        settings[row.name] = JSON.parse(row.value);
                    } catch (error) {
                        settings[row.name] = row.value;
                    }

                    if (typeof settings[row.name] === 'object' && settings[row.name].password)
                        settings[row.name].password = CryptoJS.AES.decrypt(settings[row.name].password, this.machine_id).toString(CryptoJS.enc.Utf8);
                });
                resolve(settings);
            }).catch(err => {
                reject(err);
            });
        });
    }

    saveSettings(settings) {
        const promises = Object.keys(settings).map(async key => {
            if (typeof settings[key] === 'object' && settings[key].password)
                settings[key].password = CryptoJS.AES.encrypt(settings[key].password, this.machine_id).toString();

            const result = await this.database.select().table('Settings').where('name', key);
            if (result.length) {
                return this.database('Settings').where('name', key).update({ value: JSON.stringify(settings[key]) })
            } else {
                return this.database.insert({
                    name: key,
                    value: JSON.stringify(settings[key])
                }).into('Settings');
            }
        });
        return Promise.all(promises);
    }
}

module.exports = SettingsController;
