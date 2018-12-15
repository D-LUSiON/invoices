import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DialogComponent
    ],
    exports: [
        DialogComponent
    ]
})
export class DialogModule { }
