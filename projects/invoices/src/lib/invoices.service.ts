import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Invoice } from './classes/invoice';
import { Tools, TreeData, TreeItem, ElectronClientService, StateManagerService, Document, Month, TranslationsService } from '@shared';
import { tap } from 'rxjs/operators';
import { ProvidersService } from '@providers';
import { Status } from './classes';
import { SettingsService } from '@settings';

@Injectable({
    providedIn: 'root'
})
export class InvoicesService {

    treeDataActive = new TreeData([]);
    treeDataArchived = new TreeData([]);
    treeDataAll = new TreeData([]);

    invoices: Invoice[] = [];

    treeActive$: BehaviorSubject<TreeData> = new BehaviorSubject(this.treeDataActive);
    treeArchived$: BehaviorSubject<TreeData> = new BehaviorSubject(this.treeDataArchived);
    treeAll$: BehaviorSubject<TreeData> = new BehaviorSubject(this.treeDataAll);
    invoices$: BehaviorSubject<Invoice[]> = new BehaviorSubject([]);

    currency_sign: string = '';

    constructor(
        private _electronClient: ElectronClientService,
        private _stateManager: StateManagerService,
        private _providersService: ProvidersService,
        private _translate: TranslationsService,
        private _settingsService: SettingsService,
    ) {
        this._electronClient.getAll('invoices').subscribe(results => {
            this._manageInvoicesResults(results);
        });
        this._settingsService.settings$.subscribe((settings) => {
            this.currency_sign = settings?.general?.currency_sign || '';
        });
    }

    get tree() {
        return [];
    }

    private _manageInvoicesResults(results: object[]) {
        this.invoices = results.map(result => new Invoice(result));
        this.invoices$.next(this.invoices);
        this.treeDataActive = this._createTree(this.invoices.filter(x => x.status !== Status.Archived));
        this.treeActive$.next(this.treeDataActive);
        this.treeDataArchived = this._createTree(this.invoices.filter(x => x.status === Status.Archived));
        this.treeArchived$.next(this.treeDataArchived);
        this.treeDataAll = this._createTree();
        this.treeAll$.next(this.treeDataAll);
    }

    private _createTree(invoices?: Invoice[]) {
        if (!invoices) invoices = this.invoices;
        invoices = invoices.sort((x, next) => {
            if (x.issue_date < next.issue_date) return -1;
            if (x.issue_date > next.issue_date) return 1;
            if (x.issue_date === next.issue_date) return 0;
        }).reverse();
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
            const months = [...new Set(filtered_by_year.map(invoice => invoice.issue_date.getMonth()))];
            months.forEach((month, idx_month: number) => {
                const treeItemMonth = {
                    title: this._translate.translate(Month[month]),
                    branch: true,
                    expanded: idx_year === 0 && idx_month === 0,
                    children: []
                };

                const filtered_by_month = filtered_by_year.filter(invoice => invoice.issue_date.getMonth() === month);
                treeItemMonth.children = filtered_by_month.map(x => new TreeItem({
                    id: x._id,
                    heading: `${x.title} / ${x.payment_amount} ${this.currency_sign} / ${Tools.formatDate(x.issue_date, 'YYYY-MM-dd')}`,
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

    filterInvoices(str: string, invoices?: Invoice[]) {
        if (!invoices) invoices = this.invoices;
        const filtered = invoices.filter(inv => inv.title.toLowerCase().includes(str.toLowerCase()));
        return this._createTree(filtered);
    }

    importInvoices(invoices: any[], mode: 'merge' | 'overwrite') {
        const providers = this._providersService.providers;
        invoices = invoices.map(x => {
            x.goods = [
                {
                    title: x.notes,
                    measure: 'бр.',
                    quantity: 1,
                    price: x.total_sum
                }
            ];
            x.provider.id = providers.find(y => y.vat === x.provider.vat)?.id || null;
            return new Invoice(x);
        });

        return this._electronClient.save('invoices:multiple', {
            mode,
            invoices: invoices.map(x => x.serialize)
        }).pipe(
            tap((results) => {
                this._manageInvoicesResults(results);
                return results;
            })
        );

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
            this.treeDataActive = treeData;
            this.treeActive$.next(this.treeDataActive);

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
