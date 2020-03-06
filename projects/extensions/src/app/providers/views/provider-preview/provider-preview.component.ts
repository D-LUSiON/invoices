import { Component, OnInit } from '@angular/core';
import { AppStateService } from '@app/services';

@Component({
    selector: 'app-provider-preview',
    templateUrl: './provider-preview.component.html',
    styleUrls: ['./provider-preview.component.scss']
})
export class ProviderPreviewComponent implements OnInit {

    constructor(
        private _appState: AppStateService,
    ) { }

    ngOnInit() {
    }

}
