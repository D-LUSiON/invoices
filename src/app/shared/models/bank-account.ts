export class BankAccount {
    _id: string; // NeDB ID
    id: string; // RethinkDB ID
    bank_acc: string;
    bank: string;
    description: string;

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('_id')) this._id = data._id;
            if (data.hasOwnProperty('id')) this.id = data.id;
            if (data.hasOwnProperty('bank_acc')) this.bank_acc = data.bank_acc;
            if (data.hasOwnProperty('bank')) this.bank = data.bank;
            if (data.hasOwnProperty('description')) this.description = data.description;
        }
    }
}
