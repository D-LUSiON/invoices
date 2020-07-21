import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '@settings';
import { Subscription } from 'rxjs';
import { Invoice, InvoicesService, Status } from '@invoices';
import { Tools, TranslationsService } from '@shared';
import { SendingService } from '../sending.service';
import { Sending } from '../classes';
import { send } from 'process';

@Component({
    selector: 'lib-sending-edit',
    templateUrl: 'edit.component.html',
    styleUrls: ['edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

    sendingForm: FormGroup;
    settings: { [key: string]: any } = {};

    active_invoices: Invoice[] = [];
    selected_invoices: Invoice[] = [];

    totalNoVAT: string = '0.00';
    totalVAT: string = '0.00';
    totalPayment: string = '0.00';
    selectedNoVAT: string = '0.00';
    selectedVAT: string = '0.00';
    selectedPayment: string = '0.00';

    subs: Subscription = new Subscription();

    constructor(
        private _fb: FormBuilder,
        private _sendingService: SendingService,
        private _settingsService: SettingsService,
        private _invoicesService: InvoicesService,
        private _translate: TranslationsService
    ) {
        this.subs.add(
            this._settingsService.settings$.subscribe((settings) => {
                console.log(`settings`, settings);
                this.settings = settings;
                if (this.sendingForm)
                    this.sendingForm.patchValue({
                        'send_to': this.settings?.accountant?.email || ''
                    });
            })
        );
        this.subs.add(
            this._invoicesService.invoices$.subscribe((invoices) => {
                this.active_invoices = invoices?.filter(invoice => invoice.status === Status.New) || [];
                const invoices_totals = this.active_invoices.map(x => +x.total_sum);
                this.totalNoVAT = Tools.formatSum(invoices_totals.length ? invoices_totals.reduce((acc, val) => (acc || 0) + val) : 0);

                const invoices_vats = this.active_invoices.map(x => +x.total_vat);
                this.totalVAT = Tools.formatSum(invoices_vats.length ? invoices_vats.reduce((acc, val) => (acc || 0) + val) : 0);

                const invoices_payments = this.active_invoices.map(x => +x.payment_amount);
                this.totalPayment = Tools.formatSum(invoices_payments.length ? invoices_payments.reduce((acc, val) => (acc || 0) + val) : 0);
            })
        );
        this._initForm();
    }

    ngOnInit(): void {
    }

    private _initForm() {
        const prev_month = new Date();
        prev_month.setMonth(prev_month.getMonth() - 1);
        let sending_subject = `${this._translate.translate('Invoices for', 'sending')} ${this._translate.translate(Tools.formatDate(prev_month, 'LL'))} ${prev_month.getFullYear()}`;
        this.sendingForm = this._fb.group({
            'id': this._fb.control(null),
            'send_to': this._fb.control(this.settings?.accountant?.email || '', [Validators.required, Validators.email]),
            'subject': this._fb.control(sending_subject, [Validators.required]),
            'message': this._fb.control(''),
            'invoices': this._fb.control([], [Validators.required]),
        });

        // this.sendingForm.valueChanges.subscribe(changes => {
        //     this.active_invoices = [...this.active_invoices];
        //     console.log(`Form changed:`, this.sendingForm.value);
        // });
    }

    checkAdded(invoice: Invoice) {
        return !!this.selected_invoices.filter(x => x.id === invoice.id).length;
    }

    checkSelectedAll() {
        return this.selected_invoices.length === this.active_invoices.length;
    }

    selectAll() {
        if (this.sendingForm.value['invoices'].length === this.active_invoices.length) {
            this.selected_invoices = [];
        } else {
            this.selected_invoices = [...this.active_invoices]
        }
        this.recalculateSelected();
        this.sendingForm.patchValue({
            'invoices': this.selected_invoices.map(x => x.id)
        });
    }

    selectInvoice(invoice: Invoice) {
        const idx = this.selected_invoices.findIndex(x => x.id === invoice.id);
        if (idx > -1) {
            this.selected_invoices.splice(idx, 1);
        } else {
            this.selected_invoices = [...this.selected_invoices, invoice];
        }
        this.recalculateSelected();
        this.sendingForm.patchValue({
            'invoices': [...this.selected_invoices].map(x => x.id)
        });
    }

    recalculateSelected() {
        const total_sum = this.selected_invoices.map(x => +x.total_sum);
        const total_vat = this.selected_invoices.map(x => +x.total_vat);
        const payment_amount = this.selected_invoices.map(x => +x.payment_amount);
        this.selectedNoVAT = Tools.formatSum(
            total_sum.length ? total_sum.reduce((acc, val) => (acc || 0) + val) : 0
        );
        this.selectedVAT = Tools.formatSum(
            total_vat.length ? total_vat.reduce((acc, val) => (acc || 0) + val) : 0
        );
        this.selectedPayment = Tools.formatSum(
            payment_amount.length ? payment_amount.reduce((acc, val) => (acc || 0) + val) : 0
        );
    }

    onSubmit() {
        if (this.sendingForm.valid) {
            console.log(`this.settings?.accountant?.invoice_fields`, this.settings?.accountant?.invoice_fields);

            const sending = new Sending({
                ...this.sendingForm.value,
                invoices: this.active_invoices.filter(x => this.sendingForm.value['invoices'].includes(x.id)),
                invoice_fields: [...(this.settings?.accountant?.invoice_fields || [])]
            });
            console.log(`Sending value:`, sending);
            this._sendingService.save(sending).then((response) => {
                console.log(`Save sending received response:`, response);
            });
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
