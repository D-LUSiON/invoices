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

    treeData = new TreeData([]);

    invoices: Invoice[] = [];

    tree$: BehaviorSubject<TreeData> = new BehaviorSubject(this.treeData);
    invoices$: BehaviorSubject<Invoice[]> = new BehaviorSubject([]);

    constructor(
        private _electronClient: ElectronClientService
    ) {
        console.log(`Hello from invoices service!`);

        this._electronClient.getAll('invoices').subscribe(results => {
            console.log(`Loaded invoices:`, results);
            this.invoices = results.map(result => new Invoice(result));
            this.invoices$.next(this.invoices);
            this._createTree();
        });
    }

    get tree() {
        return [];
    }

    private _createTree() {
        const treeData = [];

        const years = Array.from(new Set(this.invoices.map(invoice => invoice.issue_date.getFullYear()))).sort().reverse();
        years.forEach((year, idx: number) => {
            const treeItem = {
                title: year.toString(),
                branch: true,
                expanded: idx === 0,
                children: []
            };
            const filtered_by_year = this.invoices.filter(invoice => invoice.issue_date.getFullYear() === year);
            const months = [...new Set(filtered_by_year.map(invoice => invoice.issue_date.getMonth() + 1))].reverse();
            months.forEach(month => {
                const filtered_by_month = filtered_by_year.filter(invoice => invoice.issue_date.getMonth() + 1 === month);
                treeItem.children = filtered_by_month.map(x => new TreeItem({
                    id: x._id,
                    heading: `${x.title} / ${x.payment_amount}лв. / ${Tools.formatDate(x.issue_date, 'YYYY-MM-dd')}`,
                    title: x.title,
                    obj: x,
                    branch: false
                }));
            });
            treeData.push(treeItem);
        });
        this.treeData = treeData;
        this.tree$.next(this.treeData);
    }

    saveInvoice(invoice: Invoice) {
        console.log(`Saving invoice`, invoice);

        return this._electronClient.save('invoice', invoice).pipe(tap((data) => {
            console.log(data);
            const idx = this.invoices.findIndex(inv => inv.id === data[0]);
            if (!invoice.id && idx === -1) {
                invoice.id = data[0];
                this.invoices.push(invoice);
            } else {
                this.invoices[idx] = invoice;
            }
            this.invoices$.next(this.invoices);
            this._createTree();
            return invoice;
        }));
    }
}
