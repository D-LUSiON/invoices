import { Goods } from './goods';

export class Invoice {
    id: string; // RethinkDB ID
    status: 'new' | 'archived' = 'new'; // 'new' | 'archived'
    selected?: boolean = false;
    number: string = '';
    issue_date?: Date;
    sent_date?: Date;
    issue_place: string = 'София';
    type: string = '';
    notes: string = '';
    // provider: Provider = new Provider();
    goods: Goods[] = [];
    total_sum: number;
    creation_date: Date;
    update_date: Date;

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('id')) this.id = data.id;
            if (data.hasOwnProperty('status')) this.status = data.status;
            if (data.hasOwnProperty('selected')) this.selected = data.selected;
            if (data.hasOwnProperty('number')) this.number = data.number;
            if (data.hasOwnProperty('issue_date')) this.issue_date = new Date(data.issue_date);
            if (data.hasOwnProperty('sent_date')) this.sent_date = new Date(data.sent_date);
            if (data.hasOwnProperty('issue_place')) this.issue_place = data.issue_place;
            if (data.hasOwnProperty('type')) this.type = data.type;
            if (data.hasOwnProperty('notes')) this.notes = data.notes;
            // if (data.hasOwnProperty('provider')) this.provider = new Provider(data.provider);
            if (data.hasOwnProperty('goods')) this.goods = data.goods.map(x => new Goods(x));
            if (data.hasOwnProperty('total_sum')) this.total_sum = +data.total_sum;
            if (data.hasOwnProperty('creation_date')) this.creation_date = new Date(data.creation_date);
            if (data.hasOwnProperty('update_date')) this.update_date = new Date(data.update_date);
        }
    }
}
