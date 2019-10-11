import { Component, OnInit } from '@angular/core';
import { ElectronClientService } from 'src/app/services';

import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'inv-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    mainMenu: Electron.Menu;

    activedNode: NzTreeNode;
    nodes = [
        // {
        //     title: 'June 2019',
        //     key: '2019-06',
        //     author: '',
        //     expanded: true,
        //     children: [
        //         { title: 'leaf 0-0', key: '1000', author: '', isLeaf: true },
        //         { title: 'leaf 0-1', key: '1001', author: '', isLeaf: true }
        //     ]
        // },
        // {
        //     title: 'May 2019',
        //     key: '2019-05',
        //     author: '',
        //     expanded: false,
        //     children: [
        //         { title: 'leaf 0-0', key: '1000', author: '', isLeaf: true },
        //         { title: 'leaf 0-1', key: '1001', author: '', isLeaf: true }
        //     ]
        // },
        // {
        //     title: 'April 2019',
        //     key: '2019-04',
        //     author: '',
        //     expanded: false,
        //     children: [
        //         { title: 'leaf 0-0', key: '1000', author: '', isLeaf: true },
        //         { title: 'leaf 0-1', key: '1001', author: '', isLeaf: true }
        //     ]
        // },
        // {
        //     title: 'March 2019',
        //     key: '2019-03',
        //     author: '',
        //     expanded: false,
        //     children: [
        //         { title: 'leaf 0-0', key: '1000', author: '', isLeaf: true },
        //         { title: 'leaf 0-1', key: '1001', author: '', isLeaf: true }
        //     ]
        // },
        // {
        //     title: 'February 2019',
        //     key: '2019-02',
        //     author: '',
        //     expanded: false,
        //     children: [
        //         { title: 'leaf 0-0', key: '1000', author: '', isLeaf: true },
        //         { title: 'leaf 0-1', key: '1001', author: '', isLeaf: true }
        //     ]
        // },
        // {
        //     title: 'January 2019',
        //     key: '2019-01',
        //     author: '',
        //     children: [
        //         { title: 'leaf 1-0', key: '1010', author: '', isLeaf: true },
        //         { title: 'leaf 1-1', key: '1011', author: '', isLeaf: true }
        //     ]
        // }
    ];

    index = 0;

    tabs = [];

    constructor(
        private _titleService: Title,
        private _translateService: TranslateService,
        private _electronService: ElectronClientService,
        private _nzContextMenuService: NzContextMenuService,
    ) {
        const win = this._electronService.remote.getCurrentWindow();
        win.removeMenu();
        this._titleService.setTitle(this._translateService.instant('Invoices'));
    }

    ngOnInit() {
    }

    openFolder(data: NzTreeNode | Required<NzFormatEmitEvent>): void {
        // do something if u want
        if (data instanceof NzTreeNode) {
            data.isExpanded = !data.isExpanded;
        } else {
            const node = data.node;
            if (node) {
                node.isExpanded = !node.isExpanded;
            }
        }
    }

    activeNode(data: NzFormatEmitEvent): void {
        this.activedNode = data.node!;
    }

    contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
        this._nzContextMenuService.create($event, menu);
    }

    selectDropdown(): void {
        // do something
    }

    closeTab(tab: string): void {
        this.tabs.splice(this.tabs.indexOf(tab), 1);
    }

    newTab(): void {
        this.tabs.push('New Tab');
        this.index = this.tabs.length - 1;
    }

}
