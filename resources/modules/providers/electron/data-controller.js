const {
    ipcMain
} = require('electron');

class ProvidersController {
    constructor(db_instance) {
        console.log(`Hello from ${this.constructor.name}!`);
        this.database = db_instance;

        this._createTable().then(() => {
            this.startListeners();
        });
    }

    _createTable() {
        return this.database.schema.hasTable('Providers').then((exists) => {
            if (!exists) {
                return this.database.schema.createTable('Providers', (table) => {
                    table.increments('id').primary();
                    table.string('organization', 255);
                    table.string('acc_person', 255);
                    table.string('address', 255);
                    table.string('vat', 255);
                    table.unique('vat');
                });
            }
        });
    }

    startListeners() {
        ipcMain.on('providers:all', (event, args) => {
            console.log(`requested all providers...`);
            this.database.select().table('providers').then(results => {
                event.sender.send('providers:all:response', results);
            });
        });

        ipcMain.on('provider:get', (event, args) => {
            console.log(`requested provider with ID:${args['id']}...`);
            this.database('providers').where('id', args['id']).select().orderBy('organization', 'asc').then(results => {
                event.sender.send('provider:response', results);
            });
        });

        ipcMain.on('provider:save', (event, provider) => {
            console.log(`saving provider...`, provider);
            this.saveProvider(provider).then(res => {
                event.sender.send('provider:save:response', res);
            });
        });
    }

    saveProvider(provider) {
        return new Promise((resolve, reject) => {
            if (provider.id) {

            } else {
                // Save provider, then...
                this.database.insert({
                    organization: provider.organization,
                    acc_person: provider.acc_person,
                    address: provider.address,
                    vat: provider.vat,
                }).into('providers').then(result => {
                    resolve(result);
                });
            }
        });
    }
}

module.exports = ProvidersController;
