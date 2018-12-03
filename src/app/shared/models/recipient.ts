import { Invoice } from './invoice';

export class Recipient {
    _id: string = '';
    name: string = '';
    invoices?: Invoice[];
    city?: string;
    address?: string;
    email?: string;
    bank_acc?: string;

    constructor(data?) {
        if (data) {
            if (data._id) this._id = data._id;
            if (data.name) this.name = data.name;
            if (data.invoices) this.invoices = data.invoices.map(x => new Invoice(x));
            if (data.city) this.city = data.city;
            if (data.address) this.address = data.address;
            if (data.email) this.email = data.email;
            if (data.bank_acc) this.bank_acc = data.bank_acc;
        }
    }
}
