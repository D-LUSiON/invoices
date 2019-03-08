import { Recipient } from './recipient';

export class Transaction {
    _id: string; // NeDB ID
    id: string; // RethinkDB ID
    recipient: Recipient;
    bank_account_from: string;
    bank_account_to: string;
    sum: number;
    payed_sum: number;
    transaction_date: Date;
    creation_date: Date;
    update_date: Date;

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('_id')) this._id = data._id;
            if (data.hasOwnProperty('id')) this.id = data.id;
            if (data.hasOwnProperty('recipient')) this.recipient = new Recipient(data.recipient);
            if (data.hasOwnProperty('bank_account_from')) this.bank_account_from = data.bank_account_from;
            if (data.hasOwnProperty('bank_account_to')) this.bank_account_to = data.bank_account_to;
            if (data.hasOwnProperty('transaction_date')) this.transaction_date = new Date(data.transaction_date);
            if (data.hasOwnProperty('creation_date')) this.creation_date = new Date(data.creation_date);
            if (data.hasOwnProperty('update_date')) this.update_date = new Date(data.update_date);
        }
    }
}
