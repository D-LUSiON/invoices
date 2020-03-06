import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Invoice } from './classes/invoice';
import { Status } from './classes/status.enum';
import { Tools, TreeData, TreeItem, ElectronClientService } from '@shared';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class InvoicesService {

    private _treeData = new TreeData([]);

    private _invoices: Invoice[] = [
        // new Invoice({
        //     _id: Tools.makeid(),
        //     status: Status.New,
        //     number: '1000000123456',
        //     issue_date: '2020-01-20',
        //     provider: {
        //         _id: Tools.makeid(),
        //         organization: 'OMV'
        //     },
        //     notes: 'бензин'
        // }),
        // new Invoice({
        //     _id: Tools.makeid(),
        //     status: Status.New,
        //     number: '1000000872367',
        //     issue_date: '2020-01-19',
        //     provider: {
        //         _id: Tools.makeid(),
        //         organization: 'Ozone.bg'
        //     },
        //     notes: 'Nintendo Switch'
        // }),
        // new Invoice({
        //     _id: Tools.makeid(),
        //     status: Status.New,
        //     number: '1000000943693',
        //     issue_date: '2020-01-08',
        //     provider: {
        //         _id: Tools.makeid(),
        //         organization: 'D&D Service'
        //     },
        //     notes: 'ремонт на Captiva'
        // }),
        // new Invoice({
        //     _id: Tools.makeid(),
        //     status: Status.New,
        //     number: '1000000234567',
        //     issue_date: '2019-12-19',
        //     provider: {
        //         _id: Tools.makeid(),
        //         organization: 'OMV'
        //     },
        //     notes: 'бензин'
        // }),
        // new Invoice({
        //     _id: Tools.makeid(),
        //     status: Status.New,
        //     number: '1000000792345',
        //     issue_date: '2019-12-07',
        //     provider: {
        //         _id: Tools.makeid(),
        //         organization: 'OMV'
        //     },
        //     notes: 'бензин'
        // }),
        // new Invoice({
        //     _id: Tools.makeid(),
        //     status: Status.New,
        //     number: '1000000345678',
        //     issue_date: '2019-11-18',
        //     provider: {
        //         _id: Tools.makeid(),
        //         organization: 'OMV'
        //     },
        //     notes: 'бензин'
        // }),
    ];

    tree$: BehaviorSubject<TreeData> = new BehaviorSubject(this._treeData);

    constructor(
        private _electronClient: ElectronClientService
    ) {
        console.log(`Hello from invoices service!`);

        this._electronClient.getAll('invoices').subscribe(results => {
            console.log(`Loaded invoices:`, results);
            this._invoices = results.map(result => new Invoice(result));
            this._createTree();
        });
    }

    get tree() {
        return [];
    }

    private _createTree() {
        const treeData = [];

        const years = Array.from(new Set(this._invoices.map(invoice => invoice.issue_date.getFullYear()))).sort().reverse();
        years.forEach((year, idx: number) => {
            const treeItem = {
                title: year.toString(),
                branch: true,
                expanded: idx === 0,
                children: []
            };
            const filtered_by_year = this._invoices.filter(invoice => invoice.issue_date.getFullYear() === year);
            const months = [...new Set(filtered_by_year.map(invoice => invoice.issue_date.getMonth() + 1))].reverse();
            months.forEach(month => {
                const filtered_by_month = filtered_by_year.filter(invoice => invoice.issue_date.getMonth() + 1 === month);
                treeItem.children = filtered_by_month.map(x => new TreeItem({
                    id: x._id,
                    heading: `${x.provider.organization} / ${Tools.formatDate(x.issue_date, 'YYYY-MM-dd')}`,
                    title: `${x.notes || 'no notes'}`,
                    obj: x,
                    branch: false
                }));
            });
            treeData.push(treeItem);
        });
        this._treeData = treeData;
        this.tree$.next(this._treeData);
    }

    saveInvoice(invoice: Invoice) {
        console.log(`Saving invoice`, invoice);

        return this._electronClient.save('invoice', invoice).pipe(tap((data) => {
            console.log(data);
            const idx = this._invoices.findIndex(inv => inv.id === data[0]);
            if (!invoice.id && idx === -1) {
                invoice.id = data[0];
                this._invoices.push(invoice);
            } else {
                this._invoices[idx] = invoice;
            }
            return invoice;
        }));
    }
}
