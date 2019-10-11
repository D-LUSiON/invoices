import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'inv-root',
    templateUrl: 'app.component.html',
    styles: []
})
export class AppComponent {

    constructor(
        private _translate: TranslateService
    ) {
        // this language will be used as a fallback when a translation isn't found in the current language
        this._translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this._translate.use('bg');
    }
}
