import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ElectronClientService } from './electron-client.service';
import { Issuer } from '../models';

@Injectable({
    providedIn: 'root'
})
export class IssuersService {

    private _issuers: Issuer[] = [];

    issuers$: BehaviorSubject<any[]> = new BehaviorSubject(this._issuers);

    constructor(
        private _electron: ElectronClientService,
    ) { }
}
