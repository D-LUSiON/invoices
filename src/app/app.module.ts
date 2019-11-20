import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NgZorroAntdModule, NZ_I18N, bg_BG } from 'ng-zorro-antd';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { registerLocaleData } from '@angular/common';
import bg from '@angular/common/locales/bg';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AnonymousGuard, AuthGuard } from './guards';
import { ElectronService,  } from 'ngx-electron';
// import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';

import { SharedModule } from './shared/shared.module';
import { PluginLoaderService } from './services/plugin-loader/plugin-loader.service';
import { ClientPluginLoaderService } from './services/plugin-loader/client-plugin-loader.service';
import { PluginsConfigProvider } from './services/plugin-loader/plugins-config.provider';

registerLocaleData(bg);

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserTransferStateModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        // NgZorroAntdModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        // NzIconModule,
        SharedModule,
    ],
    providers: [
        {
            provide: PluginLoaderService,
            useClass: ClientPluginLoaderService
        },
        PluginsConfigProvider,
        {
            provide: APP_INITIALIZER,
            useFactory: (provider: PluginsConfigProvider) => () =>
                provider
                    .loadConfig()
                    .toPromise(),
                    // .then(config => (provider.config = config)),
            multi: true,
            deps: [PluginsConfigProvider]
        },
        AnonymousGuard,
        AuthGuard,
        ElectronService,
        // {
        //     provide: NZ_I18N,
        //     useValue: bg_BG,
        // },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
