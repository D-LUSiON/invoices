import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxElectronModule } from 'ngx-electron';

import { KeysPipe } from './pipes/keys.pipe';
import { LogPipe } from './pipes/log.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { CurrencyPipe } from './pipes/currency.pipe';

@NgModule({
    declarations: [
        KeysPipe,
        LogPipe,
        SortPipe,
        CurrencyPipe,
    ],
    imports: [
        HttpClientModule,
        NgxElectronModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    exports: [
        HttpClientModule,
        NgxElectronModule,
        ReactiveFormsModule,
        FormsModule,

        KeysPipe,
        LogPipe,
        SortPipe,
        CurrencyPipe,
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: []
        }
    }
}
