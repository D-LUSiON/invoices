import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeysPipe } from './pipes/keys.pipe';
import { LogPipe } from './pipes/log.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { CurrencyPipe } from './pipes/currency.pipe';



@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        KeysPipe,
        LogPipe,
        SortPipe,
        CurrencyPipe,
    ],
    exports: [
        KeysPipe,
        LogPipe,
        SortPipe,
        CurrencyPipe,
    ]
})
export class SharedModule { }
