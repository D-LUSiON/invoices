import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';

@Component({
    selector: 'lib-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    constructor(
        private _settingsService: SettingsService
    ) {
        this._settingsService.settings$.subscribe(settings => {});
    }

    ngOnInit(): void {
    }

}
