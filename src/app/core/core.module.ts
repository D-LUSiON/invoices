import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronClientService, InvoicesService, ProvidersService, RecipientsService, SettingsService } from './services';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        ElectronClientService,
        InvoicesService,
        ProvidersService,
        RecipientsService,
        SettingsService,
    ],
})
export class CoreModule {
    constructor(
        @Optional() @SkipSelf() parentModule: CoreModule
    ) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import only in AppModule');
        }
    }
}
