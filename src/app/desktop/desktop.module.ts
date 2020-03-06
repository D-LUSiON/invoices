import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesktopRoutingModule } from './desktop-routing.module';
import { DesktopComponent } from './desktop/desktop.component';
import { SharedModule } from '@shared';
import { TitlebarComponent } from '../titlebar/titlebar.component';


@NgModule({
    declarations: [
        DesktopComponent,
        TitlebarComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        DesktopRoutingModule
    ]
})
export class DesktopModule { }
