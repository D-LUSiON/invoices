import { Invoice } from './invoice';

export class Recipient {
    _id: string; // NeDB ID
    id: string; // RethinkDB ID
    name: string = '';
    invoices: Invoice[] = [];
    city: string = '';
    address: string = '';
    email: string = '';
    bank_acc: string = '';

    constructor(data?) {
        if (data) {
            if (typeof data === 'string') {
                if (data) this.name = data;
            } else {
                if (data.hasOwnProperty('_id')) this._id = data._id;
                if (data.hasOwnProperty('id')) this.id = data.id;
                if (data.hasOwnProperty('name')) this.name = data.name;
                if (data.hasOwnProperty('invoices')) this.invoices = data.invoices.map(x => new Invoice(x));
                if (data.hasOwnProperty('city')) this.city = data.city;
                if (data.hasOwnProperty('address')) this.address = data.address;
                if (data.hasOwnProperty('email')) this.email = data.email;
                if (data.hasOwnProperty('bank_acc')) this.bank_acc = data.bank_acc;
            }
        }
    }
}
