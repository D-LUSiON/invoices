const {
    app,
    ipcMain
} = require('electron');
const path = require('path');
const Excel = require('exceljs');

class InvoicesController {
    constructor(db_instance) {
        this.database = db_instance;
        this.table_name = 'Invoices';
        this.max_inserts = 50;
    }

    init() {
        this.startListeners();
    }

    checkDBCreated() {
        return this.database.schema.hasTable(this.table_name).then((exists) => {
            if (!exists) {
                return this.database.schema.createTable(this.table_name, (table) => {
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
        ipcMain.on('invoices:all', (event, filters) => {
            this.getAllInvoices(filters || {}).then((results) => {
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
            }).catch(error => {
                console.log(error)
                event.sender.send('invoice:save:response', { error, invoice });
            });
        });

        ipcMain.on('invoices:multiple:save', (event, { mode, invoices, xlsx_files }) => {
            this.saveMultiple(invoices, xlsx_files, mode).then(new_inv => {
                event.sender.send('invoices:multiple:save:response', new_inv);
            });
        });

        ipcMain.on('invoice:remove', (event, invoice) => {
            this.removeInvoice(invoice).then(deleted_rows => {
                event.sender.send('invoice:remove:response', { deleted_rows, invoice });
            }).catch(error => {
                console.log(error)
                event.sender.send('invoice:remove:response', { error, invoice });
            });
        });

        ipcMain.on('invoices:xlsx-files:get', async (event, files_path) => {
            const result = await this._loadAllXLSXFiles(files_path);
            let files_contents = [];
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                const file_content = await this._loadXLSXFile(path.join(files_path, element));
                let sent_on = element.replace(/(?:_\d)|(\.xlsx)/g, '').split(' ');
                sent_on[1] = sent_on[1].replace(/\-/g, ':');
                sent_on = sent_on.join(' ');
                files_contents.push({
                    file_path: element,
                    content: file_content,
                    sent_on,
                    parsed: this._workbookToJSON(file_content)
                });
            }

            files_contents = files_contents.sort((a, b) => {
                if (a.sent_on < b.sent_on) return -1;
                if (a.sent_on > b.sent_on) return 1;
                return 0;
            });
            event.sender.send('invoices:xlsx-files:get:response', files_contents);
        });
    }

    async getAllInvoices(filters) {
        if (filters && Object.keys(filters).length)
            Object.keys(filters).forEach(key => {
                const new_key = `${this.table_name}.${key}`;
                filters[new_key] = filters[key];
                delete filters[key];
            });
        console.log(`getAllInvoices filters:`, filters);
        let results = await this.database
            .where(filters || {})
            .select(
                `${this.table_name}.*`,
                `Providers.organization`,
                `Providers.acc_person`,
                `Providers.address`,
                `Providers.vat`,
            )
            .table(this.table_name)
            .innerJoin('Providers', `${this.table_name}.provider`, '=', 'Providers.id')
            .orderBy('issue_date', 'desc');

        if (results && results.length) {
            for (let idx = 0; idx < results.length; idx++) {
                let row = results[idx];

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

                const sending_ids = (
                    (await this.database.where({ 'invoice_id': row.id }).select('Sendings_Invoices.sending_id').table('Sendings_Invoices')) || []
                ).map(x => x.sending_id);

                if (sending_ids.length)
                    row.sendings = await this.database.select().whereIn('id', sending_ids).table('Sendings');
                else
                    row.sendings = [];
            }
        }
        return results || [];
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
                }).where('id', '=', invoice.id).then((result) => {
                    this.getAllInvoices({ id: invoice.id }).then((saved_invoice) => {
                        resolve(saved_invoice);
                    });
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
                }).into('invoices').then(([result]) => {
                    invoice.id = result;
                    this.getAllInvoices({ id: invoice.id }).then((saved_invoice) => {
                        resolve(saved_invoice);
                    });
                });
            }
        });
    }

    async _loadXLSXFile(path) {
        const workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(path);
        return workbook;
    }

    async _loadAllXLSXFiles(path) {
        const fs = require('fs-extra');
        const all_files = await fs.readdir(path);

        const xlsx_files = all_files.filter(file => file.endsWith('.xlsx'));
        return xlsx_files;
    }

    _workbookToJSON(workbook) {
        const worksheet = workbook.getWorksheet(1);
        const data = [];
        worksheet.eachRow((row, rowNumber) => {
            try {
                if (row.values[1].toString().match(/\d{1,}/)) {
                    const row_data = {
                        number: row.values[1],
                        issue_date: `${row.values[2].split('-')[2]}-${row.values[2].split('-')[1]}-${row.values[2].split('-')[0]}`,
                        total_sum: row.values[3],
                        provider_vat: row.values[11],
                        all_values: row.values
                    };
                    data.push(row_data);
                }
            } catch (error) {
                console.log(row.values);
            }
        });
        return data;
    }

    async _createProviders(invoices) {
        let providers = await this.database.select().table('Providers');

        if (!providers)
            providers = [];

        let upd_providers = [];
        invoices.forEach(invoice => {
            if (!invoice.provider.id && !upd_providers.filter(x => x.vat === invoice.provider.vat).length && !providers.filter(x => x.vat === invoice.provider.vat).length)
                upd_providers.push({
                    acc_person: invoice.provider.acc_person || '',
                    address: invoice.provider.address || '',
                    organization: invoice.provider.organization,
                    vat: invoice.provider.vat,
                });
        });

        if (upd_providers.length)
            await this.database.insert(upd_providers.map(x => { delete x.id; return x; })).into('Providers');

        return await this.database.select().table('Providers');

    }

    async _createSendings(sendings_data) {
        if (await this.database.schema.hasTable('Sendings')) {
            for (let i = 0; i < sendings_data.length; i++) {
                const sending_data = sendings_data[i];
                sending_data.id = (await this.database.insert({
                    sending_date: sending_data.sent_on,
                    send_to: 'albena.stambolova@abv.bg',
                    subject: sending_data.sent_on,
                    message: `Imported from "${sending_data.file_path}"`,
                }).into('Sendings'))[0];

                if (i === sendings_data.length - 1) {

                    return sendings_data;
                }
            }
        }
    }

    async _createInvoices(invoices, providers, sendings) {
        const schema = await this.database.table(this.table_name).columnInfo();
        const schema_keys = Object.keys(schema);

        // FIXME: Skip duplicated invoices that are already in the DB (like providers)
        invoices = invoices.map(invoice => {
            const idx = providers.findIndex(x => x.vat === invoice.provider.vat);
            if (idx > -1)
                invoice.provider = providers[idx].id;
            else if (invoice.provider && invoice.provider.id) {
                invoice.provider = invoice.provider.id;
            }

            invoice.goods = JSON.stringify(invoice.goods || []);

            // If invoice is in any of the sendings, set status to "archived"
            if (
                sendings.filter(sending =>
                    !!sending.parsed.filter(inv =>
                        inv.vat === invoice.vat && inv.number === invoice.number
                    ).length
                )
            )
                invoice.status = 2;

            delete invoice.id;
            Object.keys(invoice).forEach(key => {
                if (!schema_keys.includes(key))
                    delete invoice[key];
            });

            return invoice;
        }).sort((a, b) => {
            if (a.creation_date < b.creation_date) return -1;
            if (a.creation_date > b.creation_date) return 1;
            return 0;
        });

        // Limit inserts because of SQLITE_ERROR: too many SQL variables:
        for (let i = 0; i < Math.ceil(invoices.length / this.max_inserts); i++) {
            const min = this.max_inserts * i;
            const max = min + this.max_inserts > invoices.length ? invoices.length : min + this.max_inserts;
            await this.database.insert(invoices.slice(min, max)).into(this.table_name);
        }

        return await this.getAllInvoices();
    }

    async _createSendingInvoicesBridge(invoices, xlsx_files) {
        const sendings_invoices = [];
        invoices.forEach(invoice => {
            let sendings = xlsx_files
                .filter(xlsx_file =>
                    xlsx_file.parsed.find(inv =>
                        inv.number === invoice.number && inv.issue_date === invoice.issue_date
                    )
                );

            if (sendings && sendings.length) {
                sendings = sendings.sort((a, b) => {
                    if (a.sending_date < b.sending_date) return 1;
                    if (a.sending_date > b.sending_date) return -1;
                    return 0;
                }).forEach(sending => {
                    sendings_invoices.push({
                        sending_id: sending.id,
                        invoice_id: invoice.id,
                    });
                });
            }
        });

        for (let i = 0; i < Math.ceil(sendings_invoices.length / this.max_inserts); i++) {
            const min = this.max_inserts * i;
            const max = min + this.max_inserts > sendings_invoices.length ? sendings_invoices.length : min + this.max_inserts;
            await this.database.insert(sendings_invoices.slice(min, max)).into('Sendings_Invoices');
        }

        return await this.database.select().table('Sendings_Invoices');
    }

    async saveMultiple(invoices, xlsx_files, mode) {
        console.log(`-----------------------------------------`);
        if (mode === 'overwrite') {
            await this.database(this.table_name).del();
            await this.database('sqlite_sequence').update('seq', 0).where('name', '=', this.table_name);
            console.log(`${this.table_name} table deleted and reset!`);

            if (await this.database.schema.hasTable('Providers')) {
                await this.database('Providers').del();
                await this.database('sqlite_sequence').update('seq', 0).where('name', '=', 'Providers');
                console.log(`Providers table deleted and reset!`);
            }
            if (await this.database.schema.hasTable('Sendings')) {
                await this.database('Sendings').del();
                await this.database('sqlite_sequence').update('seq', 0).where('name', '=', 'Sendings');
                console.log(`Sendings table deleted and reset!`);
            }
            if (await this.database.schema.hasTable('Sendings_Invoices')) {
                await this.database('Sendings_Invoices').del();
                await this.database('sqlite_sequence').update('seq', 0).where('name', '=', 'Sendings_Invoices');
                console.log(`Sendings_Invoices table deleted and reset!`);
            }
        }

        const providers = await this._createProviders(invoices);
        console.log(`providers created:`, providers.length);

        xlsx_files = await this._createSendings(xlsx_files);
        console.log(`sendings created:`, xlsx_files.length);

        invoices = await this._createInvoices(invoices, providers, xlsx_files);
        console.log(`invoices created:`, invoices.length);

        const sendings_invoices_bridge = await this._createSendingInvoicesBridge(invoices, xlsx_files);
        console.log(`sendings_invoices_bridge created:`, sendings_invoices_bridge.length);

        return invoices;
    }

    removeInvoice(invoice) {
        return new Promise((resolve, reject) => {
            if (invoice.id)
                this.database(this.table_name).where('id', invoice.id).del().then((deleted_rows) => {
                    console.log(`deleting result`, deleted_rows);
                    resolve(deleted_rows);
                }).catch((err) => {
                    reject(err);
                });
            else
                reject(`Please, provide valid invoice ID!`);
        });
    }
}

module.exports = InvoicesController;
