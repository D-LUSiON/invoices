import { Component, Input, OnDestroy } from '@angular/core';
import { Invoice } from '../classes/invoice';
import { SettingsService } from '@settings';
import { Subscription } from 'rxjs';
import { InvoicesService } from '@invoices';
// import { InvoicesService } from '@invoices';
import { StateManagerService, TranslationsService, ElectronClientService } from '@shared';

@Component({
    selector: 'inv-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnDestroy {

    @Input() invoice: Invoice;

    currency_sign: string = '';

    sender: { [key: string]: any } = {};

    subs: Subscription = new Subscription();

    constructor(
        private _settingsService: SettingsService,
        private _invoicesService: InvoicesService,
        private _stateManager: StateManagerService,
        private _translate: TranslationsService,
        private _electron: ElectronClientService,
    ) {
        this.subs.add(
            this._settingsService.settings$.subscribe((settings) => {
                this.currency_sign = settings?.general?.currency_sign || '';
                this.sender = settings?.sender || {};
            })
        );
        setTimeout(() => {
            console.log(this.invoice);
        }, 500);

    }

    async removeInvoice() {
        const result = await this._electron.remote.dialog.showMessageBox(this._electron.window, {
            type: 'warning',
            buttons: [
                this._translate.translate('Delete', 'invoices'),
                this._translate.translate('Cancel', 'invoices'),
            ],
            title: this._translate.translate(`Are you sure you want to delete this invoice?`, 'invoices'),
            message: this._translate.translate('This is permanent and cannot be undone!', 'invoices')
        });

        if (!result.response)
            this._invoicesService.removeInvoice(this.invoice).subscribe((data) => {
                this._stateManager.notification$.next({
                    type: 'success',
                    message: this._translate.translate('Invoice deleted successfuly!', 'invoices')
                });
                this._stateManager.closeCurrentTab();
            }, err => {
                console.error(`Error deleting invoice!`, this.invoice, err);
                this._stateManager.notification$.next({
                    type: 'error',
                    message: this._translate.translate('Error deleting invoice!', 'invoices')
                });
            });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
