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

    constructor(
        private _fb: FormBuilder,
        private _electron: ElectronClientService,
        private _translate: TranslationsService,
        private _settingsService: SettingsService,
    ) {
        this._initForm();
        this.subs.add(
            this._settingsService.settings$.subscribe(settings => {
                this.settings = settings;
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
            'accountant_email': this._fb.group({
                'email': this._fb.control('', [Validators.email])
            }),
        });
        this.settings_keys = Object.keys(this.settingsForm.value);
        if (!this.active_setting) this.active_setting = this.settings_keys[0];
        let save_timeout;
        this.settingsForm.valueChanges.subscribe((changes) => {
            console.log(changes);

            if (this.settingsForm.dirty && this.settingsForm.valid) {
                this.settings = this.settingsForm.value;
                if (save_timeout) clearTimeout(save_timeout);
                save_timeout = setTimeout(() => {
                    if (this.settingsForm.dirty)
                        this._settingsService.saveSettings(this.settings).subscribe(result => {
                            console.log(`Settings saved!`, result);
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
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
