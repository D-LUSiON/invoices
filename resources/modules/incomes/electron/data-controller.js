const { ipcMain } = require('electron');

class IncomesController {
    constructor(db_instance, ErrorLoggerClass) {
        this.errorLogger = new ErrorLoggerClass(this.constructor.name);
        this.database = db_instance;
        this.table_name = 'Incomes';
    }

    init() {
        this.startListeners();
    }

    async checkDBCreated() {
        const exists = await this.database.schema.hasTable(this.table_name);
        if (!exists) {
            await this.database.schema.createTable(this.table_name, (table) => {
                table.increments('id').primary();
                table.decimal('amount').defaultTo(0);
                table.datetime('date').defaultTo(this.database.fn.now());
                table.integer('provider').unsigned();
                table.foreign('provider').references('Providers.id');
                table.string('bank_account', 255);
                table.boolean('tax_included').defaultTo(true);
                table.text('notes');
            });
        } else {
            const columns = await this.database(this.table_name).columnInfo();
            await this.database.schema.table(this.table_name, (table) => {
                if (!columns['id']) table.increments('id').primary();
                if (!columns['amount']) table.decimal('amount').defaultTo(0);
                if (!columns['date']) table.datetime('date').defaultTo(this.database.fn.now());
                if (!columns['provider']) {
                    table.integer('provider').unsigned()
                    table.foreign('provider').references('Providers.id');
                };
                if (!columns['bank_account']) table.string('bank_account', 255);
                if (!columns['tax_included']) table.boolean('tax_included').defaultTo(true);
                if (!columns['notes']) table.text('notes');
            });
        }
    }

    startListeners() {
        ipcMain.on('incomes:all', (event, filters) => {
            this.getAllIncomes(filters || {}).then((results) => {
                event.sender.send('incomes:all:response', results);
            });
        });

        ipcMain.on('income:get', (event, args) => {
            this.database('incomes').where('id', args['id']).select().then(results => {
                event.sender.send('income:response', results);
            });
        });

        ipcMain.on('income:save', (event, income) => {
            this.saveIncome(income).then(res => {
                event.sender.send('income:save:response', res);
            }).catch(error => {
                console.log(error)
                this.errorLogger.logError(`Error saving income`, error);
                event.sender.send('income:save:response', { error, income });
            });
        });

        ipcMain.on('income:remove', (event, income) => {
            this.removeIncome(income).then(deleted_rows => {
                event.sender.send('income:remove:response', { deleted_rows, income });
            }).catch(error => {
                console.log(error)
                this.errorLogger.logError(`Error deleting income`, error);
                event.sender.send('income:remove:response', { error, income });
            });
        });
    }

    async getAllIncomes(filters) {
        if (filters && Object.keys(filters).length)
            Object.keys(filters).forEach(key => {
                const new_key = `${this.table_name}.${key}`;
                filters[new_key] = filters[key];
                delete filters[key];
            });
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
            .orderBy('date', 'desc');

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
            }
        }
        return results || [];
    }

    saveIncome(income) {
        return new Promise((resolve, reject) => {
            if (income.id) {
                this.database(this.table_name).update({
                    amount: income.amount,
                    date: income.date,
                    provider: income.provider.id || null,
                    bank_account: income.bank_account,
                    tax_included: income.tax_included,
                    notes: income.notes
                }).where('id', '=', income.id).then((result) => {
                    this.getAllIncomes({ id: income.id }).then((saved_income) => {
                        resolve(saved_income);
                    });
                }).catch((err) => {
                    reject(err);
                });
            } else {
                this.database.insert({
                    amount: income.amount,
                    date: income.date,
                    provider: income.provider.id || null,
                    bank_account: income.bank_account,
                    tax_included: income.tax_included,
                    notes: income.notes
                }).into(this.table_name).then(([result]) => {
                    income.id = result;
                    this.getAllIncomes({ id: income.id }).then((saved_income) => {
                        resolve(saved_income);
                    });
                });
            }
        });
    }

    removeIncome(income) {
        return new Promise((resolve, reject) => {
            if (income.id)
                this.database(this.table_name).where('id', income.id).del().then((deleted_rows) => {
                    resolve(deleted_rows);
                }).catch((err) => {
                    reject(err);
                });
            else
                reject(`Please, provide valid income ID!`);
        });
    }

}

module.exports = IncomesController;
