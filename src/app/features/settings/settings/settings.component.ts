import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '@app/core';
import { BankAccount } from '@app/shared';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    // private _gmail_pass = 'shjxkaaowcvjmzmt';
    // https://www.npmjs.com/package/gmail-send

    private _gmail_data: { [key: string]: any };
    private _receiver_data: { [key: string]: any };

    email_form: FormGroup;
    receiver_form: FormGroup;

    bank_accounts: Array<BankAccount> = [];
    edit_bank_acc_visible: boolean = false;
    bank_acc_form: FormGroup;
    bank_acc_settings_id: string;

    constructor(
        private _fb: FormBuilder,
        // private _notificationsService: NotificationsService,
        private _snackBar: MatSnackBar,
        private _settings: SettingsService,
    ) {
        this._settings.get('bank_accounts').subscribe(bank_accounts => {
            if (bank_accounts) {
                this.bank_acc_settings_id = bank_accounts['_id'];
                this.bank_accounts = bank_accounts['value'].map((x, idx) => new BankAccount({ ...x, _id: idx + 1 }));
            }
        });

        this._settings.getEmail().subscribe(data => {
            if (data) {
                this._gmail_data = data;
                this.email_form.patchValue({
                    '_id': this._gmail_data['_id'],
                    'email': this._gmail_data['value']['email'].replace(/@\w+\.\w+$/i, ''),
                    'password': this._gmail_data['value']['password'],
                });
                this.email_form.markAsPristine();
            }
        });

        this._settings.getReceiverEmail().subscribe(data => {
            if (data) {
                this._receiver_data = data;
                this.receiver_form.patchValue({
                    '_id': this._receiver_data['_id'],
                    'email': this._receiver_data['value']['email'],
                });
                this.receiver_form.markAsPristine();
            }

        });
        this._initBankAccForm();
        this._initMailForm();
        this._initReceiverForm();
    }

    ngOnInit() {
    }

    private _initBankAccForm() {
        this.bank_acc_form = this._fb.group({
            '_id': this._fb.control(''),
            'bank_acc': this._fb.control('', [Validators.required]), // TODO: Add regex validator for bank account
            'bank': this._fb.control('', [Validators.required]),
            'description': this._fb.control(''),
        });
    }

    private _initMailForm() {
        this.email_form = this._fb.group({
            '_id': this._fb.control(''),
            'email': this._fb.control('', [Validators.required]),
            'password': this._fb.control('', [Validators.required]),
        });
    }

    private _initReceiverForm() {
        this.receiver_form = this._fb.group({
            '_id': this._fb.control(''),
            'email': this._fb.control('', [Validators.email]),
        });
    }

    openBankAccModal() {
        this.bank_acc_form.reset({});
        this.edit_bank_acc_visible = true;
    }

    onEditBankAcc(bank_acc: BankAccount) {
        this.bank_acc_form.patchValue(bank_acc);
        this.bank_acc_form.markAsPristine();
        this.edit_bank_acc_visible = true;
    }

    onRemoveBankAcc(bank_acc: BankAccount) {
        if (confirm('Сигурни ли сте, че искате да изтриете тази банкова сметка?')) {
            this.bank_accounts.splice(+bank_acc._id - 1, 1);
            this.onSaveBankAccounts();
        }
    }

    onSaveBankAccounts() {
        if (this.bank_acc_form.valid && this.bank_acc_form.dirty) {
            const form_bank_acc = new BankAccount(this.bank_acc_form.value);
            const _id = this.bank_acc_form.value['_id'];
            if (_id) {
                const idx = this.bank_accounts.findIndex(x => x._id === _id);
                if (idx > -1) {
                    this.bank_accounts[idx] = form_bank_acc;
                }
            } else {
                this.bank_accounts.push(form_bank_acc);
            }
        }
        this.edit_bank_acc_visible = false;
        this.onSubmitBankAccounts();
    }

    onSubmitBankAccounts() {
        this._settings.save(
            {
                '_id': this.bank_acc_settings_id,
                'setting': 'bank_accounts',
                'value': this.bank_accounts
            }).subscribe(res => {
                this.bank_acc_form.markAsPristine();

                this._snackBar.open('Успешно записахте данните за Вашите банкови сметки!', '', {
                    duration: 2000
                });
            });
    }

    onSubmitEmail() {
        this._settings.save(
            {
                '_id': this.email_form.value['_id'],
                'setting': 'email',
                'value': {
                    'email': `${this.email_form.value['email'].replace(/@\w+\.\w+?/i, '')}@gmail.com`,
                    'password': this.email_form.value['password'],
                }
            }).subscribe(res => {
                this._gmail_data = res;
                this.email_form.patchValue({
                    '_id': this._gmail_data['_id'],
                    'email': this._gmail_data['value']['email'].replace(/@\w+\.\w+$/i, ''),
                    'password': this._gmail_data['value']['password'],
                });
                this.email_form.markAsPristine();

                this._snackBar.open('Успешно записахте данните за Вашия е-мейл!', '', {
                    duration: 2000
                });
            });
    }

    onSubmitReceiver() {
        this._settings.save(
            {
                '_id': this.receiver_form.value['_id'],
                'setting': 'receiver',
                'value': {
                    'email': this.receiver_form.value['email'],
                }
            }).subscribe(res => {
                this.receiver_form.markAsPristine();

                this._snackBar.open('Успешно записахте е-мейла на Вашия счетоводител!', '', {
                    duration: 2000
                });
            });
    }

}
