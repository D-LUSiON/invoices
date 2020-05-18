const {
    ipcMain
} = require('electron');

class SendingController {
    constructor(db_instance) {
        console.log(`Hello from ${this.constructor.name}!`);
        this.database = db_instance;

        this._createTable().then(() => {
            this.startListeners();
        }).catch(err => {
            console.log(`InvoicesController -> Create database SQL Error:`, err);
        });
    }

    async _createTable() {
        const sending_exists = await this.database.schema.hasTable('Sending');
        if (!sending_exists) {
            await this.database.schema.createTable('Sending', (table) => {
                table.increments('id').primary();
                table.datetime('sending_date').defaultTo(this.database.fn.now());
                table.string('send_to', 255);
                table.text('message');
            });
        }
    }

    startListeners() {
        ipcMain.on('sending:all', (event, args) => {
            this.getSendings().then(results => {
                event.sender.send('sending:all:response', results);
            });
        });
    }

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
            .table('Sending')
            .innerJoin('Invoices', 'invoices.sending_id', '=', 'Sending.id')
            .innerJoin('Providers', 'invoices.provider', '=', 'Providers.id')
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
}

module.exports = SendingController;
