import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../settings.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

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
            }),
            'sender': this._fb.group({
                'name': this._fb.control(''),
                'bulstat': this._fb.control(''),
                'vat': this._fb.control(''),
                'address': this._fb.control(''),
                'email': this._fb.control(''),
                'password': this._fb.control(''),
            }),
            'accountant_email': this._fb.group({
                'email': this._fb.control('')
            }),
        });
        this.settings_keys = Object.keys(this.settingsForm.value);
        if (!this.active_setting) this.active_setting = this.settings_keys[0];
        let save_timeout;
        this.settingsForm.valueChanges.subscribe((changes) => {
            if (this.settingsForm.dirty) {
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

    activateSetting(key: string) {
        this.active_setting = key;
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
