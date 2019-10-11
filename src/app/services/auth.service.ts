import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ElectronClientService } from './electron-client.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _user: any = { id: 1 };

    currentAccount$: BehaviorSubject<any> = new BehaviorSubject(this._user);

    constructor(
        private _electron: ElectronClientService,
        private _ngZone: NgZone,
    ) {
        this._electron.get('current-user').subscribe(result => {
            console.log(result);
        });
    }
}
