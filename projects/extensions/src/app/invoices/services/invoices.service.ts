import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvoicesService {

    private _invoices: Invoice[] = [];

    invoices$: BehaviorSubject<Invoice[]> = new BehaviorSubject(this._invoices);

    constructor() {
        console.log('Hello from invoices service!');
    }

    getAll() {
        this._invoices = [
            new Invoice({
                number: '100000012345',
                issue_date: '2019-11-23 00:00:00',
                sent_date: '2019-12-10 00:00:00',
                notes: 'Fuel',
                total_sum: 135.54
            }),
            new Invoice({
                number: '600000045673',
                issue_date: '2019-11-17 00:00:00',
                sent_date: '2019-12-10 00:00:00',
                notes: 'New laptop',
                total_sum: 3545
            }),
            new Invoice({
                number: '000000123456',
                issue_date: '2019-11-3 00:00:00',
                sent_date: '2019-12-10 00:00:00',
                notes: 'Sex toys',
                total_sum: 250
            }),
            new Invoice({
                number: '230000132345',
                issue_date: '2019-11-12 00:00:00',
                sent_date: '2019-12-10 00:00:00',
                notes: 'Nitro for the car',
                total_sum: 2559
            }),
        ];

        this.invoices$.next(this._invoices);
    }
}
