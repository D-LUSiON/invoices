import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { InvoicesService, SettingsService } from '@app/core';
import { Invoice } from '@app/shared';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-invoices-list',
    templateUrl: './invoices-list.component.html',
    styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit {

    invoices: Invoice[] = [];
    filtered_invoices: Invoice[] = [];

    selection = new SelectionModel<Invoice>(true, []);

    invoices_status: 'all' | 'new' | 'archived' = 'new';
    filter_string: string = '';

    sort_by: string = 'issue_date';
    sort: string = 'desc';

    invoices_subs: Subscription;
    view_as_list: boolean = localStorage.getItem('invoices_list_view') === 'list';

    preview_dialog_visible: boolean = false;
    preview_invoice: Invoice;

    send_dialog_visible: boolean = false;
    send_form: FormGroup;
    period_form: FormGroup;

    invoices_columns: string[] = [
        'select',
        'recipient',
        'provider',
        'type_notes',
        'issue_date',
        'total_sum',
        'total_vat',
        'total_total',
        'actions'
    ];

    constructor(
        private _router: Router,
        private _fb: FormBuilder,
        private _invoicesService: InvoicesService,
        private _settingsService: SettingsService,
        private _snackBar: MatSnackBar
    ) {
        this.send_form = this._fb.group({
            'subject': this._fb.control('', [Validators.required]),
            'mail_text': this._fb.control(''),
            'invoices': this._fb.control([])
        });

        this.period_form = this._fb.group({
            'from': this._fb.control(''),
            'to': this._fb.control(''),
        });

        this.period_form.valueChanges.subscribe(() => {
            this.filterInvoices();
        });
    }

    ngOnInit() {
        this.invoices_subs = this._invoicesService.invoices$.subscribe((invoices: Invoice[]) => {
            this.invoices = invoices;
            this.filterInvoices();
        });
        this._invoicesService.getAll();
    }

    filterByStatus(status: 'all' | 'new' | 'archived') {
        this.invoices_status = status;
        this.filterInvoices();
    }

    filterByPeriod() {
        const from = this.period_form.value['from'] || 0;
        const to = this.period_form.value['to'] || Infinity;
        this.filtered_invoices = this.filtered_invoices.filter(invoice => {
            const invoice_date = new Date(invoice.issue_date).getTime();
            return invoice_date >= from && invoice_date <= to;
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
                    (this.invoices_status === 'all' || x.status === this.invoices_status)
            );
        else
            this.filtered_invoices = this.invoices.filter(invoice => this.invoices_status === 'all' || invoice.status === this.invoices_status);

        this.selection.clear();
        this.filterByPeriod();
    }

    clearDatePeriod() {
        this.period_form.patchValue({
            'from': '',
            'to': ''
        });
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.filtered_invoices.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.filtered_invoices.forEach(row => this.selection.select(row));
    }

    get filtered_total() {
        let sum = 0;
        this.filtered_invoices.forEach((x: Invoice) => {
            sum += parseFloat(x.total);
        });
        return sum.toFixed(2);
    }

    get filtered_vat() {
        let sum = 0;
        this.filtered_invoices.forEach((x: Invoice) => {
            sum += parseFloat(x.total_vat);
        });
        return sum.toFixed(2);
    }

    get filtered_final() {
        let sum = 0;
        this.filtered_invoices.forEach((x: Invoice) => {
            sum += parseFloat(x.total_total);
        });
        return sum.toFixed(2);
    }

    get selected_invoices() {
        return this.selection.selected;
    }

    get selected_count() {
        return this.selection.selected.length;
    }

    onRemove(invoice: Invoice) {
        if (confirm('Сигурни ли сте, че искате да изтриете тази фактура?'))
            this._invoicesService.remove(invoice).subscribe((res: Invoice) => {
                this._snackBar.open(`Успешно изтрихте фактурата!`, '', {
                    duration: 2000
                });
            });
    }

    openSendDialog() {
        forkJoin(
            this._settingsService.getEmail().pipe(take(1)),
            this._settingsService.getReceiverEmail().pipe(take(1))
        ).subscribe(([user_mail, receiver_mail]) => {
            if (!user_mail || !user_mail.value.email || !receiver_mail || !receiver_mail.value.email) {
                const snackRef = this._snackBar.open(
                    `Не сте попълнили всички необходими настройки за е-мейлите!`,
                    'Настройки',
                    {}
                );
                snackRef.onAction().subscribe(() => {
                    this._router.navigate(['/home', 'settings']);
                });
            } else {
                const months = [
                    'януари',
                    'февруари',
                    'март',
                    'април',
                    'май',
                    'юни',
                    'юли',
                    'август',
                    'септември',
                    'октомври',
                    'ноември',
                    'декември'
                ];
                let current_month = new Date().getMonth() - 1;
                let current_year = new Date().getFullYear();
                if (current_month === -1) {
                    current_month = 12;
                    current_year -= 1;
                }
                this.send_form.patchValue({
                    'subject': `Фактури за м. ${months[current_month]} ${current_year}`,
                    'invoices': this.selection.selected
                });
                this.send_dialog_visible = true;
            }
        });

    }

    sendInvoices() {
        if (confirm(`Сигурни ли сте, че искате да изпратите ${this.selected_count} фактури на счетоводителя?`)) {

            const send_data = { ...this.send_form.value };
            send_data.invoices = send_data.invoices.map(x => x.raw());

            this._invoicesService.sendInvoices(send_data).subscribe(res => {
                if (res && res.error) {
                    const snackbarError = this._snackBar.open(`Грешка ${res.error.responseCode} - ${res.error.code}/${res.error.command}`, 'затвори', {});

                    snackbarError.onAction().subscribe(() => {
                        snackbarError.dismiss();
                    });

                } else {
                    this._snackBar.open(`Успешно изпратихте ${this.selected_count} фактури на Вашия счетоводител!`, '', {
                        duration: 2000
                    });
                    this.send_dialog_visible = false;
                    this.invoices.forEach(x => {
                        if (x.selected) {
                            x.status = 'archived';
                            x.selected = false;
                        }
                    });
                    this.selection.clear();
                    this.send_form.patchValue({});
                    this.send_form.markAsPristine();
                }

            });

        }
    }

}
