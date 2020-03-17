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
        }).catch(err => {
            console.log(`SQL Error:`, err);
        });
    }

    _createTable() {
        return this.database.schema.hasTable('Invoices').then((exists) => {
            if (!exists) {
                return this.database.schema.createTable('Invoices', (table) => {
                    table.increments('id').primary();
                    table.string('number', 255);
                    table.datetime('creation_date').defaultTo(this.database.fn.now());
                    table.datetime('update_date');
                    table.date('issue_date');
                    table.string('issue_place', 255);
                    table.text('notes');
                    table.json('goods');
                    table.integer('provider').unsigned();
                    table.foreign('provider').references('Providers.id');
                    table.decimal('total_sum')
                    table.string('type', 255);
                });
            }
        });
    }

    startListeners() {
        ipcMain.on('invoices:all', (event, args) => {
            console.log(`requested all invoices...`);
            this.database.select(
                `Invoices.*`,
                `Providers.organization`,
                `Providers.acc_person`,
                `Providers.address`,
                `Providers.vat`
            ).table('invoices').innerJoin('Providers', 'invoices.provider', '=', 'Providers.id').then(results => {
                if (results && results.length) {
                    results = results.map(row => {
                        row.provider = {
                            id: row.provider,
                            organization: row.organization,
                            acc_person: row.acc_person,
                            address: row.address,
                            vat: row.vat,
                        }
                        delete row.organization;
                        delete row.acc_person;
                        delete row.address;
                        delete row.vat;
                        try {
                            row.goods = JSON.parse(row.goods)
                        } catch (error) {
                            row.goods = [];
                        }
                        return row;
                    });
                }
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
                this.database.where('id', '=', invoice.id).update({
                    number: invoice.number,
                    issue_date: invoice.issue_date,
                    issue_place: invoice.issue_place,
                    notes: invoice.notes || '',
                    goods: JSON.stringify(invoice.goods || []),
                    provider: invoice.provider.id || null,
                    total_sum: invoice.total_sum,
                    type: invoice.type,
                }).then(result => {
                    resolve(result);
                });
            } else {
                this.database.insert({
                    number: invoice.number,
                    issue_date: invoice.issue_date,
                    issue_place: invoice.issue_place,
                    notes: invoice.notes,
                    goods: JSON.stringify(invoice.goods || []),
                    provider: invoice.provider.id || null,
                    total_sum: invoice.total_sum,
                    type: invoice.type,
                }).into('invoices').then(result => {
                    resolve(result);
                });
            }
        });
    }

    saveMultiple(invoices) {
        const providers = [];
        invoices.forEach(invoice => {
            providers.push({
                acc_person: invoice.provider.acc_person || '',
                address: invoice.provider.address || '',
                organization: invoice.provider.organization,
                vat: invoice.provider.vat,
            })
        });
        // TODO: Importing old invoices - Save providers then save invoices
        return new Promise((resolve, reject) => {
            this.database.insert(invoices.map(invoice => ({
                number: invoice.number,
                issue_date: invoice.issue_date,
                issue_place: invoice.issue_place,
                notes: invoice.notes,
                goods: JSON.stringify(invoice.goods || []),
                provider: invoice.provider.id || null,
                total_sum: invoice.total_sum,
                type: invoice.type,
            }))).into('invoices').then(result => {
                resolve(result);
            });
        });
    }
}

module.exports = InvoicesController;
