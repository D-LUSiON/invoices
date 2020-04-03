import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Invoice } from './classes/invoice';
import { Status } from './classes/status.enum';
import { Tools, TreeData, TreeItem, ElectronClientService, StateManagerService, Document } from '@shared';
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
        private _electronClient: ElectronClientService,
        private _stateManager: StateManagerService,
    ) {

        this._electronClient.getAll('invoices').subscribe(results => {
            this.invoices = results.map(result => new Invoice(result));
            this.invoices$.next(this.invoices);
            const treeData = this._createTree();
            this.treeData = treeData;
            this.tree$.next(this.treeData);
        });
    }

    get tree() {
        return [];
    }

    private _createTree(invoices?: Invoice[]) {
        if (!invoices) invoices = this.invoices;
        const treeData = [];

        const years = Array.from(new Set(invoices.map(invoice => invoice.issue_date.getFullYear())));

        years.forEach((year, idx_year: number) => {
            const treeItemYear = {
                title: year.toString(),
                branch: true,
                expanded: idx_year === 0,
                children: []
            };
            const filtered_by_year = invoices.filter(invoice => invoice.issue_date.getFullYear() === year);
            const months = [...new Set(filtered_by_year.map(invoice => invoice.issue_date.getMonth() + 1))];
            months.forEach((month, idx_month: number) => {
                const treeItemMonth = {
                    title: month.toString(),
                    branch: true,
                    expanded: idx_month === 0,
                    children: []
                };

                const filtered_by_month = filtered_by_year.filter(invoice => invoice.issue_date.getMonth() + 1 === month);
                treeItemMonth.children = filtered_by_month.map(x => new TreeItem({
                    id: x._id,
                    heading: `${x.title} / ${x.payment_amount}лв. / ${Tools.formatDate(x.issue_date, 'YYYY-MM-dd')}`,
                    title: x.title,
                    obj: x,
                    branch: false
                }));
                treeItemYear.children.push(treeItemMonth);
            });
            treeData.push(treeItemYear);
        });

        return treeData;
    }

    filterInvoices(str: string) {
        const filtered = this.invoices.filter(inv => inv.title.toLowerCase().includes(str.toLowerCase()));
        return this._createTree(filtered);
    }

    saveInvoice(invoice: Invoice) {
        return this._electronClient.save('invoice', invoice).pipe(tap((data) => {
            const idx = this.invoices.findIndex(inv => inv.id === data[0]);
            if (!invoice.id && idx === -1) {
                invoice.id = data[0];
                this.invoices.push(invoice);
            } else {
                this.invoices[idx] = invoice;
            }
            this.invoices$.next(this.invoices);

            const treeData = this._createTree();
            this.treeData = treeData;
            this.tree$.next(this.treeData);

            this._stateManager.updateDocument(new Document({
                id: invoice.id,
                title: invoice.title,
                module: 'Invoices',
                inputs: {
                    invoice: invoice
                }
            }));
            return invoice;
        }));
    }
}
