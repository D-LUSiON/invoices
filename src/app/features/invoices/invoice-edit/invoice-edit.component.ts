import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InvoicesService, ProvidersService, RecipientsService } from '@app/core';
import { Recipient, Invoice, Goods, Provider } from '@app/shared';
import { Tools } from '@app/shared/tools';
import { MatSelect, MatInput } from '@angular/material';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-invoice-edit',
    templateUrl: './invoice-edit.component.html',
    styleUrls: ['./invoice-edit.component.scss']
})
export class InvoiceEditComponent implements OnInit {

    invoice_form: FormGroup;

    invoice: Invoice = new Invoice();

    providers: Provider[] = [];
    filtered_providers: Provider[] = [];
    providers_subs: Subscription;

    recipients: Recipient[] = [];
    filtered_recipients: Recipient[] = [];
    recipients_subs: Subscription;

    goods_columns: Array<string> = ['number', 'title', 'measure', 'quantity', 'price', 'total'];
    // goods_columns: Array<string> = ['№', 'Наименование на стоката/услугата', 'Мярка', 'Количество', 'Ед. цена', 'Стойност', ''];

    @ViewChild('input_with_vat') inputWithVat: ElementRef;

    total_sum_vat: number | string = '';

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _fb: FormBuilder,
        private _invoicesService: InvoicesService,
        private _providersService: ProvidersService,
        private _recipientsService: RecipientsService,
        private _snackBar: MatSnackBar
    ) {
        this._initForm();
        this.providers_subs = this._providersService.providers$.subscribe(providers => {
            this.providers = providers;
            this.filtered_providers = [...this.providers];
        });
        this._providersService.getAll();

        this.recipients_subs = this._recipientsService.recipients$.subscribe((recipients: Recipient[]) => {
            this.recipients = recipients.map((recipient: Recipient) => {
                recipient.invoices = [];
                return recipient;
            });
            this.filtered_recipients = [...this.recipients];
        });
        this._recipientsService.getAll();
    }

    ngOnInit() {
        if (this._route.snapshot.params['id'])
            this._invoicesService
                .get(this._route.snapshot.params['id'])
                .subscribe(invoice => {
                    this.invoice = invoice;
                    this.invoice_form.patchValue(this.invoice);
                });
    }

    private _initForm() {
        this.invoice_form = this._fb.group({
            '_id': this._fb.control(this.invoice._id),
            'status': this._fb.control(this.invoice.status),
            'number': this._fb.control(this.invoice.number, [Validators.required]),
            'issue_date': this._fb.control(this.invoice.issue_date, [Validators.required]),
            'issue_place': this._fb.control(this.invoice.issue_place),
            'recipient': this._fb.control(this.invoice.recipient, [/* TODO: create custom validator */]),
            'type': this._fb.control(this.invoice.type),
            'notes': this._fb.control(this.invoice.notes),
            'provider': this._fb.group({
                '_id': this._fb.control(this.invoice.provider._id),
                'organization': this._fb.control(this.invoice.provider.organization, [Validators.required]),
                'acc_person': this._fb.control(this.invoice.provider.acc_person),
                'address': this._fb.control(this.invoice.provider.address),
                'vat': this._fb.control(this.invoice.provider.vat, [Validators.required, Validators.pattern(/^(?:bg)?\d{9}$/i)]),
                'vat2': this._fb.control(this.invoice.provider.vat2)
            }),
            'goods': this.buildGoodsRows,
            'total_sum': this._fb.control(this.invoice.total_sum, [Validators.required]),
            'creation_date': this._fb.control(this.invoice.creation_date),
            'update_date': this._fb.control(this.invoice.update_date),
        });

        this.invoice_form.valueChanges.subscribe((changes: Goods[]) => {
            const upd_recepient = new Recipient(this.invoice_form.value['recepient']);
            if (!upd_recepient._id && upd_recepient.name) {
                const recepient = this.recipients.find(x => x.name === upd_recepient.name);
                if (!recepient)
                    this.recipients = [new Recipient(this.invoice_form.value['recepient']), ... this.recipients];
            }
        });
    }

    maxDate(d: Date): boolean {
        const today = new Date();
        return d.getTime() < today.getTime();
    }

    patchOrganization(select: MatSelect) {
        const new_provider = new Provider(select.value);
        const provider = this.providers.find(x => x._id === new_provider._id);
        this.invoice_form.controls['provider'].patchValue(provider || new Provider({}));
        this.invoice_form.controls['provider'].markAsDirty();
    }

    private get buildGoodsRows() {
        const rows = [];

        this.invoice.goods.forEach(x => {
            rows.push(
                this._fb.group({
                    title: this._fb.control(x.total, [Validators.required]),
                    measure: this._fb.control(x.measure),
                    quantity: this._fb.control(x.quantity),
                    price: this._fb.control(x.price),
                    total: this._fb.control(x.total, [Validators.required])
                })
            );
        });

        return this._fb.array(rows);
    }

    displayRecipientFn(recipient?: Recipient): string | undefined {
        return recipient ? recipient.name : undefined;
    }

    calcSumVat(with_vat: boolean) {
        console.log(with_vat, this.total_sum_vat);
        setTimeout(() => {
            if (with_vat) {
                this.invoice_form.patchValue({
                    'total_sum': Math.round(+this.inputWithVat.nativeElement.value / 1.2 * 100) / 100
                });
                console.log(+this.inputWithVat.nativeElement.value / 1.2, this.invoice_form.value['total_sum'], this.inputWithVat.nativeElement.value);
            } else {
                this.inputWithVat.nativeElement.value = (Math.round(this.invoice_form.value['total_sum'] * 1.2 * 100) / 100).toString();
                console.log(this.invoice_form.value['total_sum'] * 1.2, this.invoice_form.value['total_sum'], this.inputWithVat.nativeElement.value);
            }
        }, 150);
    }

    addRow() {
        const row_data = this._fb.group({
            title: this._fb.control('', [Validators.required]),
            measure: this._fb.control(''),
            quantity: this._fb.control(''),
            price: this._fb.control(''),
            total: this._fb.control('', [Validators.required])
        });

        (<FormArray>this.invoice_form.controls['goods']).push(row_data);

        this.invoice.goods.push(row_data.value);

        // TODO: Make row calculations work!
    }

    clearRowValues(row_idx: number) {
        this.invoice_form.controls['goods'].get(row_idx.toString()).reset({});
        this.invoice.goods[row_idx] = new Goods(
            this.invoice_form.controls['goods'].value
        );
    }

    removeRow(row_idx: number) {
        (<FormArray>this.invoice_form.controls['goods']).removeAt(row_idx);
        this.invoice.goods.splice(row_idx, 1);
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

    get total_sum() {
        let sum = 0;
        this.invoice_form.controls['goods'].value.forEach(x => {
            if (x.total) {
                sum += x.total;
            } else if (x.quantity && x.price) sum += x.quantity * x.price;
        });

        return sum.toFixed(2);
    }

    get total_vat() {
        if (this.invoice_form.controls['goods'].value.length) {
            const sum = parseFloat(this.total_sum);
            return (sum / 100 * 20).toFixed(2);
        } else {
            return (
                this.invoice_form.controls['total_sum'].value /
                100 *
                20
            ).toFixed(2);
        }
    }

    get total_total() {
        if (this.invoice_form.controls['goods'].value.length) {
            return (parseFloat(this.total_sum) * 1.2).toFixed(2);
        } else {
            return (
                this.invoice_form.controls['total_sum'].value * 1.2
            ).toFixed(2);
        }
    }

    onSubmit() {
        const invoice = new Invoice(this.invoice_form.value);

        if (!invoice._id)
            invoice.creation_date = Tools.formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss.mssZ');

        invoice.update_date = Tools.formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss.mssZ');

        this._invoicesService
            .save(invoice)
            .subscribe((upd_invoice: Invoice) => {
                this.invoice = upd_invoice;
                this.invoice_form.patchValue(this.invoice);

                this._snackBar.open('Успешно записахте фактурата', '', {
                    duration: 2000
                });

                if (!invoice._id && upd_invoice._id)
                    this._router.navigate(['/home', 'invoices', 'edit', upd_invoice._id]);
            });
    }

}
