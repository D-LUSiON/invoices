import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { SharedModule } from '@app/shared';

@NgModule({
    declarations: [
        InvoicesListComponent,
        InvoiceEditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InvoicesRoutingModule
    ],
    exports: [
        InvoiceEditComponent
    ]
})
export class InvoicesModule { }
