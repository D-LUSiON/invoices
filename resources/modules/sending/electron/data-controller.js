const {
    app,
    shell,
    ipcMain,
    dialog,
    BrowserWindow
} = require('electron');
const fs = require('fs-extra');
const path = require('path');
const CryptoJS = require('crypto-js');
const MachineID = require('node-machine-id');
const Excel = require('exceljs');

class SendingController {

    constructor(db_instance) {
        this.database = db_instance;
        this.table_name = 'Sendings';
        this.bridge_table = `${this.table_name}_Invoices`;

        this.machine_id = MachineID.machineIdSync();

        this.settings = {};
        this.translations = [];
        this.getSettings().then((settings) => {
            this.settings = settings;
            this.translations = fs.readJSONSync(
                path.resolve(
                    __dirname,
                    '..',
                    'i18n',
                    `${this.settings && this.settings.general && this.settings.general.language ? this.settings.general.language : 'en'}.json`
                )
            );
        });

        this._createTable()
            .then(() => this._createBridgeTable())
            .then(() => {
                this.startListeners();
            }).catch(err => {
                console.error(`SendingController -> Create database SQL Error:`, err);
            });
    }

    async _createTable() {
        const sending_exists = await this.database.schema.hasTable(this.table_name);
        if (!sending_exists) {
            await this.database.schema.createTable(this.table_name, (table) => {
                table.increments('id').primary();
                table.datetime('sending_date').defaultTo(this.database.fn.now());
                table.string('send_to', 255);
                table.text('subject');
                table.text('message');
            });
        }
    }

    async _createBridgeTable() {
        const sending_exists = await this.database.schema.hasTable(this.bridge_table);
        if (!sending_exists) {
            await this.database.schema.createTable(this.bridge_table, (table) => {
                table.increments('id').primary();
                table.integer('sending_id').unsigned();
                table.foreign('sending_id').references(`${this.table_name}.id`);
                table.integer('invoice_id').unsigned();
                table.foreign('invoice_id').references(`Invoices.id`);
            });
        }
    }

