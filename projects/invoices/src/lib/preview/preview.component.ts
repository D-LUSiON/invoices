import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Invoice } from '../classes/invoice';
import { SettingsService } from '@settings';
import { Subscription } from 'rxjs';

@Component({
    selector: 'inv-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {

    @Input() invoice: Invoice;

    currency_sign: string = '';

    subs: Subscription = new Subscription();

    constructor(
        private _settingsService: SettingsService,
    ) {
        this.subs.add(
            this._settingsService.settings$.subscribe((settings) => {
                this.currency_sign = settings?.general?.currency_sign || '';
            })
        );
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
