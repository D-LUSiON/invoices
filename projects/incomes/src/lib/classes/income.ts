import { Provider } from '@providers';
import { Tools } from '@shared';

export class Income {
    _id: string;
    id: number;
    amount: number = 0;
    date: Date;
    provider: Provider;
    provider_bank_account: string;
    bank_account: string;
    tax_included: boolean = true;
    notes: string;

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('id')) this.id = data['id'];
            if (data.hasOwnProperty('amount')) this.amount = data['amount'];
            if (data.hasOwnProperty('date')) this.date = new Date(data['date']);
            if (data.hasOwnProperty('provider')) this.provider = new Provider(data['provider']);
            if (data.hasOwnProperty('provider_bank_account')) this.provider_bank_account = data['provider_bank_account'];
            if (data.hasOwnProperty('bank_account')) this.bank_account = data['bank_account'];
            if (data.hasOwnProperty('tax_included')) this.tax_included = data['tax_included'];
            if (data.hasOwnProperty('notes')) this.notes = data['notes'];
        }
    }

    get amount_formatted() {
        return this.amount.toFixed(2);
    }

    get date_formatted() {
        return Tools.formatDate(this.date, 'dd-MM-yyyy');
    }

    get serialize() {
        return {
            id: this.id,
            amount: this.amount,
            date: Tools.formatDate(this.date, 'yyyy-MM-dd'),
            provider: this.provider.raw(),
            provider_bank_account: this.provider_bank_account,
            bank_account: this.bank_account,
            tax_included: this.tax_included,
            notes: this.notes,
        };
    }
}
