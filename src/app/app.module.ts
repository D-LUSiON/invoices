import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule, ModulesProviderService, StateManagerService } from '@shared';
import { ElectronService } from 'ngx-electron';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule
    ],
    providers: [
        ElectronService,
        {
            provide: APP_INITIALIZER,
            useFactory: (provider: ModulesProviderService) => () => provider.loadModules(),
            deps: [ModulesProviderService],
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (provider: StateManagerService) => () => provider.getLastState(),
            deps: [StateManagerService],
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
