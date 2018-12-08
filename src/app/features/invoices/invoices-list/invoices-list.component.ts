import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InvoicesService } from '@app/core';
import { Invoice } from '@app/shared';

@Component({
    selector: 'app-invoices-list',
    templateUrl: './invoices-list.component.html',
    styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit {

    invoices: Invoice[] = [];
    filtered_invoices: Invoice[] = [];

    invoices_status: string = '';
    filter_string: string = '';

    sort_by: string = 'issue_date';
    sort: string = 'desc';

    invoices_subs: Subscription;
    view_as_list: boolean = localStorage.getItem('invoices_list_view') === 'list';

    preview_dialog_visible: boolean = false;
    preview_invoice: Invoice;

    send_dialog_visible: boolean = false;
    send_form: FormGroup;

    displayedColumns: string[] = ['recipient', 'provider', 'type_notes', 'total_sum', 'total_vat', 'total_total'];

    constructor(
        private _fb: FormBuilder,
        private _invoicesService: InvoicesService,
    ) { }

    ngOnInit() {
        this.invoices_subs = this._invoicesService.invoices$.subscribe(
            invoices => {
                this.invoices = invoices;
                this.filtered_invoices = [...this.invoices];
            }
        );
        this._invoicesService.getAll();

        this.send_form = this._fb.group({
            'subject': this._fb.control('', [Validators.required]),
            'mail_text': this._fb.control(''),
            'invoices': this._fb.control([])
        });
    }

    filterInvoices(value?) {
        if (value === undefined)
            value = this.filter_string;
        else
            this.filter_string = value;

        if (value)
            this.filtered_invoices = this.invoices.filter(
                (x: Invoice) =>
                    (x.recipient.name.toLowerCase().startsWith(value.toLowerCase()) ||
                        x.number.toLowerCase().startsWith(value.toLowerCase()) ||
                        x.provider.organization.toLowerCase().startsWith(value.toLowerCase()) ||
                        x.notes.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
                        x.type.toLowerCase().startsWith(value.toLowerCase())) &&
                    (this.invoices_status === '' || x.status === this.invoices_status)
            );
        else
            this.filtered_invoices = this.invoices.filter(invoice => this.invoices_status === '' || invoice.status === this.invoices_status);
    }

}
