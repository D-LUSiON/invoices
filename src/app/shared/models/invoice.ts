import { Provider } from './provider';
import { Goods } from './goods';
import { Recipient } from './recipient';
import { Tools } from '../tools';

export class Invoice {
    _id: string;
    status: string = 'new'; // 'new' | 'archived'
    selected?: boolean = false;
    number: string = '';
    issue_date?: string;
    issue_place: string = 'София';
    recipient: Recipient = new Recipient();
    type: string = '';
    notes: string = '';
    provider: Provider = new Provider();
    goods: Goods[] = [];
    total_sum: number;
    creation_date: string;
    update_date: string;

    constructor(data?: Invoice) {
        if (data) {
            if (data._id) this._id = data._id;
            if (data.status) this.status = data.status;
            if (data.hasOwnProperty('selected')) this.selected = data.selected;
            if (data.number) this.number = data.number;
            if (data.issue_date) this.issue_date = data.issue_date;
            if (data.issue_place) this.issue_place = data.issue_place;
            if (data.recipient) this.recipient = new Recipient(data.recipient);
            if (data.type) this.type = data.type;
            if (data.notes) this.notes = data.notes;
            if (data.provider) this.provider = new Provider(data.provider);
            if (data.goods) this.goods = data.goods.map(x => new Goods(x));
            if (data.total_sum) this.total_sum = +data.total_sum;
            if (data.creation_date) this.creation_date = data.creation_date;
            if (data.update_date) this.update_date = data.update_date;
        }
    }

    getDateTime(date) {
        switch (date) {
            case 'issue_date':
                return this.issue_date ? new Date(this.issue_date).getTime() : null;
            case 'creation_date':
                return this.creation_date ? new Date(this.creation_date).getTime() : null;
            case 'update_date':
                return this.update_date ? new Date(this.update_date).getTime() : this.getDateTime('creation_date');
            default:
                return null;
        }
    }

    get creation_date_formatted() {
        return Tools.formatDate(this.creation_date, 'dd-MM-yyyy HH:mm');
    }
    get update_date_formatted() {
        return Tools.formatDate(this.update_date, 'dd-MM-yyyy HH:mm');
    }

    get issue_date_formatted() {
        return Tools.formatDate(this.issue_date, 'dd-MM-yyyy');
    }

    get total() {
        if (this.total_sum === undefined) {
            let sum = 0;
            this.goods.forEach(x => {
                if (x.total) {
                    sum += x.total;
                } else if (x.quantity && x.price)
                    sum += x.quantity * x.price;
            });
            return sum.toFixed(2);
        } else {
            return this.total_sum.toFixed(2);
        }
    }

    get total_vat() {
        const total = parseFloat(this.total);
        if (this.goods.length) {
            const sum = parseFloat(this.total);
            return (sum / 100 * 20).toFixed(2);
        } else {
            return (total / 100 * 20).toFixed(2);
        }
    }

    get total_total() {
        const total = parseFloat(this.total);
        if (this.goods.length) {
            return (parseFloat(this.total) * 1.2).toFixed(2);
        } else {
            return (total * 1.2).toFixed(2);
        }
    }

    raw() {
        return {
            _id: this._id,
            number: this.number,
            issue_date: this.issue_date_formatted,
            total_sum: this.total,
            total_vat: this.total_vat,
            total_total: this.total_total,
            type: this.type,
            notes: this.notes,
            provider: this.provider.raw(),
        };
    }
}
