import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronClientService } from '@shared';

@Component({
    selector: 'inv-titlebar',
    templateUrl: './titlebar.component.html',
    styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {

    maximized: boolean = false;

    constructor(
        private _electronClient: ElectronClientService,
        private _ngZone: NgZone,
    ) {
        this.maximized = this._electronClient.window.isMaximized();
        this._electronClient.maximized$.subscribe((maximized) => {
            this.maximized = maximized;
        });
    }

    ngOnInit(): void {
    }

    minimize() {
        this._electronClient.window.minimize();
    }

    maximize() {
        this._electronClient.window.maximize();
        this.maximized = true;
    }

    restore() {
        this._electronClient.window.restore();
        this.maximized = false;
    }

    quit() {
        this._electronClient.app.quit();
    }

}
