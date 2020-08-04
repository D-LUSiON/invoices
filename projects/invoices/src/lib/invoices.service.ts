import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Invoice } from './classes/invoice';
import { Tools, TreeData, TreeItem, ElectronClientService, StateManagerService, Document, Month, TranslationsService } from '@shared';
import { tap, map } from 'rxjs/operators';
import { ProvidersService } from '@providers';
import { Status } from './classes';
import { SettingsService } from '@settings';
import { OpenDialogReturnValue } from 'electron';
// import { SendingService } from '@sending';

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
        private _electron: ElectronClientService,
        private _stateManager: StateManagerService,
        private _providersService: ProvidersService,
        // private _sendingService: SendingService,
        private _translate: TranslationsService,
        private _settingsService: SettingsService,
    ) {
        this._electron.getAll('invoices').subscribe(results => {
            this._manageInvoicesResults(results);
        });
        this._settingsService.settings$.subscribe((settings) => {
            this.currency_sign = settings?.general?.currency_sign || '';
        });
    }

    get tree() {
        return [];
    }

    private _manageInvoicesResults(results?: object[]) {
        if (results && results instanceof Array)
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

    importOldDatabase(result: OpenDialogReturnValue): Promise<[string, string]> {
        return new Promise((resolve, reject) => {
            if (result.filePaths[0].endsWith('.json') || result.filePaths[0].endsWith('.db')) {
                this._electron.get('file', result.filePaths).subscribe((files: string[]) => {
                    let imported_invoices = [];
                    if (result.filePaths[0].endsWith('.json')) {
                        try {
                            imported_invoices = files.map(file => JSON.parse(file))[0];
                        } catch (error) {
                            reject([
                                this._translate.translate('Error occured when importing!', 'invoices'),
                                this._translate.translate(`Error parsing file contents!`, 'invoices')
                            ])
                        }
                    } else if (result.filePaths[0].endsWith('.db')) {
                        imported_invoices = files.map(file => {
                            const file_rows = file.split('\n');
                            const json = file_rows.filter(row => !!row).map(row => {
                                try {
                                    return JSON.parse(row);
                                } catch (error) {
                                    return row;
                                }
                            });
                            return json;
                        })[0];
                    }

                    const file_name = result.filePaths[0].split(/(\/|\\)/).pop();
                    const file_path = result.filePaths[0].replace(file_name, '');

                    if (imported_invoices.length) {
                        this._electron.get('invoices:xlsx-files', file_path).subscribe(xlsx_files => {
                            this._electron.remote.dialog.showMessageBox(this._electron.window, {
                                type: 'question',
                                buttons: [
                                    this._translate.translate('Merge', 'invoices'),
                                    this._translate.translate('Overwrite', 'invoices'),
                                ],
                                title: this._translate.translate('Merge or Overwrite?', 'invoices'),
                                message: this._translate.translate('What do you want to do with the imported results?', 'invoices')
                            }).then(result => {
                                const mode = result.response ? 'overwrite' : 'merge';
                                this.importInvoices(imported_invoices, xlsx_files, mode).subscribe(results => {
                                    this._manageInvoicesResults(results);
                                    this._providersService.getSaved();
                                    // this._sendingService.getSaved();
                                    resolve([
                                        this._translate.translate('Import successful!', 'invoices'),
                                        this._translate.translate(`Successful import from Invoices v2+ database!`, 'invoices')
                                    ]);
                                });
                            });
                        });
                    }
                });
            } else {
                reject([
                    this._translate.translate('Error occured when importing!', 'invoices'),
                    this._translate.translate(`File you've choosen could not be parsed!\nValid extensions are only .db and .json!`, 'invoices')
                ]);
            }
        });
    }

    importInvoices(invoices: any[], xlsx_files: any[], mode: 'merge' | 'overwrite') {
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
            if (mode === 'merge')
                x.provider.id = providers.find(y => y.vat === x.provider.vat)?.id || null;
            return new Invoice(x);
        });

        return this._electron.save('invoices:multiple', {
            mode,
            invoices: invoices.map(x => x.dbSerialize),
            xlsx_files
        }).pipe(
            tap((results) => {
                this._manageInvoicesResults(results);
                return results;
            })
        );

    }

    saveInvoice(invoice: Invoice) {
        return this._electron.save('invoice', invoice).pipe(map(([saved_invoice]) => {
            console.log(`Received data:`, saved_invoice);

            saved_invoice = new Invoice(saved_invoice);

            const idx = this.invoices.findIndex(inv => inv.id === saved_invoice.id);

            if (!invoice.id && idx === -1) {
                this.invoices.push(saved_invoice);
            } else {
                this.invoices[idx] = saved_invoice;
            }

            this._manageInvoicesResults();

            this._stateManager.updateDocument(new Document({
                id: saved_invoice.id,
                title: saved_invoice.title,
                module: 'Invoices',
                inputs: {
                    invoice: saved_invoice
                }
            }));
            return saved_invoice;
        }));
    }

    removeInvoice(invoice: Invoice) {
        return this._electron.remove('invoice', invoice).pipe(tap((data) => {
            if (data.error) {
                return throwError(data.error);
            } else {
                const idx = this.invoices.findIndex(inv => inv.id === data[0]);
                this.invoices.splice(idx, 1);
                this.invoices$.next(this.invoices);
                return invoice;
            }
        }));
    }
}
