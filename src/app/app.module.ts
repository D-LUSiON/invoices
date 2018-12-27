import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';

import { AppComponent } from './app.component';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule, MatListModule, MatIconModule } from '@angular/material';
import { CoreModule } from '@app/core';
import { InvoiceEditComponent, SharedModule } from './shared';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        SharedModule,
        NgxElectronModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        FlexLayoutModule,
    ],
    declarations: [
        AppComponent,
        TitlebarComponent,
    ],
    entryComponents: [InvoiceEditComponent],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
