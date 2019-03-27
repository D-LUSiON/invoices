import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService, ElectronClientService } from '@app/core';
import { BankAccount } from '@app/shared';
import { MatSnackBar } from '@angular/material';
import { state } from '@angular/animations';

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
    private _db_data: { [key: string]: any };
    private _save_state: { [key: string]: any };

    state_form: FormGroup;
    email_form: FormGroup;
    receiver_form: FormGroup;
    db_form: FormGroup;

    bank_accounts: Array<BankAccount> = [];
    edit_bank_acc_visible: boolean = false;
    bank_acc_form: FormGroup;
    bank_acc_settings_id: string;

    constructor(
        private _fb: FormBuilder,
        // private _notificationsService: NotificationsService,
        private _snackBar: MatSnackBar,
        private _settings: SettingsService,
        private _electron: ElectronClientService,
    ) {
        this._initBankAccForm();
        this._initSaveStateForm();
        this._initMailForm();
        this._initReceiverForm();
        this._initDatabaseForm();
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

        this._settings.get('bank_accounts').subscribe(bank_accounts => {
            if (bank_accounts) {
                this.bank_acc_settings_id = bank_accounts['_id'];
                this.bank_accounts = bank_accounts['value'].map((x, idx) => new BankAccount({ ...x, _id: idx + 1 }));
            }
        });
    }

    private _initSaveStateForm() {
        this.state_form = this._fb.group({
            'state': this._fb.control(false)
        });
        console.log('requesting "save state"');
        this._settings.get('save_state').subscribe(data => {
            console.log(data);

            if (data) {
                this._save_state = data;
                this.state_form.patchValue({
                    '_id': this._save_state['_id'],
                    'host': this._save_state['value']['host'],
                    'user': this._save_state['value']['user'],
                    'password': this._save_state['value']['password'],
                });
                this.state_form.markAsPristine();
            }
        });
    }

    changeSaveState() {
        setTimeout(() => {
            this._settings.save(
                {
                    '_id': this.state_form.value['_id'],
                    'setting': 'save_state',
                    'value': {
                        'state': this.state_form.value['state'],
                    }
                }
            ).subscribe(res => {

                this.state_form.markAsPristine();

                this._snackBar.open('Успешно записахте адреса на базата данни!', '', {
                    duration: 2000
                });
            });
        }, 50);
    }

    private _initMailForm() {
        this.email_form = this._fb.group({
            '_id': this._fb.control(''),
            'email': this._fb.control('', [Validators.required]),
            'password': this._fb.control('', [Validators.required]),
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
    }

    private _initReceiverForm() {
        this.receiver_form = this._fb.group({
            '_id': this._fb.control(''),
            'email': this._fb.control('', [Validators.email]),
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
    }

    private _initDatabaseForm() {
        this.db_form = this._fb.group({
            '_id': this._fb.control(''),
            'host': this._fb.control('', [Validators.pattern(/^(localhost|(?:(?:\d{1,3}){4}\:\d+$))/i)]),
            'user': this._fb.control(''),
            'password': this._fb.control(''),
        });

        this._settings.getDatabase().subscribe(data => {
            if (data) {
                this._db_data = data;
                this.db_form.patchValue({
                    '_id': this._db_data['_id'],
                    'host': this._db_data['value']['host'],
                    'user': this._db_data['value']['user'],
                    'password': this._db_data['value']['password'],
                });
                this.db_form.markAsPristine();
            }
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

    onSubmitDatabase() {
        this._settings.save(
            {
                '_id': this.db_form.value['_id'],
                'setting': 'database',
                'value': {
                    'host': this.db_form.value['host'],
                    'user': this.db_form.value['user'],
                    'password': this.db_form.value['password'],
                }
            }
        ).subscribe(res => {
            this.db_form.markAsPristine();

            this._snackBar.open('Успешно записахте адреса на базата данни!', '', {
                duration: 2000
            });
        });
    }

    onSyncAll() {
        this._electron.send('sync_all', {}).subscribe(res => {
            console.log(res);
        });
    }
}
