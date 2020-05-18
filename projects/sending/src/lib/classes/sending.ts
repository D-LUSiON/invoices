import { Invoice } from '@invoices';

export class Sending {
    id: number;
    sending_date: Date;
    send_to: string;
    message: string;
    invoices: Invoice[] = [];

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('id')) this.id = data['id'];
            if (data.hasOwnProperty('sending_date')) this.sending_date = new Date(data['sending_date']);
            if (data.hasOwnProperty('send_to')) this.send_to = data['send_to'];
            if (data.hasOwnProperty('message')) this.message = data['message'];
            if (data.hasOwnProperty('invoices')) this.invoices = data['invoices'].map(x => new Invoice(x));
        }
    }

    get invoices_total_sum() {
        return this.invoices.map(x => +x.total_sum).reduce((accumulator, currentValue) => accumulator + currentValue);
    }

    get invoices_total_vat() {
        return this.invoices.map(x => +x.total_vat).reduce((accumulator, currentValue) => accumulator + currentValue);
    }

    get invoices_payment_amount() {
        return this.invoices.map(x => +x.payment_amount).reduce((accumulator, currentValue) => accumulator + currentValue);
    }
}
