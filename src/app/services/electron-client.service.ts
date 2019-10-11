import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable, Observer } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ElectronClientService {

    private _electron: Electron.IpcRenderer;

    remote: Electron.Remote;

    constructor(
        private _electronService: ElectronService,
        private _ngZone: NgZone,
    ) {
        this._electron = this._electronService.ipcRenderer;
        this.remote = _electronService.remote;
        console.log(this._electronService);
    }

    getAll(event: string, filter?: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this._electron.once(`${event}:all:response`, (e, response) => {
                this._ngZone.run(() => {
                    observer.next(response);
                    observer.complete();
                });
            });
            this._electron.send(`${event}:all`, filter);
        });
    }

    get(event: string, data?: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this._electron.once(`${event}:get:response`, (e, response) => {
                this._ngZone.run(() => {
                    observer.next(response ? response[0] : null);
                    observer.complete();
                });
            });
            this._electron.send(`${event}:get`, data);
        });
    }

    save(event: string, data: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this._electron.once(`${event}:save:response`, (e, response) => {
                this._ngZone.run(() => {
                    observer.next(response);
                    observer.complete();
                });
            });
            this._electron.send(`${event}:save`, data);
        });
    }

    remove(event: string, data: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this._electron.once(`${event}:remove:response`, (e, response) => {
                this._ngZone.run(() => {
                    observer.next(response ? response[0] : null);
                    observer.complete();
                });
            });
            this._electron.send(`${event}:remove`, data);
        });
    }

    /**
     * Sends plain event
     *
     * @param event {string}
     * @param data {any}
     */
    send(event: string, data: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this._electron.once(`${event}:response`, (e, response) => {
                this._ngZone.run(() => {
                    observer.next(response ? response : null);
                    observer.complete();
                });
            });
            this._electron.send(event, data);
        });
    }
}
