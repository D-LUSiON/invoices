import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '@app/shared';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
    declarations: [SettingsComponent],
    imports: [
        CommonModule,
        SharedModule,
        SettingsRoutingModule
    ]
})
export class SettingsModule { }
