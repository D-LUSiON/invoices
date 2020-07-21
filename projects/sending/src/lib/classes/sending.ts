import { Invoice } from '@invoices';
import { Tools } from '@shared';

export class Sending {
    id: number;
    sending_date: Date = new Date();
    send_to: string;
    subject: string;
    message: string;
    invoices: Invoice[] = [];
    invoice_fields: {
        name: string,
        title: string,
        checked: boolean
    }[] = [];

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('id')) this.id = data['id'];
            if (data.hasOwnProperty('sending_date')) this.sending_date = new Date(data['sending_date']);
            if (data.hasOwnProperty('send_to')) this.send_to = data['send_to'];
            if (data.hasOwnProperty('subject')) this.subject = data['subject'];
            if (data.hasOwnProperty('message')) this.message = data['message'];
            if (data.hasOwnProperty('invoices')) this.invoices = data['invoices'].map(x => new Invoice(x));
            if (data.hasOwnProperty('invoice_fields')) this.invoice_fields = data['invoice_fields'];
        }
    }

    get invoices_total_sum() {
        const invoices_totals = this.invoices.map(x => +x.total_sum);
        return invoices_totals.length ? +(invoices_totals.reduce((accumulator, currentValue) => accumulator + currentValue).toFixed(2)) : '0.00';
    }

    get invoices_total_vat() {
        const invoices_vats = this.invoices.map(x => +x.total_vat);
        return invoices_vats.length ? +(invoices_vats.reduce((accumulator, currentValue) => accumulator + currentValue).toFixed(2)): '0.00';
    }

    get invoices_payment_amount() {
        const invoices_payments = this.invoices.map(x => +x.payment_amount);
        return invoices_payments.length ? +(invoices_payments.reduce((accumulator, currentValue) => accumulator + currentValue).toFixed(2)): '0.00';
    }

    get serialize() {
        return {
            id: this.id,
            sending_date: Tools.formatDate(this.sending_date, 'dd-MM-yyyy HH:mm'),
            send_to: this.send_to,
            subject: this.subject,
            message: this.message,
            invoices: this.invoices.map(x => x.serialize),
            invoice_fields: [...this.invoice_fields]
        }
    }

    get serializeDb() {
        return {
            id: this.id,
            sending_date: Tools.formatDate(this.sending_date, 'yyyy-MM-dd HH:mm:ss'),
            send_to: this.send_to,
            subject: this.subject,
            message: this.message,
            invoices: this.invoices.map(x => x.serialize),
            invoice_fields: [...this.invoice_fields]
        }
    }
}
