import { Injectable } from '@angular/core';
import { TreeData, ElectronClientService, StateManagerService, TranslationsService, Month, TreeItem, Tools, Document } from '@shared';
import { BehaviorSubject, throwError } from 'rxjs';
import { ProvidersService } from '@providers';
import { SettingsService } from '@settings';
import { Income } from './classes';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class IncomesService {

    treeDataAll = new TreeData([]);
    treeAll$: BehaviorSubject<TreeData> = new BehaviorSubject(this.treeDataAll);

    incomes: Income[] = [];
    incomes$: BehaviorSubject<Income[]> = new BehaviorSubject(this.incomes);

    bankAccounts: { id: string, title: string }[] = [];
    bankAccounts$: BehaviorSubject<{ id: string, title: string }[]> = new BehaviorSubject(this.bankAccounts);

    currency_sign: string = '';

    constructor(
        private _electron: ElectronClientService,
        private _stateManager: StateManagerService,
        private _providersService: ProvidersService,
        private _settingsService: SettingsService,
        private _translate: TranslationsService,

    ) {
        this._electron.getAll('incomes').subscribe(results => {
            this._manageIncomesResults(results);
        });
        this._settingsService.settings$.subscribe((settings) => {
            this.currency_sign = settings?.general?.currency_sign || '';
        });
    }

    private _manageIncomesResults(results?: object[]) {
        if (results && results instanceof Array)
            this.incomes = results.map(result => new Income(result));

        this.incomes$.next(this.incomes);

        this.treeDataAll = this._createTree();
        this.treeAll$.next(this.treeDataAll);
        this._extractOwnBankAccounts();
    }

    private _extractOwnBankAccounts() {
        const bank_accs = this.incomes.map(income => income.bank_account);
        this.bankAccounts = [...new Set(bank_accs)].map(x => ({id: x, title: x}));
        this.bankAccounts$.next(this.bankAccounts);
    }

    private _createTree(incomes?: Income[]) {
        if (!incomes) incomes = this.incomes;
        incomes = incomes.sort((x, next) => {
            if (x.date < next.date) return -1;
            if (x.date > next.date) return 1;
            if (x.date === next.date) return 0;
        }).reverse();
        const treeData = [];

        const years = Array.from(new Set(incomes.map(income => income.date.getFullYear())));

        years.forEach((year, idx_year: number) => {
            const treeItemYear = {
                title: year.toString(),
                branch: true,
                expanded: idx_year === 0,
                children: []
            };
            const filtered_by_year = incomes.filter(income => income.date.getFullYear() === year);
            const months = [...new Set(filtered_by_year.map(income => income.date.getMonth()))];
            months.forEach((month, idx_month: number) => {
                const treeItemMonth = {
                    title: this._translate.translate(Month[month]),
                    branch: true,
                    expanded: idx_year === 0 && idx_month === 0,
                    children: []
                };

                const filtered_by_month = filtered_by_year.filter(income => income.date.getMonth() === month);
                treeItemMonth.children = filtered_by_month.map(x => new TreeItem({
                    id: x._id,
                    heading: `${x.provider?.organization || ''} / ${x.amount} ${this.currency_sign} / ${Tools.formatDate(x.date, 'YYYY-MM-dd')}`,
                    title: x.provider?.organization || '',
                    obj: x,
                    branch: false
                }));
                treeItemYear.children.push(treeItemMonth);
            });
            treeData.push(treeItemYear);
        });

        return treeData;
    }

    saveIncome(income: Income) {
        return this._electron.save('income', income).pipe(map(([saved_income]) => {
            saved_income = new Income(saved_income);

            const idx = this.incomes.findIndex(inv => inv.id === saved_income.id);

            if (!income.id && idx === -1) {
                this.incomes.push(saved_income);
            } else {
                this.incomes[idx] = saved_income;
            }

            this._manageIncomesResults();

            this._stateManager.updateDocument(new Document({
                id: saved_income.id,
                title: saved_income.title,
                module: 'Incomes',
                inputs: {
                    income: saved_income
                }
            }));
            return saved_income;
        }));
    }

    removeIncome(income: Income) {
        return this._electron.remove('income', income).pipe(tap((data) => {
            if (data.error) {
                return throwError(data.error);
            } else {
                const idx = this.incomes.findIndex(inv => inv.id === data[0]);
                this.incomes.splice(idx, 1);
                this._manageIncomesResults(this.incomes);
                return income;
            }
        }));
    }
}
