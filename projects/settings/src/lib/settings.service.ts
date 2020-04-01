import { Injectable } from '@angular/core';
import { ElectronClientService, StateManagerService } from '@shared';
import { Settings } from './classes';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private _settings: { [key: string]: any } = {};

    private _languages: string[] = [];

    settings$: BehaviorSubject<{ [key: string]: any }> = new BehaviorSubject(this.settings);
    languages$: BehaviorSubject<string[]> = new BehaviorSubject(this.languages);

    constructor(
        private _electronClient: ElectronClientService,
        private _stateManager: StateManagerService,
    ) {
        console.log(`Hello from settings service!`);
        this.getSaved();
        this.getAvailableLangs();
    }

    getSaved() {
        return new Promise((resolve, reject) => {
            this._electronClient.getAll('settings').subscribe(settings => {
                this._settings = settings;
                this.settings$.next(this.settings);
                resolve(this.settings);
            });
        });
    }

    getAvailableLangs() {
        return new Promise((resolve, reject) => {
            this._electronClient.getAll('translations:langs').subscribe(langs => {
                this._languages = langs;
                this.languages$.next(this.languages);
                resolve(this.languages);
            });
        });
    }

    get settings() {
        return { ...this._settings };
    }

    get languages() {
        return [...this._languages];
    }

    saveSettings(settings) {
        return this._electronClient.save(`settings`, settings).pipe(tap((result) => {
            this._settings = result;
            this.settings$.next(this.settings);
            return result;
        }));
    }
}
