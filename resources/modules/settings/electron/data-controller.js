const {
    ipcMain
} = require('electron');

class SettingsController {
    constructor(db_instance) {
        console.log(`Hello from ${this.constructor.name}!`);
        this.database = db_instance;

        this._createTable().then(() => {
            this.startListeners();
        });
    }

    _createTable() {
        return this.database.schema.hasTable('Settings').then((exists) => {
            if (!exists) {
                // return this.database.schema.createTable('Settings', (table) => {
                //     table.increments('id').primary();
                //     table.string('organization', 255);
                //     table.string('acc_person', 255);
                //     table.string('address', 255);
                //     table.string('vat', 255);
                //     table.unique('vat');
                // });

                console.log(`Table "Settings" does not exist! Create it!`);

            }
        });
    }

    startListeners() {
        ipcMain.on('settings:all', (event, args) => {
            console.log(`requested all settings...`);
            // this.database.select().table('settings').then(results => {
            //     event.sender.send('settings:all:response', results);
            // });
            event.sender.send('settings:all:response', {});
        });
    }
}

module.exports = SettingsController;
