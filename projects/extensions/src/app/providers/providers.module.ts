import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProvidersListComponent } from './views/providers-list/providers-list.component';
import { ProviderPreviewComponent } from './views/provider-preview/provider-preview.component';
import { ProviderEditComponent } from './views/provider-edit/provider-edit.component';
import { SharedModule } from 'shared';

export * from './models';

@NgModule({
    declarations: [
        ProvidersListComponent,
        ProviderPreviewComponent,
        ProviderEditComponent
    ],
    imports: [
        CommonModule,
        SharedModule.forRoot()
    ],
    exports: [
        ProvidersListComponent,
        ProviderPreviewComponent,
        ProviderEditComponent
    ],
    entryComponents: [
        ProvidersListComponent,
        ProviderPreviewComponent,
        ProviderEditComponent
    ],
})
export class ProvidersModule {
    static title = 'Providers';
    static description = 'Providers module for listing, previewing and editing';
    static icon = 'address-book';

    static listComponent = ProvidersListComponent;
    static previewComponent = ProviderPreviewComponent;
    static editComponent = ProviderEditComponent;
}
