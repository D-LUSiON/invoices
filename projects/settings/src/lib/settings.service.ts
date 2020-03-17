import { Injectable } from '@angular/core';
import { ElectronClientService, StateManagerService } from '@shared';
import { Settings } from './classes';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private _settings: Settings;

    settings$: BehaviorSubject<Settings> = new BehaviorSubject(this.settings);

    constructor(
        private _electronClient: ElectronClientService,
        private _stateManager: StateManagerService,
    ) {
        console.log(`Hello from settings service!`);
        this.getSaved();
    }

    getSaved() {
        return new Promise((resolve, reject) => {
            this._electronClient.getAll('settings').subscribe(settings => {
                console.log(`Settings retrieved:`, settings);
                this._settings = new Settings(settings);
                this.settings$.next(this.settings);
            });
        });
    }

    get settings() {
        return new Settings(this._settings);
    }
}
