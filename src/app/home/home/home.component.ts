import { Component, OnInit, Injector, ViewChild, ViewContainerRef, ComponentFactory } from '@angular/core';
import { ElectronClientService } from 'src/app/services';

import { ExtensionLoaderService } from 'src/app/services/extension-loader/extension-loader.service';
import { ExtensionsConfigProvider } from 'src/app/services/extension-loader/extensions-config.provider';
import { Extension } from '@app/shared/classes/extension';
import { Observable } from 'rxjs';
import { Tab } from '../../shared/classes/tab';
import { MenuItem } from '../main-menu/main-menu.component';

@Component({
    selector: 'inv-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    @ViewChild('sidebarRef', { read: ViewContainerRef, static: true }) sidebarRef: ViewContainerRef;
    @ViewChild('tabsContentRef', { read: ViewContainerRef, static: true }) tabsContentRef: ViewContainerRef;

    electronMainMenu: Electron.Menu;
    private _electonWindow: Electron.BrowserWindow;

    window_maximized: boolean = false;

    index = 0;

    tabs: Tab[] = [];
    active_tab_idx: number = 0;

    loaded_extensions: { [key: string]: Extension } = {};
    active_sidebar_extension: Extension = null;
    active_sidebar_extension_idx: number = null;

    mainMenu: MenuItem[] = [
        {
            name: 'File',
            children: [
                {
                    name: 'New invioce',
                    icon: 'file-alt',
                    action: 'file:new-invoice'
                },
                {
                    name: 'Open...',
                    icon: 'file-alt',
                    action: 'file:open'
                },
                {
                    name: 'Save',
                    icon: 'save',
                    action: 'file:open'
                },
                {
                    role: 'divider'
                },
                {
                    name: 'Settings',
                    icon: 'cog',
                    action: 'file:settings'
                },
                {
                    role: 'divider'
                },
                {
                    name: 'Quit',
                    action: 'file:settings'
                },
            ]
        },
        {
            name: 'Edit',
            children: [
                {
                    name: 'Undo',
                    icon: 'undo',
                    action: 'edit:undo'
                },
                {
                    name: 'Redo',
                    icon: 'redo',
                    action: 'edit:redo'
                },
                {
                    role: 'divider'
                },
                {
                    name: 'Cut...',
                    icon: 'cut',
                    action: 'edit:cut'
                },
                {
                    name: 'Copy...',
                    icon: 'copy',
                    action: 'edit:copy'
                },
                {
                    name: 'Paste',
                    icon: 'paste',
                    action: 'edit:paste'
                },
            ]
        },
        {
            name: 'Action',
            action: 'action:action',
        },
        {
            name: 'Help',
            children: [
                {
                    name: 'About',
                    action: 'help:about'
                }
            ]
        },
    ];

    constructor(
        private _electronService: ElectronClientService,
        private _extensionLoader: ExtensionLoaderService,
        private _extensionsConfig: ExtensionsConfigProvider
    ) {
        this._electonWindow = this._electronService.remote.getCurrentWindow();
        this._electonWindow.removeMenu();

        this.window_maximized = this._electonWindow.isMaximized();
        this._electonWindow.on('maximize', () => {
            this.window_maximized = true;
        });

        this._electonWindow.on('restore', () => {
            this.window_maximized = false;
        });
    }

    ngOnInit() {
        this._extensionLoader.extensions$.subscribe(extensions => {
            this.loaded_extensions = { ...extensions };
            if (Object.keys(this.loaded_extensions).length) {
                if (this.active_sidebar_extension === null) {
                    this.active_sidebar_extension_idx = 0;
                    this.active_sidebar_extension = this.loaded_extensions[Object.keys(this.loaded_extensions)[this.active_sidebar_extension_idx]];
                }
                this.renderSidebarComponent();
            } else {
                this.sidebarRef.clear();
            }
        });
    }

    minimizeWindow() {
        this._electonWindow.minimize();
    }

    maximizeWindow() {
        this._electonWindow.maximize();
        this.window_maximized = true;
    }

    restoreWindow() {
        this._electonWindow.restore();
        this.window_maximized = false;
    }

    closeWindow() {
        this._electonWindow.close();
    }

    menuItemClicked(action: string) {
        console.log(action);
    }

    renderSidebarComponent(mod?: Extension) {
        if (mod) {
            this.active_sidebar_extension = mod;
            this.active_sidebar_extension_idx = Object.keys(this.loaded_extensions).findIndex(key => key === this.active_sidebar_extension.name);
        }
        // console.log(`renderSidebarComponent`, this.active_sidebar_extension);
        if (this.active_sidebar_extension.listComponent) {
            this.sidebarRef.clear();
            this.sidebarRef.createComponent(this.active_sidebar_extension.listComponent);
        } else
            // console.log(`Add new tab for extension "${this.active_sidebar_extension.title}"`);
            this.addNewTab(this.active_sidebar_extension);
    }

    addNewTab(mod: Extension, data?: { [key: string]: any }): void {
        console.log(mod);
        if (this.tabs.filter(tab => tab.title === mod.title).length) {
            this.active_tab_idx = this.tabs.findIndex(tab => tab.title === mod.title);
        } else {
            this.tabs.push(new Tab({
                title: mod.title,
                component: mod.previewComponent || mod.editComponent,
                component_data: data || {}
            }));
            this.active_tab_idx = this.tabs.length - 1;
        }
        this.renderCurrentContent();
    }

    activateTab(idx: number) {
        this.active_tab_idx = idx;
        this.renderCurrentContent();
    }

    renderCurrentContent() {
        if (this.tabs.length && this.tabs[this.active_tab_idx].component) {
            const componentRef = this.tabsContentRef.createComponent(this.tabs[this.active_tab_idx].component);
            this.tabs[this.active_tab_idx].componentRef = componentRef;
            componentRef.instance.
            console.log(componentRef);
        }
    }

    // addNewTab(tab_controller_title: string, tab_component?: ComponentFactory<any>, tab_data?: { [key: string]: any } | any): void {
    //     if (this.tabs.filter(tab => tab.title === tab_controller_title).length) {
    //         this.index = this.tabs.findIndex(tab => tab.title === tab_controller_title);

    //     } else {
    //         let new_tab;
    //         switch (tab_controller_title) {
    //             case 'Settings':
    //                 new_tab = new Tab({
    //                     title: 'Settings',
    //                     component: this.loaded_extensions['settings'].editComponent,
    //                 });
    //                 break;
    //             case 'Extensions':
    //                 new_tab = new Tab({
    //                     title: 'Extensions',
    //                     component: this.loaded_extensions['extensions'].editComponent
    //                 });
    //                 break;

    //             default:
    //                 new_tab = new Tab({
    //                     title: tab_controller_title,
    //                     component: tab_component,
    //                     component_data: tab_data
    //                 });

    //                 break;
    //         }
    //         this.tabs.push(new_tab);
    //         this.index = this.tabs.length - 1;
    //         const tab_ref = this.activeTabRef.createComponent(new_tab.component);
    //         Object.keys(new_tab.component_data).forEach(key => {
    //             tab_ref.instance[key] = new_tab.component_data[key];
    //         });
    //     }

    // }

    closeTab(idx: number): void {
        this.tabs.splice(idx, 1);
        if (idx === this.active_tab_idx) {
            if (this.active_tab_idx === this.tabs.length)
                this.active_tab_idx--;
            else
                this.active_tab_idx++;
        }
        this.renderCurrentContent();
    }

}
