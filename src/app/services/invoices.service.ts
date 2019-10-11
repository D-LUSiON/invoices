import { Injectable } from '@angular/core';
import { ElectronClientService } from './electron-client.service';
import { BehaviorSubject } from 'rxjs';
import { Invoice } from '../models';

@Injectable({
    providedIn: 'root'
})
export class InvoicesService {

    private _invoices: Invoice[] = [];

    invoices$: BehaviorSubject<any[]> = new BehaviorSubject(this._invoices);

    constructor(
        private _electron: ElectronClientService,
    ) { }
}
