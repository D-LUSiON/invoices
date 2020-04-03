import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable, Observer, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ElectronClientService {

    private _electron: Electron.IpcRenderer;

    remote: Electron.Remote;
    app: Electron.App;
    window: Electron.BrowserWindow;

    private _maximized: boolean = false;
    maximized$: BehaviorSubject<boolean> = new BehaviorSubject(this._maximized);

    constructor(
        private _electronService: ElectronService,
        private _ngZone: NgZone,
    ) {
        this._electron = this._electronService.ipcRenderer;
        this.remote = _electronService.remote;
        this.app = _electronService.remote.app;
        this.window = _electronService.remote.getCurrentWindow();

        this._maximized = this.window.isMaximized();
        this.maximized$.next(this._maximized);
        this._startWindowMaximizeListeners();
        console.log(this);
    }

    private _startWindowMaximizeListeners() {
        this.window.addListener('maximize', () => {
            this._ngZone.run(() => {
                this._maximized = true;
                this.maximized$.next(this._maximized);
            });
        });
        this.window.addListener('unmaximize', () => {
            this._ngZone.run(() => {
                this._maximized = false;
                this.maximized$.next(this._maximized);
            });
        });
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
                this._electron.removeAllListeners(`${event}:get:progress`);
                this._ngZone.run(() => {
                    observer.next(response);
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
                console.log(response);

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

    /**
     * Subscribe to event that is sent from main process
     * @param event {string} Event name to listen to
     */
    subscribeTo(event: string): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            this._electron.on(event, (e, response) => {
                this._ngZone.run(() => {
                    observer.next(response ? response : null);
                });
            });
        });
    }

    /**
     * Unsubscribe from event that is sent from main process
     * @param event {string} Event name to unsubscribe from
     */
    unsubscribeFrom(event) {
        this._electron.removeAllListeners(event);
    }
}
