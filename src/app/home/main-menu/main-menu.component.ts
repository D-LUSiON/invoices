import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

export interface MenuItem {
    name: string;
    shortcut?: string;
    open?: boolean;
    action?: string;
    children?: MenuChildItem[];
}

export interface MenuChildItem {
    name?: string;
    icon?: string;
    shortcut?: string;
    role?: 'divider';
    action?: string;
}

@Component({
    selector: 'inv-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

    @Input('menu')
    menu: MenuItem[] = [];

    @Output()
    menuItemClicked: EventEmitter<any> = new EventEmitter();

    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (!this._eRef.nativeElement.contains(event.target)) {
            this.closeAll();
        }
    }

    constructor(
        private _eRef: ElementRef,
    ) { }

    ngOnInit() {
    }

    closeAll(not?: number) {
        this.menu.forEach((item, idx) => {
            if (idx !== not)
                item.open = false;
        });
    }

    menuClicked(idx: number) {
        this.closeAll(idx);
        if ((!this.menu[idx].children || !this.menu[idx].children.length) && this.menu[idx].action)
            this.menuItemClicked.next(this.menu[idx].action);
        else
            this.menu[idx].open = !this.menu[idx].open;
    }

    actionClicked(action: string) {
        this.menuItemClicked.next(action);
        this.closeAll();
    }

}
