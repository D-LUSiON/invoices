import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MatDrawer } from '@angular/material';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    back_url: string = '';
    current_url: string = '';

    root_url: string = '/home';

    @ViewChild('sidebar') sidebar: MatDrawer;

    constructor(
        private electron: ElectronService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _location: Location
    ) { }

    ngOnInit() {
        this._router.events.subscribe(change => {
            if (change instanceof NavigationEnd) {
                this.current_url = change.urlAfterRedirects;
                const back_url = this.current_url.split('/');
                back_url.pop();
                this.back_url = back_url.join('/');
            }
        });
    }

    get show_back() {
        return this.current_url && this.current_url !== this.root_url;
    }

    closeMenu() {
        this.sidebar.close();
    }

    onToggleMenu() {
        this.sidebar.toggle();
    }

    onGoBack() {
        this._router.navigateByUrl(this.back_url);
    }

}
