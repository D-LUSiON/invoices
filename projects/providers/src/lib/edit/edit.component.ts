import { Component, OnInit, HostListener, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ProvidersService } from '../providers.service';
import { StateManagerService } from '@shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Provider } from '../classes';

@Component({
    selector: 'inv-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges {
    @Input() provider: Provider = new Provider();
    @Output() providerChange: EventEmitter<Provider> = new EventEmitter();

    providerForm: FormGroup;

    @HostListener('window:keyup', ['$event']) saveAccelerator(e: KeyboardEvent) {
        if (e.ctrlKey && e.key.toLowerCase() === 's' && this.providerForm.valid) {
            this.onSubmit();
        }
    }

    constructor(
        private _providersService: ProvidersService,
        private _stateManager: StateManagerService,
        private _fb: FormBuilder
    ) {
        this._initForm();
    }

    ngOnInit(): void {
        console.log(`initial provider`, this.provider);
        this.providerForm.patchValue(this.provider);
    }

    ngOnChanges(changes) {
        console.log(`provider edit change`, changes);
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

    onSubmit() {
        this._providersService.saveProvider(this.provider).subscribe(provider => {
            console.log(`Provider saved:`, provider);
            this.provider = provider;
            this.providerForm.patchValue(this.provider);
            this.providerForm.markAsPristine();
        }, err => {
            console.log(`Error saving provider`, this.provider, err);
        })
    }

}
