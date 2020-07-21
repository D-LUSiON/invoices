import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ElectronClientService, TranslationsService } from '@shared';

@Component({
    selector: 'lib-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

    settings: { [key: string]: any } = {};

    languages: string[] = [];

    settingsForm: FormGroup;

    active_setting: string = '';

    settings_keys: string[] = [];

    subs: Subscription = new Subscription();

    invoice_fields: { name: string, title: string, width: number, checked: boolean }[] = [
        {
            name: 'number',
            title: this._translate.translate('Invoice number', 'settings'),
            width: 20,
            checked: true
        },
        {
            name: 'issue_date',
            title: this._translate.translate('Invoice issue date', 'settings'),
            width: 15,
            checked: true
        },
        {
            name: 'title',
            title: this._translate.translate('Title', 'settings'),
            width: 15,
            checked: false
        },
        {
            name: 'type',
            title: this._translate.translate('Type', 'settings'),
            width: 15,
            checked: false
        },
        {
            name: 'notes',
            title: this._translate.translate('Notes', 'settings'),
            width: 30,
            checked: false
        },
        {
            name: 'provider.name',
            title: this._translate.translate('Provider name', 'settings'),
            width: 30,
            checked: false
        },
        {
            name: 'provider.address',
            title: this._translate.translate('Provider address', 'settings'),
            width: 30,
            checked: false
        },
        {
            name: 'provider.vat',
            title: this._translate.translate('Provider VAT number', 'settings'),
            width: 30,
            checked: true
        },
        {
            name: 'goods',
            title: this._translate.translate('Goods list', 'settings'),
            width: 30,
            checked: false
        },
        {
            name: 'total_sum',
            title: this._translate.translate('Total sum without VAT', 'settings'),
            width: 20,
            checked: true
        },
        {
            name: 'total_vat',
            title: this._translate.translate('Calculated VAT', 'settings'),
            width: 20,
            checked: true
        },
        {
            name: 'payment_amount',
            title: this._translate.translate('Total sum with VAT', 'settings'),
            width: 20,
            checked: true
        },
    ];

    modules_info: { [key: string]: string }[] = [];

    constructor(
        private _fb: FormBuilder,
        private _electron: ElectronClientService,
        private _translate: TranslationsService,
        private _settingsService: SettingsService,
    ) {
        this.settings.accountant = {
            invoice_fields: [...this.invoice_fields]
        };
        this._initForm();
        this.subs.add(
            this._settingsService.settings$.subscribe(settings => {
                this.settings = {
                    ...settings,
                    accountant: {
                        ...(settings?.accountant || {}),
                        invoice_fields: (settings?.accountant?.invoice_fields || this.invoice_fields).map(x => { x.width = +x.width; return x; })
                    }
                };
                this.settingsForm.patchValue(this.settings);
                this.settingsForm.markAsPristine();
            })
        );
        this.subs.add(
            this._settingsService.languages$.subscribe(languages => {
                this.languages = languages;
            })
        );
    }

    ngOnInit(): void {
    }

    private _initForm() {
        this.settingsForm = this._fb.group({
            'general': this._fb.group({
                'language': this._fb.control(''),
                'currency_sign': this._fb.control(''),
                'backup_path': this._fb.control(''),
            }),
            'sender': this._fb.group({
                'name': this._fb.control(''),
                'bulstat': this._fb.control(''),
                'vat': this._fb.control(''),
                'address': this._fb.control(''),
                'email': this._fb.control('', [Validators.email]),
                'password': this._fb.control(''),
            }),
            'accountant': this._fb.group({
                'email': this._fb.control('', [Validators.email]),
                'invoice_fields': this._fb.control([...this.invoice_fields])
            }),
        });
        this.settings_keys = Object.keys(this.settingsForm.value);
        if (!this.active_setting) this.active_setting = this.settings_keys[0];
        let save_timeout;
        this.settingsForm.valueChanges.subscribe((changes) => {
            if (this.settingsForm.dirty && this.settingsForm.valid) {
                this.settings = this.settingsForm.value;
                if (save_timeout) clearTimeout(save_timeout);
                save_timeout = setTimeout(() => {
                    if (this.settingsForm.dirty)
                        this._settingsService.saveSettings(this.settings).subscribe(result => {
                            console.log(`Settings saved!`, result);
                            this._settingsService.settings$.next(this.settings);
                        });
                }, 500);
            }
        });
    }

    async chooseFolder() {
        const result = await this._electron.remote.dialog.showOpenDialog(this._electron.window, {
            title: this._translate.translate('Choose a backup folder'),
            properties: ['openDirectory']
        });
        if (!result.canceled) {
            this.settingsForm.markAsDirty();
            this.settingsForm.patchValue({
                'general': {
                    'backup_path': result.filePaths[0] || ''
                }
            });
        }
    }

    activateSetting(key: string) {
        this.active_setting = key;
        if (this.active_setting === 'about')
            this._settingsService.getModulesInfo().then((result: { [key: string]: string }[]) => {
                this.modules_info = result;
                console.log(this.modules_info);

            });
    }

    toggleField(idx, checked: boolean) {
        this.invoice_fields[idx].checked = checked;
        this.settingsForm.markAsDirty();
        this.settingsForm.patchValue({
            'accountant': {
                'invoice_fields': this.invoice_fields
            }
        });
    }

    changeInvoiceFieldWidth(field, width) {
        const idx = this.invoice_fields.findIndex(x => x.name === field.name);
        this.invoice_fields[idx].width = +width;
        console.log(`changeInvoiceFieldWidth`, field, width);

        this.settingsForm.patchValue({
            'accountant': {
                'invoice_fields': this.invoice_fields
            }
        });
    }

    loginWithGoogle() {
        this._electron.send('google:login', {}).subscribe((value) => {
            console.log(`google:login`, value);
        });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
