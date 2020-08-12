import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { ProvidersService } from '@providers';
import { StateManagerService, TranslationsService, ElectronClientService } from '@shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Provider } from '../classes';

@Component({
    selector: 'inv-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
    @Input() provider: Provider = new Provider();
    @Output() providerChange: EventEmitter<Provider> = new EventEmitter();

    providerForm: FormGroup;

    @HostListener('window:keyup', ['$event']) saveAccelerator(e: KeyboardEvent) {
        if (e.ctrlKey && e.key.toLowerCase() === 's' && this.providerForm.valid) {
            this.onSubmit();
        }
    }

    constructor(
        private _electron: ElectronClientService,
        private _providersService: ProvidersService,
        private _stateManager: StateManagerService,
        private _translateService: TranslationsService,
        private _fb: FormBuilder
    ) {
        this._initForm();
    }

    ngOnInit(): void {
        this.providerForm.patchValue(this.provider);
    }

    private _initForm() {
        this.providerForm = this._fb.group({
            'id': this._fb.control(this.provider.id),
            'organization': this._fb.control(this.provider.organization, [Validators.required]),
            'acc_person': this._fb.control(this.provider.acc_person),
            'address': this._fb.control(this.provider.address),
            'vat': this._fb.control(this.provider.vat, [Validators.required]),
        });

        this.providerForm.valueChanges.subscribe(changes => {
            this.provider = new Provider(changes);
            this.providerChange.emit(this.provider);
        });
    }

    async onSubmit() {
        if (!this.provider.vat.startsWith('BG')) {
            const result = await this._electron.remote.dialog.showMessageBox(this._electron.window, {
                type: 'question',
                buttons: [
                    this._translateService.translate('Yes', 'providers'),
                    this._translateService.translate('No', 'providers'),
                ],
                title: this._translateService.translate('Provider VAT registration', 'providers'),
                message: this._translateService.translate('Does this provider has VAT registration?', 'providers')
            });
            if (result.response === 0)
                this.provider.vat = `BG${this.provider.vat}`;
        }

        this._providersService.saveProvider(this.provider).subscribe(provider => {
            if (provider.error) {
                console.error(`Error saving provider`, this.provider, provider.error);
                this._stateManager.notification$.next({
                    type: 'error',
                    message: `${this._translateService.translate('Error saving provider!', 'providers')} ${provider.error}`
                });
            } else {
                this.provider = provider;
                this.providerForm.patchValue(this.provider);
                this.providerForm.markAsPristine();
                this._stateManager.notification$.next({
                    type: 'success',
                    message: this._translateService.translate('Provider saved successfuly!', 'providers')
                });
            }
        }, err => {
            console.error(`Error saving provider`, this.provider, err);
            this._stateManager.notification$.next({
                type: 'error',
                message: this._translateService.translate('Error saving provider!', 'providers')
            });
        });
    }

}
