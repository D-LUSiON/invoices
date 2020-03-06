const {
    app,
    ipcMain
} = require('electron');
const path = require('path');

class InvoicesController {
    constructor(db_instance) {
        console.log(`Hello from ${this.constructor.name}!`);
        this.database = db_instance;

        this._createTable().then(() => {
            this.startListeners();
        });

        this.database.raw('SELECT 1+1 AS result').then(result => {
            console.log('Connection to SQLite database has been established successfully.');
        });
    }

    _createTable() {
        return this.database.schema.hasTable('Invoices').then((exists) => {
            if (!exists) {
                return this.database.schema.createTable('Invoices', (t) => {
                    t.increments('id').primary();
                    t.string('number', 100);
                    // t.string('creation_date', 100);
                    // t.string('update_date', 100);
                    t.string('issue_date', 100);
                    t.string('issue_place', 100);
                    t.text('notes');
                    t.json('goods');
                    t.integer('provider').unsigned();
                    t.foreign('provider').references('Providers.id');
                    t.decimal('total_sum')
                    t.string('type', 100);
                });
            }
        }).then(() => {

        });
    }

    startListeners() {
        ipcMain.on('invoices:all', (event, args) => {
            console.log(`requested all invoices...`);
            this.database.select().table('invoices').then(results => {
                event.sender.send('invoices:all:response', results);
            });
        });

        ipcMain.on('invoice:get', (event, args) => {
            console.log(`requested all invoices...`);
            this.database('invoices').where('id', args['id']).select().then(results => {
                event.sender.send('invoice:response', results);
            });
        });

        ipcMain.on('invoice:save', (event, invoice) => {
            console.log(`saving invoice...`, invoice);
            this.saveInvoice(invoice).then(res => {
                event.sender.send('invoice:save:response', res);
            });
        });
    }

    saveInvoice(invoice) {
        return new Promise((resolve, reject) => {
            if (invoice.id) {

            } else {
                if (invoice.provider.id) {

                } else {
                    // Save provider, then...
                    this.database.insert({
                        number: invoice.number,
                        issue_date: invoice.issue_date,
                        issue_place: invoice.issue_place,
                        notes: invoice.notes,
                        // goods: JSON.stringify(invoice.goods),
                        provider: invoice.provider.id || null,
                        total_sum: invoice.total_sum,
                        type: invoice.type,
                    }).into('invoices').then(result => {
                        resolve(result);
                    });
                }
            }
        });
    }
}

module.exports = InvoicesController;
