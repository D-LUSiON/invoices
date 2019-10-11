import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, bg_BG } from 'ng-zorro-antd';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { registerLocaleData } from '@angular/common';
import bg from '@angular/common/locales/bg';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AnonymousGuard, AuthGuard } from './guards';
import { ElectronService } from 'ngx-electron';
import { SharedModule } from './shared/shared.module';

registerLocaleData(bg);

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgZorroAntdModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        BrowserAnimationsModule,
        SharedModule,
    ],
    providers: [
        AnonymousGuard,
        AuthGuard,
        ElectronService,
        {
            provide: NZ_I18N,
            useValue: bg_BG,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
