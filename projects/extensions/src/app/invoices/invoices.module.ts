import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesListComponent } from './views/invoices-list/invoices-list.component';
import { InvoicePreviewComponent } from './views/invoice-preview/invoice-preview.component';
import { InvoiceEditComponent } from './views/invoice-edit/invoice-edit.component';
import { SharedModule } from 'shared';

export * from './models';

@NgModule({
    declarations: [
        InvoicesListComponent,
        InvoicePreviewComponent,
        InvoiceEditComponent
    ],
    imports: [
        CommonModule,
        SharedModule.forRoot()
    ],
    exports: [
        InvoicesListComponent,
        InvoicePreviewComponent,
        InvoiceEditComponent
    ],
    entryComponents: [
        InvoicesListComponent,
        InvoicePreviewComponent,
        InvoiceEditComponent
    ],
})
export class InvoicesModule {
    static title = 'Invoices';
    static description = 'Invoices module for listing, previewing and editing';
    static icon = 'file-invoice';

    static listComponent = InvoicesListComponent;
    static previewComponent = InvoicePreviewComponent;
    static editComponent = InvoiceEditComponent;
}
