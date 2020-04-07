import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from '@shared';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [SettingsComponent],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [SettingsComponent]
})
export class SettingsModule {
    readonly title = 'Settings';
    readonly icon = 'mdl2-Settings';
    readonly sidebar_position = 'bottom';

    get sidebar() {
        return null;
    }

    get preview() {
        return null;
    }

    get edit() {
        return SettingsComponent;
    }
}
