import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-titlebar',
    templateUrl: './titlebar.component.html',
    styleUrls: ['./titlebar.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TitlebarComponent implements OnInit {

    app_window;

    maximizable: boolean = true;
    minimizable: boolean = true;
    maximized: boolean = false;

    drives_aside;

    constructor(
        private electron: ElectronService
    ) {
        this.app_window = this.electron.remote.getCurrentWindow();

        this.maximizable = !(!this.app_window.isMaximizable() || !this.app_window.isResizable());

        this.minimizable = this.app_window.isMinimizable();

        this.maximized = this.app_window.isMaximized();

    }

    ngOnInit() { }

    onMinimizeApp() {
        this.app_window.minimize();
    }

    onMaximizeApp() {
        if (this.maximized) {
            this.app_window.unmaximize();
            this.maximized = false;
        } else {
            this.app_window.maximize();
            this.maximized = true;
        }
    }

    onCloseApp() {
        this.app_window.close();
    }

}
