import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'inv-root',
    templateUrl: 'app.component.html',
    styles: []
})
export class AppComponent {

    constructor(
        private _translateService: TranslateService,
        private _titleService: Title,
    ) {
        this._translateService.setDefaultLang('en');
        this._translateService.use('bg');
        this._titleService.setTitle(this._translateService.instant('Invoices'));
    }
}
