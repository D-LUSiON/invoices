import { Provider } from '@providers';
import { Goods } from './goods';
import { Tools } from '@shared';
import { Status } from './status.enum';

export class Invoice {
    _id: string;
    id: number;
    status: Status = Status.New;
    selected?: boolean = false;
    number: string = '';
    issue_date: Date;
    issue_place?: string = 'София';
    type?: string = '';
    notes?: string = '';
    provider?: Provider = new Provider();
    goods: Goods[] = [];
    creation_date?: Date;
    update_date?: Date;

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('_id')) this._id = data._id;
            if (data.hasOwnProperty('id')) this.id = data.id;
            if (data.hasOwnProperty('status')) this.status = data.status;
            if (data.hasOwnProperty('selected')) this.selected = data.selected;
            if (data.hasOwnProperty('number')) this.number = data.number;
            if (data.hasOwnProperty('issue_date')) this.issue_date = new Date(data.issue_date);
            if (data.hasOwnProperty('issue_place')) this.issue_place = data.issue_place;
            if (data.hasOwnProperty('type')) this.type = data.type;
            if (data.hasOwnProperty('notes')) this.notes = data.notes;
            if (data.hasOwnProperty('provider')) this.provider = new Provider(data.provider);
            if (data.hasOwnProperty('goods')) this.goods = data.goods.map(x => new Goods(x));
            if (data.hasOwnProperty('creation_date')) this.creation_date = new Date(data.creation_date); else this.creation_date = new Date();
            if (data.hasOwnProperty('update_date')) this.update_date = new Date(data.update_date);
        }
    }

    get total_sum() {
        let sum = 0;
        this.goods.forEach(goods => {
            sum += goods.quantity * goods.price;
        });
        return Tools.formatSum(sum);
    }

    get total_vat() {
        return Tools.formatSum(parseFloat(this.total_sum) * 0.2);
    }

    get payment_amount() {
        return Tools.formatSum(parseFloat(this.total_sum) * 1.2);
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

    // get total() {
    //     if (this.total_sum === undefined) {
    //         let sum = 0;
    //         this.goods.forEach(x => {
    //             if (x.total) {
    //                 sum += x.total;
    //             } else if (x.quantity && x.price)
    //                 sum += x.quantity * x.price;
    //         });
    //         return sum.toFixed(2);
    //     } else {
    //         return this.total_sum.toFixed(2);
    //     }
    // }

    // get total_vat() {
    //     const total = parseFloat(this.total);
    //     if (this.goods.length) {
    //         const sum = parseFloat(this.total);
    //         return (sum / 100 * 20).toFixed(2);
    //     } else {
    //         return (total / 100 * 20).toFixed(2);
    //     }
    // }

    // get total_total() {
    //     const total = parseFloat(this.total);
    //     if (this.goods.length) {
    //         return (parseFloat(this.total) * 1.2).toFixed(2);
    //     } else {
    //         return (total * 1.2).toFixed(2);
    //     }
    // }

    // raw() {
    //     return {
    //         _id: this._id,
    //         number: this.number,
    //         issue_date: this.issue_date_formatted,
    //         total_sum: this.total,
    //         total_vat: this.total_vat,
    //         total_total: this.total_total,
    //         type: this.type,
    //         notes: this.notes,
    //         provider: this.provider.raw(),
    //     };
    // }
}
