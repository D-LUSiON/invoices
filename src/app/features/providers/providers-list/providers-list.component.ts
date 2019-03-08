import { Component, OnInit } from '@angular/core';
import { Provider } from '@app/shared';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProvidersService } from '@app/core';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-providers-list',
    templateUrl: './providers-list.component.html',
    styleUrls: ['./providers-list.component.scss']
})
export class ProvidersListComponent implements OnInit {

    providers: Provider[] = [];
    filtered_providers: Provider[] = [];

    providers_columns: string[] = ['organization', 'acc_person', 'address', 'vat', 'vat2', 'actions'];

    providers_subs: Subscription;

    edit_dialog_visible: boolean = false;

    provider_form: FormGroup;

    constructor(
        private _fb: FormBuilder,
        private _providersService: ProvidersService,
        private _snackBar: MatSnackBar
    ) {
        this.providers_subs = this._providersService.providers$.subscribe(providers => {
            this.providers = providers;
            this.filtered_providers = [...providers];
        });

        this._providersService.getAll();

        this._initForm();
    }

    ngOnInit() {
    }

    private _initForm() {
        this.provider_form = this._fb.group({
            '_id': this._fb.control(''),
            'organization': this._fb.control('', [Validators.required]),
            'acc_person': this._fb.control(''),
            'address': this._fb.control(''),
            'vat': this._fb.control('', [Validators.required, Validators.pattern(/^(?:bg)?\d{9}$/i)]),
            'vat2': this._fb.control('')
        });
    }

    private _resetForm() {
        this.provider_form.patchValue({});
        this.provider_form.markAsPristine();
        this.provider_form.markAsUntouched();
    }

    editProvider(event, provider: Provider) {
        event.preventDefault();
        if (!provider) provider = new Provider();
        this.provider_form.patchValue(provider);
        this.provider_form.markAsPristine();
        this.edit_dialog_visible = true;
    }

    filterProviders(value) {
        if (value === undefined)
            value = '';

        if (value)
            this.filtered_providers = this.providers.filter(
                (x: Provider) =>
                    (
                        x.organization.toLowerCase().startsWith(value.toLowerCase()) ||
                        x.acc_person.toLowerCase().startsWith(value.toLowerCase()) ||
                        x.address.toLowerCase().startsWith(value.toLowerCase()) ||
                        x.vat.toLowerCase().startsWith(value.toLowerCase()) ||
                        x.vat2.toLowerCase().startsWith(value.toLowerCase())
                    )
            );
        else
            this.filtered_providers = [...this.providers];
    }

    onSubmit() {
        const provider = new Provider(this.provider_form.value);

        const idx = this.providers.findIndex(x => x.organization === provider.organization && !provider._id);

        if (idx === -1)
            this._providersService.save(provider).subscribe((response: Provider) => {
                this.edit_dialog_visible = false;
                const message = (!provider._id && response._id) ? `Успешно създадохте ${provider.organization}!` : `Успешно редактирахте ${provider.organization}!`;
                this._snackBar.open(message, '', {
                    duration: 2000,
                });
            });
        else
            alert('Вече съществува получател с такова име!');
    }

    onRemove(provider: Provider) {
        if (confirm(`Сигурни ли сте, че искате да изтриете "${provider.organization}"?`))
            this._providersService.remove(provider).subscribe(response => {
                this._snackBar.open(`Успешно изтрихте ${provider.organization}!`, '', {
                    duration: 2000,
                });
            });
    }

}
