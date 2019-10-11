import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ElectronClientService } from './electron-client.service';
import { Receiver } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ReceiversService {

    private _receivers: Receiver[] = [];

    receivers$: BehaviorSubject<Receiver[]> = new BehaviorSubject(this._receivers);

    constructor(
        private _electron: ElectronClientService,
    ) { }
}
