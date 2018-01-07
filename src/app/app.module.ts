import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';

import { AppComponent } from './app.component';
import { TitlebarComponent } from './titlebar/titlebar.component';


@NgModule({
    declarations: [
        AppComponent,
        TitlebarComponent,
    ],
    imports: [
        BrowserModule,
        NgxElectronModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
