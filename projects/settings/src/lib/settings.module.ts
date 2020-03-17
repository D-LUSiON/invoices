import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from '@shared';



@NgModule({
    declarations: [SettingsComponent],
    imports: [
        SharedModule
    ],
    exports: [SettingsComponent]
})
export class SettingsModule {
    readonly title = 'Settings';
    readonly icon = 'mdl2-Settings';

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
