import { Component, OnInit, Input, OnChanges, HostListener, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Invoice } from '../classes/invoice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tools, StateManagerService } from '@shared';
import { ProvidersService } from '@providers';
import { InvoicesService } from '../invoices.service';
import { Goods } from '../classes';

@Component({
    selector: 'inv-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent implements OnInit, OnChanges {

    @Input() invoice: Invoice = new Invoice();
    @Output() invoiceChange: EventEmitter<Invoice> = new EventEmitter();

    invoiceForm: FormGroup;

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
        this._initForm();
    }

    ngOnInit(): void {
        console.log(`invoice edit ngOnInit`, this.invoice);

        this.invoiceForm.patchValue({
            ...this.invoice,
            'issue_date': Tools.formatDate(this.invoice.issue_date, 'YYYY-MM-dd')
        });
    }

    ngOnChanges(changes) {
        console.log(`invoice edit change`, changes);
    }

    private _initForm() {
        this.invoice.goods.push(new Goods());
        this.invoiceForm = this._fb.group({
            '_id': this._fb.control(this.invoice._id),
            'status': this._fb.control(this.invoice.status),
            'number': this._fb.control(this.invoice.number, [Validators.required]),
            'issue_date': this._fb.control(Tools.formatDate(this.invoice.issue_date, 'YYYY-MM-dd'), [Validators.required]),
            'issue_place': this._fb.control(this.invoice.issue_place),
            // 'recipient': this._fb.control(this.invoice.recipient, [/* TODO: create custom validator */]),
            'type': this._fb.control(this.invoice.type),
            'notes': this._fb.control(this.invoice.notes),
            'provider': this._fb.group({
                'id': this._fb.control(this.invoice.provider.id),
                'organization': this._fb.control(this.invoice.provider.organization, [Validators.required]),
                'acc_person': this._fb.control(this.invoice.provider.acc_person),
                'address': this._fb.control(this.invoice.provider.address),
                'vat': this._fb.control(this.invoice.provider.vat, [Validators.required]),
                'vat2': this._fb.control(this.invoice.provider.vat2)
            }),
            'goods': this._buildGoodsRows,
            'creation_date': this._fb.control(this.invoice.creation_date),
            'update_date': this._fb.control(this.invoice.update_date),
        });

        this.invoiceForm.valueChanges.subscribe(changes => {
            this.invoice = new Invoice(changes);
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
        // this.invoiceForm.controls['goods'].
        this.invoice.goods.push(new Goods());
        this.invoiceForm.setControl('goods', this._buildGoodsRows);
    }

    removeNewGoodsRow(idx: number) {
        // this.invoiceForm.controls['goods'].
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
        this._invoicesService.saveInvoice(this.invoice).subscribe(invoice => {
            console.log(`Invoice saved:`, invoice);
            this.invoice = invoice;
            this.invoiceForm.patchValue(this.invoice);
            this.invoiceForm.markAsPristine();
            // this._invoicesService.
        }, err => {
            console.log(`Error saving invoice`, this.invoice, err);
        })
    }

}
