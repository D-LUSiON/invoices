import { Component, OnInit, Input, OnChanges, HostListener, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Invoice } from '../classes/invoice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tools, StateManagerService } from '@shared';
import { ProvidersService, Provider } from '@providers';
import { InvoicesService } from '../invoices.service';
import { Goods } from '../classes';

@Component({
    selector: 'inv-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent implements OnInit, OnChanges {

    @Input() invoice: Invoice = new Invoice();
    @Output() invoiceChange: EventEmitter<Invoice> = new EventEmitter();

    invoiceForm: FormGroup;

    providers: Provider[] = [];
    choosen_provider: Provider = new Provider();

    @HostListener('window:keyup', ['$event']) saveAccelerator(e: KeyboardEvent) {
        if (e.ctrlKey && e.key.toLowerCase() === 's' && this.invoiceForm.valid) {
            this.onSubmit();
        }
    }

    constructor(
        private _invoicesService: InvoicesService,
        private _providersService: ProvidersService,
        private _stateManager: StateManagerService,
        private _fb: FormBuilder
    ) {
        console.log(`Invoices edit constructor`);

        this._providersService.providers$.subscribe(providers => {
            if (providers.length) {
                this.providers = providers;
                if (this.invoice.provider?.id) {
                    this.choosen_provider = this.invoice.provider;

                    this.invoiceForm.patchValue({
                        provider: this.choosen_provider
                    });
                }
            }
        });
        this._providersService.getSaved().then((providers: Provider[]) => {
            this.providers = providers;
        });
    }

    ngOnInit(): void {
        this._initForm();

        this.invoiceForm.patchValue({
            ...this.invoice,
            'issue_date': Tools.formatDate(this.invoice.issue_date, 'YYYY-MM-dd')
        });
    }

    ngOnChanges(changes) {
    }

    private _initForm() {
        if (!this.invoice.goods.length)
            this.invoice.goods.push(new Goods());
        this.invoiceForm = this._fb.group({
            'id': this._fb.control(this.invoice.id),
            'status': this._fb.control(this.invoice.status),
            'number': this._fb.control(this.invoice.number, [Validators.required]),
            'issue_date': this._fb.control(Tools.formatDate(this.invoice.issue_date, 'YYYY-MM-dd'), [Validators.required]),
            'issue_place': this._fb.control(this.invoice.issue_place),
            'type': this._fb.control(this.invoice.type),
            'notes': this._fb.control(this.invoice.notes),
            'provider': this._fb.control(this.invoice.provider, [Validators.required]),
            'goods': this._buildGoodsRows,
            'creation_date': this._fb.control(this.invoice.creation_date),
            'update_date': this._fb.control(this.invoice.update_date),
        });

        this.invoiceForm.valueChanges.subscribe(changes => {

            this.invoice = new Invoice(changes);
            if (this.invoice.provider?.id) {
                this.choosen_provider = this.providers.find(x => x.id === this.invoice.provider.id);
            }
            this.invoiceChange.emit(this.invoice);
        });
    }

    private get _buildGoodsRows() {
        const rows = [];

        this.invoice.goods.forEach(x => {
            rows.push(
                this._fb.group({
                    title: this._fb.control(x.title, [Validators.required]),
                    measure: this._fb.control(x.measure),
                    quantity: this._fb.control(x.quantity),
                    price: this._fb.control(x.price),
                })
            );
        });
        return this._fb.array(rows);
    }

    addNewGoodsRow() {
        this.invoice.goods.push(new Goods());
        this.invoiceForm.setControl('goods', this._buildGoodsRows);
    }

    removeNewGoodsRow(idx: number) {
        this.invoice.goods.splice(idx, 1);
        this.invoiceForm.setControl('goods', this._buildGoodsRows);
    }

    get today() {
        const date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();

        return `${year}-${month < 10 ? '0' + month : month}-${
            day < 10 ? '0' + day : day
            }`;
    }

    onSubmit() {
        this.invoice.update_date = new Date();
        this._invoicesService.saveInvoice(this.invoice).subscribe(invoice => {
            console.log(`Invoice saved:`, invoice);
            this.invoice = invoice;
            this.invoiceForm.patchValue(this.invoice);
            this.invoiceForm.markAsPristine();
        }, err => {
            console.log(`Error saving invoice`, this.invoice, err);
        })
    }

}
