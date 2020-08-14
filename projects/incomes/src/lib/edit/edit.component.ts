import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElectronClientService, TranslationsService, StateManagerService, Tools } from '@shared';
import { ProvidersService, Provider } from '@providers';
// import { IncomesService } from '../incomes.service';
import { IncomesService } from '@incomes';
import { Income } from '../classes';

@Component({
    selector: 'inv-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    @Input() income: Income = new Income();
    @Output() incomeChange: EventEmitter<Income> = new EventEmitter();

    incomeForm: FormGroup;

    providers: Provider[] = [];
    choosen_provider: Provider = new Provider();

    bank_accounts: { id: string, title: string }[] = [];

    @HostListener('window:keyup', ['$event']) saveAccelerator(e: KeyboardEvent) {
        if (e.ctrlKey && e.key.toLowerCase() === 's' && this.incomeForm.valid) {
            this.onSubmit();
        }
    }

    subs: Subscription = new Subscription();

    constructor(
        private _electron: ElectronClientService,
        private _fb: FormBuilder,
        private _translateService: TranslationsService,
        private _providersService: ProvidersService,
        private _incomesService: IncomesService,
        private _stateManager: StateManagerService,
    ) {
        this.subs.add(
            this._providersService.providers$.subscribe(providers => {
                if (providers.length) {
                    this.providers = providers;
                    if (this.income.provider?.id) {
                        this.choosen_provider = this.income.provider;

                        this.incomeForm.patchValue({
                            provider: this.choosen_provider
                        });
                    }
                }
            })
        );

        this.subs.add(
            this._incomesService.bankAccounts$.subscribe(bank_accs => {
                this.bank_accounts = bank_accs;
                console.log(`this.bank_accounts`, this.bank_accounts);
            })
        );

        this._initForm();
    }

    ngOnInit(): void {
        this.incomeForm.patchValue({
            ...this.income,
            'date': Tools.formatDate(this.income.date, 'YYYY-MM-dd')
        });
    }

    get today() {
        const date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();

        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    }

    select(e) {
        console.log(`bank acc select`, e);

    }

    private _initForm() {
        this.incomeForm = this._fb.group({
            'id': this._fb.control(this.income.id),
            'amount': this._fb.control(this.income.amount, [Validators.required]),
            'date': this._fb.control(Tools.formatDate(this.income.date, 'YYYY-MM-dd'), [Validators.required]),
            'provider': this._fb.control(this.income.provider, [Validators.required]),
            // add bank accounts to providers and specify which bank aoound you've received from
            // 'provider_bank_account': this._fb.control(this.income.provider, [Validators.required]),
            'bank_account': this._fb.control(this.income.bank_account, [Validators.required]),
            'tax_included': this._fb.control(this.income.tax_included),
            'notes': this._fb.control(this.income.notes),
        });

        this.incomeForm.valueChanges.subscribe(changes => {
            this.income = new Income(changes);
            this.incomeChange.emit(this.income);

            if (this.incomeForm.invalid)
                console.log(`this.incomeForm.invalid`, this.incomeForm);

        });
    }

    async onSubmit() {
        console.log(`Saving income:`, this.income);

        this._incomesService.saveIncome(this.income).subscribe(income => {
            if (income.error) {
                console.error(`Error saving income`, this.income, income.error);
                this._stateManager.notification$.next({
                    type: 'error',
                    message: `${this._translateService.translate('Error saving income!', 'incomes')} ${income.error}`
                });
            } else {
                this.income = income;
                this.incomeChange.emit(this.income);
                this.incomeForm.patchValue({
                    ...this.income,
                    'date': Tools.formatDate(this.income.date, 'YYYY-MM-dd')
                });
                this.incomeForm.markAsPristine();
                this._stateManager.notification$.next({
                    type: 'success',
                    message: this._translateService.translate('Income saved successfuly!', 'incomes')
                });
                console.log(`Income saved:`, this.income);
            }
        }, err => {
            console.error(`Error saving income`, this.income, err);
            this._stateManager.notification$.next({
                type: 'error',
                message: this._translateService.translate('Error saving income!', 'incomes')
            });
        });
    }

}