    startListeners() {
        ipcMain.on('sending:all', (event, args) => {
            // this.getSendings().then(results => {
            this.getSendingsNew().then(results => {
                event.sender.send('sending:all:response', results);
            });
        });
        ipcMain.on('sending:save', async (event, sending_data) => {
            try {
                const saved_data = await this.createDbEntry(sending_data);
                const file_name = await this.createWorkbook(saved_data);

                const dialog_options = {
                    type: 'question',
                    title: 'Sending created!',
                    buttons: ['Yes', 'No'],
                    message: `Do you want to send email to {send_to} now?`,
                    detail: `Sending is saved as: {file_name}`,
                    checkboxLabel: 'Open generated file with system default .xlsx viewer'
                };

                const dialog_response = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                    ...dialog_options,
                    title: this.translations[dialog_options.title] || dialog_options.title,
                    buttons: [
                        this.translations[dialog_options.buttons[0]] || dialog_options.buttons[0],
                        this.translations[dialog_options.buttons[1]] || dialog_options.buttons[1],
                    ],
                    message: (this.translations[dialog_options.message] || dialog_options.message).replace(/\{send_to\}/g, saved_data.send_to),
                    detail: (this.translations[dialog_options.detail] || dialog_options.detail).replace(/\{file_name\}/g, file_name),
                    checkboxLabel: this.translations[dialog_options.checkboxLabel] || dialog_options.checkboxLabel,
                });

                if (dialog_response.checkboxChecked)
                    shell.openItem(file_name);

                if (dialog_response.response === 0) {
                    const sent_mail_result = await this.sendEmail(saved_data, file_name);
                    event.sender.send('sending:save:response', { saved_data, file_name, sent_mail_result });
                } else
                    event.sender.send('sending:save:response', { saved_data, file_name });
            } catch (error) {
                event.sender.send('sending:save:response', { error });
            }
        });
    }

    getSettings() {
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

    getSendingsNew() {
        return new Promise(async (resolve, reject) => {
            const sendings = await this.database.select().table(this.table_name).orderBy('sending_date', 'desc');
            for (let idx = 0; idx < sendings.length; idx++) {
                const sending = sendings[idx];

                const invoices = await this._getInvoicesForSending(sending);
                sending.invoices = invoices || [];

                if (idx === sendings.length - 1)
                    resolve(sendings);
            }
        });
    }

    async _getInvoicesForSending(sending) {
        let results = await this.database
            .select(
                `Invoices.*`,
                `Providers.organization`,
                `Providers.acc_person`,
                `Providers.address`,
                `Providers.vat`
            )
            .table('Invoices')
            .innerJoin('Providers', 'Invoices.provider', '=', 'Providers.id')
            .innerJoin(this.bridge_table, `${this.bridge_table}.invoice_id`, `Invoices.id`)
            .where(`${this.bridge_table}.sending_id`, '=', sending.id)
            .orderBy('issue_date', 'desc');

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
        return results || [];
    }

    async getSendingsNew1() {
        const results = await this.database.select().table(this.table_name).orderBy('issue_date', 'desc');

        if (!results)
            results = [];

        results.forEach(async result => {
            const invoices = await this.database.select(
                `Invoices.*`
            )
                .table('Invoices')
                .innerJoin(this.bridge_table, `Sendings_Invoices.invoice_id`, `Invoices.id`)
                .andOn(`Sendings_Invoices.sending_id`, result.id);
            console.log(`Sending id ${result.id} invoices: ${invoices.length}`);

            result.invoices = invoices;
        });

        return results;

    }

    // FIXME: There is no more "sending_id" key in Invoices table
    getSendings() {
        return this.database
            .select(
                `Sending.*`,
                `Invoices.*`,
                `Providers.organization`,
                `Providers.acc_person`,
                `Providers.address`,
                `Providers.vat`
            )
            .table(this.table_name)
            .innerJoin('Invoices', 'Invoices.sending_id', '=', 'Sending.id')
            .innerJoin('Providers', 'Invoices.provider', '=', 'Providers.id')
            .orderBy('issue_date', 'desc')
            .then(results => {
                const rows = {};
                results.forEach(row => {
                    if (!rows[row.sending_id]) {
                        rows[row.sending_id] = {
                            id: row.sending_id,
                            sending_date: row.sending_date,
                            send_to: row.send_to,
                            message: row.message,
                            invoices: [
                                {
                                    id: row.id,
                                    number: row.number,
                                    creation_date: row.creation_date,
                                    update_date: row.update_date,
                                    issue_date: row.issue_date,
                                    issue_place: row.issue_place,
                                    notes: row.notes,
                                    goods: row.goods,
                                    provider: {
                                        id: row.provider,
                                        organization: row.organization,
                                        acc_person: row.acc_person,
                                        address: row.address,
                                        vat: row.vat,
                                    },
                                    total_sum: row.total_sum,
                                    type: row.type,
                                    status: row.status,
                                }
                            ]
                        }
                    } else {
                        rows[row.sending_id].invoices.push({
                            id: row.id,
                            number: row.number,
                            creation_date: row.creation_date,
                            update_date: row.update_date,
                            issue_date: row.issue_date,
                            issue_place: row.issue_place,
                            notes: row.notes,
                            goods: row.goods,
                            provider: {
                                id: row.provider,
                                organization: row.organization,
                                acc_person: row.acc_person,
                                address: row.address,
                                vat: row.vat,
                            },
                            total_sum: row.total_sum,
                            type: row.type,
                            status: row.status,
                        });
                    }
                    try {
                        rows[row.sending_id].invoices[rows[row.sending_id].invoices.length - 1].goods = JSON.parse(rows[row.sending_id].invoices[rows[row.sending_id].invoices.length - 1].goods)
                    } catch (error) {
                        rows[row.sending_id].invoices[rows[row.sending_id].invoices.length - 1].goods = [];
                    }
                });

                return Object.keys(rows).map(key => rows[key]);
            });
    }

    saveSending(sending) {
        return new Promise((resolve, reject) => {
            this.createDbEntry(sending)
                .then((db_data) => this.createWorkbook(db_data))
                .then((result) => {
                    console.log(`this.createDbEntry -> this.createWorkbook result`, result);
                    resolve([...result]);
                }).catch((err) => {
                    console.error(`Error saving:`, Object.keys(err));
                    reject(err);
                });
        });
    }

    async createWorkbook(sending) {
        this.setupWorkbook();
        this.setupWorksheetColumns(sending.invoice_fields);
        this.setWorksheetData(sending.invoice_fields, sending.invoices);
        const file_name = await this.saveWorkbook(sending);
        return file_name;
    }

    async createDbEntry(sending) {
        return new Promise(async (resolve, reject) => {
            const result = await this.database.insert({
                sending_date: sending.sending_date,
                send_to: sending.send_to,
                subject: sending.subject,
                message: sending.message,
            }).into(this.table_name);

            sending.id = result[0];

            sending.invoices.forEach(async (invoice, idx) => {
                await this.database.insert({
                    sending_id: sending.id,
                    invoice_id: invoice.id,
                }).into(this.bridge_table);

                await this.database('Invoices').update({
                    status: 1,
                }).where('id', '=', invoice.id);

                if (idx === sending.invoices.length - 1)
                    resolve(sending);
            });
        });
    }

    setupWorkbook() {
        this.workbook = new Excel.Workbook();
        this.workbook.creator = this.settings && this.settings.sender && this.settings.sender.name ? this.settings.sender.name : '';
        this.workbook.created = new Date();

        this.workbook.addWorksheet(this.translate('Invoices'), {
            pageSetup: {
                paperSize: 9,
                orientation: 'landscape'
            }
        });
    }

    setupWorksheetColumns(sending_fields) {
        let columns = [];

        const cell_style = {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            fill: {
                fgColor: {
                    argb: 'FFFFFF00'
                },
                bgColor: {
                    argb: 'FF0000FF'
                }
            }
        };

        if (sending_fields.length) {
            sending_fields.forEach(field => {
                if (field.checked) {
                    columns.push({
                        header: field.title,
                        key: field.name,
                        width: field.width
                    })
                }
            });
        } else {
            columns = [
                { header: this.translate('Invoice number'), key: 'number', width: 20, style: cell_style },
                { header: this.translate('Issue date'), key: 'issue_date', width: 15, style: cell_style },
                { header: this.translate('Total sum'), key: 'total_sum', width: 20, style: cell_style },
                { header: this.translate('VAT 20%'), key: 'total_vat', width: 10, style: cell_style },
                { header: this.translate('Payment amount'), key: 'total_total', width: 10, style: cell_style },
                { header: this.translate('Invoice content'), key: 'goods', width: 10, style: cell_style },
                { header: this.translate('Notes'), key: 'notes', width: 20, style: cell_style },
                { header: this.translate('Provider name'), key: 'provider', width: 30, style: cell_style },
                { header: this.translate('Provider AP'), key: 'acc_person', width: 20, style: cell_style },
                { header: this.translate('Provider address'), key: 'address', width: 30, style: cell_style },
                { header: this.translate('Provider VAT'), key: 'vat', width: 30, style: cell_style },
            ];
        }
        const worksheet = this.workbook.getWorksheet(1)
        worksheet.columns = columns;
        worksheet.eachRow(row => {
            row.eachCell(cell => {

            });
        });
    }

    setWorksheetData(fields, data) {
        const worksheet = this.workbook.getWorksheet(1);
        const worksheet_data = [];
        data.forEach((invoice) => {
            const row = {};
            fields.forEach((field) => {
                if (field.checked)
                    row[field.name] = this.resolveValue(invoice, field.name);
            });
            worksheet_data.push(row);
        });
        worksheet.addRows(worksheet_data);
    }

    saveWorkbook() {
        return new Promise((resolve, reject) => {

            let backup_path;
            if (this.settings && this.settings.general && this.settings.general.backup_path)
                backup_path = path.resolve(this.settings.general.backup_path, app.name);
            else
                backup_path = app.getPath('userData');

            if (!fs.existsSync(path.resolve(backup_path)))
                fs.mkdirp(path.resolve(backup_path));

            const file_name = path.resolve(backup_path, `${new Date().getTime()}.xlsx`);
            resolve(file_name);

            this.workbook.xlsx.writeFile(file_name).then(() => {
                resolve(file_name);
            }).catch((err) => {
                const error = {
                    workbook,
                    backup_path,
                    file_name,
                    err
                };
                console.error(`SendingController -> saveWorkbook Error:`, error);
                reject(error);
            });
        });
    }

    async sendEmail(sending, file_path) {
        this.settings = await this.getSettings();

        const send = require('gmail-send')({
            user: this.settings.sender.email,
            pass: this.settings.sender.password,
            to: sending.send_to
        });

        return send({
            subject: sending.subject,
            html: sending.message || '',
            files: file_path ? [file_path] : []
        });
    }

    translate(key) {
        return this.translations[key] || key;
    }

    resolveValue(object, path) {
        path = path.replace(/\[([\w\*\$]+)\]/g, '.$1').replace(/^\./, '');

        let idx = path.indexOf('.');
        if (path.startsWith('*') && Array.isArray(object)) {
            idx = path.indexOf('.');
            if (idx > -1) {
                return object.map(x => {
                    return this.resolveValue(x, path.substr(idx + 1));
                }).join(', ');
            }
            return object.join(', ');
        } else if (path.startsWith('$') && Array.isArray(object)) {
            return this.resolveValue(object[object.length - 1], path.substr(idx + 1));
        } else if (idx > -1) {
            return this.resolveValue(object[path.substring(0, idx)], path.substr(idx + 1));
        }
        return object[path] === undefined ? '' : object[path];
    }
}

module.exports = SendingController;
