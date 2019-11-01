import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { SharedModule as SharedPluginsModule} from 'shared';
import { InvoicesListComponent } from './views/invoices-list/invoices-list.component';
import { InvoicesPreviewComponent } from './views/invoices-preview/invoices-preview.component';
import { InvoicesEditComponent } from './views/invoices-edit/invoices-edit.component';

@NgModule({
    declarations: [
        InvoicesListComponent,
        InvoicesPreviewComponent,
        InvoicesEditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        SharedPluginsModule
    ],
    entryComponents: [
        InvoicesListComponent,
        InvoicesPreviewComponent,
        InvoicesEditComponent
    ],
})
export class InvoicesModule {
    static title = 'Invoices';
    static description = 'Invoices module for listing, previewing and editing';
    static icon = 'account-book';

    static listComponent = InvoicesListComponent;
    static previewComponent = InvoicesPreviewComponent;
    static editComponent = InvoicesEditComponent;
}
