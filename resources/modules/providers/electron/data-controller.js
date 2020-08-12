const {
    ipcMain
} = require('electron');

class ProvidersController {
    constructor(db_instance, ErrorLoggerClass) {
        this.database = db_instance;
        this.errorLogger = new ErrorLoggerClass(this.constructor.name);
    }

    init() {
        this.startListeners();
    }

    checkDBCreated() {
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
            this.database.select().table('providers').then(results => {
                event.sender.send('providers:all:response', results);
            });
        });

        ipcMain.on('provider:get', (event, args) => {
            this.database('providers').where('id', args['id']).select().orderBy('organization', 'asc').then(results => {
                event.sender.send('provider:response', results);
            });
        });

        ipcMain.on('provider:save', (event, provider) => {
            this.saveProvider(provider).then(res => {
                event.sender.send('provider:save:response', res);
            }).catch(error => {
                console.log(`Error saving provider`, error)
                this.errorLogger.logError(`Error saving provider`, error);
                event.sender.send('provider:save:response', { error, provider });
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
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    }
}

module.exports = ProvidersController;
