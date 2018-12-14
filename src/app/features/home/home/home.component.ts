import { Component, OnInit, OnDestroy } from '@angular/core';
import { InvoicesService, ProvidersService, RecipientsService } from '@app/core';
import { Invoice, Provider, Recipient, InvoiceEditComponent } from '@app/shared';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    invoices: Invoice[] = [];
    providers: Provider[] = [];
    recepients: Recipient[] = [];

    invoices_subs: Subscription;
    providers_subs: Subscription;
    recepients_subs: Subscription;

    constructor(
        private _invoicesService: InvoicesService,
        private _providersService: ProvidersService,
        private _recepientsService: RecipientsService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.invoices_subs = this._invoicesService.invoices$.subscribe(invoices => {
            this.invoices = invoices;
        });
        this._invoicesService.getAll();

        this.providers_subs = this._providersService.providers$.subscribe(providers => {
            this.providers = providers;
        });
        this._providersService.getAll();

        this.recepients_subs = this._recepientsService.recipients$.subscribe(recepients => {
            this.recepients = recepients;
        });
        this._recepientsService.getAll();
    }

    get invoices_unsent() {
        return this.invoices.filter(x => x.status === 'new').length;
    }

    get invoices_sum() {
        let sum = 0;
        this.invoices.forEach(invoice => {
            if (invoice.status === 'new')
                sum += invoice.total_sum;
        });
        return sum.toFixed(2);
    }

    get invoices_vat() {
        let vat = 0;
        this.invoices.forEach(invoice => {
            if (invoice.status === 'new')
                vat += parseFloat(invoice.total_vat);
        });
        return vat.toFixed(2);
    }

    get invoices_total() {
        let total = 0;
        this.invoices.forEach(invoice => {
            if (invoice.status === 'new')
                total += parseFloat(invoice.total_total);
        });
        return total.toFixed(2);
    }

    openDialog(): void {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        const dialogRef = this.dialog.open(InvoiceEditComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }

    ngOnDestroy() {
        if (this.invoices_subs)
            this.invoices_subs.unsubscribe();
    }

}
