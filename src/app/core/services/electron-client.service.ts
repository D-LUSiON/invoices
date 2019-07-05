import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable, Observer, BehaviorSubject } from 'rxjs';


@Injectable()
export class ElectronClientService {

    private _backend: Electron.IpcRenderer;

    private _db_connected: boolean = false;

    db_connected: BehaviorSubject<boolean> = new BehaviorSubject(this._db_connected);

    constructor(
        private _electron: ElectronService,
        private _ngZone: NgZone,
    ) {
        this._backend = this._electron.ipcRenderer;

        this._backend.on('db_conn', (e, connected) => {
            this._ngZone.run(() => {
                this._db_connected = connected;
                this.db_connected.next(connected);
            });
        });

        this._backend.on('log', (event, data) => {
            console.log(event, data);
        });

    }

    getAll(event: string, filter?: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this._backend.once(`${event}:all:response`, (e, response) => {
                this._ngZone.run(() => {
                    observer.next(response);
                    observer.complete();
                });
            });
            this._backend.send(`${event}:all`, filter);
        });
    }

    get(event: string, data?: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this._backend.once(`${event}:get:response`, (e, response) => {
                this._ngZone.run(() => {
                    observer.next(response ? response[0] : null);
                    observer.complete();
                });
            });
            this._backend.send(`${event}:get`, data);
        });
    }

    save(event: string, data: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this._backend.once(`${event}:save:response`, (e, response) => {
                this._ngZone.run(() => {
                    observer.next(response);
                    observer.complete();
                });
            });
            this._backend.send(`${event}:save`, data);
        });
    }

    remove(event: string, data: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this._backend.once(`${event}:remove:response`, (e, response) => {
                this._ngZone.run(() => {
                    observer.next(response ? response[0] : null);
                    observer.complete();
                });
            });
            this._backend.send(`${event}:remove`, data);
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
            this._backend.once(`${event}:response`, (e, response) => {
                this._ngZone.run(() => {
                    observer.next(response ? response : null);
                    observer.complete();
                });
            });
            this._backend.send(event, data);
        });
    }

}
