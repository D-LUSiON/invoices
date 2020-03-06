import { Component, OnInit } from '@angular/core';
import { AppStateService } from '@app/services';

@Component({
    selector: 'app-invoice-edit',
    templateUrl: './invoice-edit.component.html',
    styleUrls: ['./invoice-edit.component.scss']
})
export class InvoiceEditComponent implements OnInit {

    constructor(
        private _appState: AppStateService,
    ) { }

    ngOnInit() {
    }

}
