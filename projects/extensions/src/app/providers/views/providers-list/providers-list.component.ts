import { Component, OnInit } from '@angular/core';
import { AppStateService } from '@app/services';

@Component({
    selector: 'app-providers-list',
    templateUrl: './providers-list.component.html',
    styleUrls: ['./providers-list.component.scss']
})
export class ProvidersListComponent implements OnInit {

    constructor(
        private _appState: AppStateService,
    ) { }

    ngOnInit() {
        this._appState.hello('Hello from providers-list.component!');
        this._appState.state$.subscribe(time => console.log(`providers-list.component: ${time}`));
    }

}
