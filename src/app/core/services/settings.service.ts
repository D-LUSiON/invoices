import { Injectable } from '@angular/core';
import { ElectronClientService } from './electron-client.service';
import { map } from 'rxjs/operators';

@Injectable()
export class SettingsService {

    constructor(
        private _electron: ElectronClientService,
    ) { }

    get(setting: string) {
        console.log('service:', setting);

        return this._electron.get('settings', setting).pipe(map(response => {
            console.log(`service response ${setting}`, response);
            return response;
        }));
    }

    getEmail() {
        return this._electron.get('settings:email').pipe(map(response => {
            return response;
        }));
    }

    getReceiverEmail() {
        return this._electron.get('settings:receiver').pipe(map(response => {
            return response;
        }));
    }

    getDatabase() {
        return this._electron.get('settings:database').pipe(map(response => {
            return response;
        }));
    }

    save(data) {
        return this._electron.save('settings', data).pipe(map(response => {
            return response;
        }));
    }

}
