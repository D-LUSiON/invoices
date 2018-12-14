import { Component, Input, EventEmitter, Output, NgZone, ContentChild, TemplateRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-titlebar',
    templateUrl: './titlebar.component.html',
    styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent {

    @ContentChild('titlebar_buttons') titlebar_buttons: TemplateRef<any>;
    @ContentChild('titlebar_title') titlebar_title: TemplateRef<any>;

    private _app_window;

    maximizable = true;
    minimizable = true;
    maximized = false;

    menu_visible = false;

    drives_aside;

    constructor(
        private electron: ElectronService,
        private ngZone: NgZone
    ) {
        if (this.electron.isElectronApp) {
            this._app_window = this.electron.remote.getCurrentWindow();

            this.maximizable = !(!this._app_window.isMaximizable() || !this._app_window.isResizable());

            this.minimizable = this._app_window.isMinimizable();

            this.maximized = this._app_window.isMaximized();

            this._app_window.on('maximize', () => {
                this.ngZone.run(() => {
                    this.maximized = true;
                });
            });
            this._app_window.on('unmaximize', () => {
                this.ngZone.run(() => {
                    this.maximized = false;
                });
            });
        }

    }

    onMinimizeApp() {
        if (!this.electron.isElectronApp) {
            alert('You\'re not running Angular inside Electron!');
            return false;
        }
        this._app_window.minimize();
    }

    onMaximizeApp() {
        if (!this.electron.isElectronApp) {
            alert('You\'re not running Angular inside Electron!');
            return false;
        }
        if (this.maximized) {
            this._app_window.unmaximize();
            this.maximized = false;
        } else {
            this._app_window.maximize();
            this.maximized = true;
        }
    }

    onCloseApp() {
        if (!this.electron.isElectronApp) {
            alert('You\'re not running Angular inside Electron!');
            return false;
        }
        this._app_window.close();
    }

}
