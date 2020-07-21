import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Invoice } from '../classes/invoice';
import { SettingsService } from '@settings';
import { Subscription } from 'rxjs';
import { InvoicesService } from '../invoices.service';
import { StateManagerService, TranslationsService, ElectronClientService } from '@shared';

@Component({
    selector: 'inv-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {

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
    }

    ngOnInit(): void {
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
                this._stateManager.closeCurrentTab();
            });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
