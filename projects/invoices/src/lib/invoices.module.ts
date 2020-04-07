import { NgModule } from '@angular/core';
import { EditComponent } from './edit/edit.component';
import { PreviewComponent } from './preview/preview.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SharedModule } from '@shared';

@NgModule({
    declarations: [
        EditComponent,
        PreviewComponent,
        SidebarComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        EditComponent,
        PreviewComponent,
        SidebarComponent
    ]
})
export class InvoicesModule {
    readonly title = 'Invoices';
    readonly icon = 'mdl2-ReportDocument';

    get sidebar() {
        return SidebarComponent;
    }

    get preview() {
        return PreviewComponent;
    }

    get edit() {
        return EditComponent;
    }
}