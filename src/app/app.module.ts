import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ElectronService } from 'ngx-electron';
import { SharedModule } from 'shared';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExtensionLoaderService } from './services/extension-loader/extension-loader.service';
import { ClientExtensionLoaderService } from './services/extension-loader/client-extesion-loader.service';
import { ExtensionsConfigProvider } from './services/extension-loader/extensions-config.provider';
import { AnonymousGuard, AuthGuard } from './guards';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule.forRoot(),
        AppRoutingModule,
    ],
    providers: [
        {
            provide: ExtensionLoaderService,
            useClass: ClientExtensionLoaderService
        },
        ExtensionsConfigProvider,
        {
            provide: APP_INITIALIZER,
            useFactory: (provider: ExtensionsConfigProvider) => () =>
                provider
                    .loadConfig()
                    .toPromise(),
                    // .then(config => (provider.config = config)),
            multi: true,
            deps: [ExtensionsConfigProvider]
        },
        ElectronService,
        AnonymousGuard,
        AuthGuard,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
