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
            console.log(`InvoicesController -> Create database SQL Error:`, err);
        });
    }

    _createTable() {
        return this.database.schema.hasTable('Invoices').then((exists) => {
            if (!exists) {
                return this.database.schema.createTable('Invoices', (table) => {
                    table.increments('id').primary();
                    table.string('number', 255);
                    table.datetime('creation_date').defaultTo(this.database.fn.now());
                    table.datetime('update_date').defaultTo(this.database.fn.now());
                    table.date('issue_date');
                    table.string('issue_place', 255);
                    table.text('notes');
                    table.json('goods');
                    table.integer('provider').unsigned();
                    table.foreign('provider').references('Providers.id');
                    table.decimal('total_sum')
                    table.string('type', 255);
                    table.integer('status').defaultTo(0);
                });
            }
        });
    }

    startListeners() {
        ipcMain.on('invoices:all', (event, args) => {
            this.getAllInvoices().then((results) => {
                console.log(`Invoices retrieved:`, results.length);

                event.sender.send('invoices:all:response', results);
            });
        });

        ipcMain.on('invoice:get', (event, args) => {
            this.database('invoices').where('id', args['id']).select().then(results => {
                event.sender.send('invoice:response', results);
            });
        });

        ipcMain.on('invoice:save', (event, invoice) => {
            this.saveInvoice(invoice).then(res => {
                event.sender.send('invoice:save:response', res);
            }).catch(err => console.log(err));
        });

        ipcMain.on('invoices:multiple:save', (event, { mode, invoices }) => {
            console.log(`saving multiple... ${mode}`, invoices.length);

            this.saveMultiple(invoices, mode).then(new_inv => {
                event.sender.send('invoices:multiple:save:response', new_inv);
            });
        });
    }

    getAllInvoices() {
        return this.database
            .select(
                `Invoices.*`,
                `Providers.organization`,
                `Providers.acc_person`,
                `Providers.address`,
                `Providers.vat`
            )
            .table('invoices')
            .innerJoin('Providers', 'invoices.provider', '=', 'Providers.id')
            .orderBy('issue_date', 'desc')
            .then(results => {
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
                return results;
            });
    }

    saveInvoice(invoice) {
        return new Promise((resolve, reject) => {
            if (invoice.id) {
                this.database('invoices').update({
                    number: invoice.number,
                    issue_date: invoice.issue_date,
                    issue_place: invoice.issue_place,
                    notes: invoice.notes,
                    goods: JSON.stringify(invoice.goods || []),
                    provider: invoice.provider.id || null,
                    total_sum: invoice.total_sum,
                    type: invoice.type,
                }).where('id', '=', invoice.id).then(result => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
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

    async saveMultiple(invoices, mode) {
        if (mode === 'overwrite') {
            await this.database('invoices').del();
            await this.database('sqlite_sequence').update('seq', 0).where('name', '=', 'Invoices');
        }

        const providers = await this.database.select().table('providers');

        let upd_providers = [];
        invoices.forEach(invoice => {
            if (!invoice.provider.id && !upd_providers.filter(x => x.vat === invoice.provider.vat).length)
                upd_providers.push({
                    acc_person: invoice.provider.acc_person || '',
                    address: invoice.provider.address || '',
                    organization: invoice.provider.organization,
                    vat: invoice.provider.vat,
                });
        });

        if (upd_providers.length)
            await this.database.insert(upd_providers.map(x => { delete x.id; return x; })).into('providers');

        upd_providers = await this.database.select().table('providers');

        invoices = invoices.map(inv => {
            const idx = upd_providers.findIndex(x => x.vat === inv.provider.vat);
            if (idx > -1)
                inv.provider = providers[idx].id;
            inv.goods = JSON.stringify(inv.goods || []);
            return inv;
        });

        await this.database.insert(invoices.map(x => { delete x.id; return x; })).into('invoices');

        invoices = await this.getAllInvoices();

        return invoices;
    }
}

module.exports = InvoicesController;
