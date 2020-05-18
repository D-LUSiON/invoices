import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Sending } from '../classes';
import { SettingsService } from '@settings';
import { Subscription } from 'rxjs';
import { Invoice } from '@invoices';
import { StateManagerService, Document } from '@shared';

@Component({
    selector: 'lib-sending-preview',
    templateUrl: 'preview.component.html',
    styleUrls: ['preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {

    @Input() sending: Sending;

    currency_sign: string = '';

    subs: Subscription = new Subscription();

    constructor(
        private _settingsService: SettingsService,
        private _stateManager: StateManagerService,
    ) {
        this.subs.add(
            this._settingsService.settings$.subscribe((settings) => {
                this.currency_sign = settings?.general?.currency_sign || '';
            })
        );
    }

    ngOnInit(): void {
        console.log(`Preview sending`, this.sending);
    }

    previewInvoice(invoice: Invoice) {
        this._stateManager.addDocument(new Document({
            title: invoice.title,
            module: 'Invoices',
            mode: 'preview',
            inputs: {
                invoice
            }
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
