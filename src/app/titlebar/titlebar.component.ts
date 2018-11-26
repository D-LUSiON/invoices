import { Component, OnInit, EventEmitter, Output, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-titlebar',
    templateUrl: './titlebar.component.html',
    styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent {

    @Output() goBack: EventEmitter<any> = new EventEmitter();

    app_window;

    maximizable = true;
    minimizable = true;
    maximized = false;

    drives_aside;

    constructor(
        private electron: ElectronService,
        private ngZone: NgZone
    ) {
        if (this.electron.isElectronApp) {
            this.app_window = this.electron.remote.getCurrentWindow();

            this.maximizable = !(!this.app_window.isMaximizable() || !this.app_window.isResizable());

            this.minimizable = this.app_window.isMinimizable();

            this.maximized = this.app_window.isMaximized();

            this.app_window.on('maximize', () => {
                this.ngZone.run(() => {
                    this.maximized = true;
                });
            });
            this.app_window.on('unmaximize', () => {
                this.ngZone.run(() => {
                    this.maximized = false;
                });
            });
        }

    }

    onGoBack() {
        this.goBack.emit();
    }

    onMinimizeApp() {
        if (!this.electron.isElectronApp) {
            alert('You\'re not running Angular inside Electron!');
            return false;
        }
        this.app_window.minimize();
    }

    onMaximizeApp() {
        if (!this.electron.isElectronApp) {
            alert('You\'re not running Angular inside Electron!');
            return false;
        }
        if (this.maximized) {
            this.app_window.unmaximize();
            this.maximized = false;
        } else {
            this.app_window.maximize();
            this.maximized = true;
        }
    }

    onCloseApp() {
        if (!this.electron.isElectronApp) {
            alert('You\'re not running Angular inside Electron!');
            return false;
        }
        this.app_window.close();
    }

}
