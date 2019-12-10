import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from 'shared';
import { InvoicesService } from '../../services/invoices.service';
import { Invoice } from '../../models/invoice';

export interface InvoicesList {
    [year: number]: {
        [month: number]: Invoice[]
    }
}

@Component({
    selector: 'app-invoices-list',
    templateUrl: './invoices-list.component.html',
    styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit {

    invoices: Invoice[] = [];

    invoicesSorted: InvoicesList = {};

    sort_by: 'issue_date' | 'sent_date' = 'issue_date';

    expanded_year_idx: number = -1;

    month_names = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    constructor(
        private _sharedService: SharedServiceService,
        private _invoicesService: InvoicesService,
    ) {
        this._invoicesService.invoices$.subscribe(invoices => {
            this.invoices = invoices;
            this.sortInvoicesView();
        });
    }

    ngOnInit() {
        this._invoicesService.getAll();
    }

    changeSorting(sorting: 'issue_date' | 'sent_date') {
        this.sort_by = sorting;
        this.sortInvoicesView();
    }

    getMonthName(month: number) {
        return this.month_names[month];
    }

    sortInvoicesView() {
        const invoicesUnSorted: InvoicesList = {};
        this.invoices.forEach(invoice => {
            const date = invoice[this.sort_by] as Date;
            const year = date ? date.getFullYear() : 'not sent';
            const month = date ? date.getMonth() : 'to be sent';
            // TODO: Sort unsent invoices
            if (!invoicesUnSorted[year])
                invoicesUnSorted[year] = {};
            if (!invoicesUnSorted[year][month])
                invoicesUnSorted[year][month] = [];
            invoicesUnSorted[year][month] = [...invoicesUnSorted[year][month], invoice];
        });

        const invoicesSorted: InvoicesList = {};

        Object.keys(invoicesUnSorted).sort((year, next) => {
            if (+year < +next) return 1;
            if (+year > +next) return -1;
            return 0;
        }).forEach(year => {
            invoicesSorted[year] = {};
            Object.keys(invoicesUnSorted[year]).sort((month, next) => {
                if (+month < +next) return 1;
                if (+month > +next) return -1;
                return 0;
            }).forEach(month => {
                invoicesSorted[year][month] = [...invoicesUnSorted[year][month]];
            });
        });
        this.invoicesSorted = invoicesSorted;
    }

    expandYear(idx: number) {
        this.expanded_year_idx = idx;
    }

}
