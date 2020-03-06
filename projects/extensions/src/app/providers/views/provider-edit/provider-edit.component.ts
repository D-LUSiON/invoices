import { Component, OnInit } from '@angular/core';
import { AppStateService } from '@app/services';

@Component({
    selector: 'app-provider-edit',
    templateUrl: './provider-edit.component.html',
    styleUrls: ['./provider-edit.component.scss']
})
export class ProviderEditComponent implements OnInit {

    constructor(
        private _appState: AppStateService,
    ) { }

    ngOnInit() {
    }

}
