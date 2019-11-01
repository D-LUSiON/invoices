import { Component, OnInit, Injector, ViewChild, ViewContainerRef, ComponentFactory } from '@angular/core';
import { ElectronClientService } from 'src/app/services';

import { TranslateService } from '@ngx-translate/core';
import { PluginLoaderService } from 'src/app/services/plugin-loader/plugin-loader.service';
import { PluginsConfigProvider } from 'src/app/services/plugin-loader/plugins-config.provider';
import { Plugin } from 'src/app/shared/classes/plugin';
import { Observable } from 'rxjs';
import { Tab } from '../../shared/classes/tab';

@Component({
    selector: 'inv-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    @ViewChild('sidebarRef', { read: ViewContainerRef, static: true }) sidebarRef: ViewContainerRef;
    @ViewChild('activeTabRef', { read: ViewContainerRef, static: true }) activeTabRef: ViewContainerRef;

    mainMenu: Electron.Menu;

    index = 0;

    tabs: Tab[] = [];
    active_tab_idx: number = -1;

    loaded_plugins: { [key: string]: Plugin } = {};
    active_sidebar_plugin: Plugin = null;
    active_sidebar_plugin_idx: number = null;

    constructor(
        private injector: Injector,
        private _translateService: TranslateService,
        private _electronService: ElectronClientService,
        private _pluginLoader: PluginLoaderService,
        private _pluginsConfig: PluginsConfigProvider
    ) {
        const win = this._electronService.remote.getCurrentWindow();
        win.removeMenu();
    }

    ngOnInit() {
        this._pluginLoader.plugins$.subscribe(plugins => {
            this.loaded_plugins = { ...plugins };
            if (Object.keys(this.loaded_plugins).length) {
                if (this.active_sidebar_plugin === null) {
                    this.active_sidebar_plugin_idx = 0;
                    this.active_sidebar_plugin = this.loaded_plugins[Object.keys(this.loaded_plugins)[this.active_sidebar_plugin_idx]];
                }
                this.renderSidebarComponent(this.active_sidebar_plugin);
            } else {
                this.sidebarRef.clear();
            }
        });
    }


    renderSidebarComponent(mod?: Plugin) {
        if (mod) {
            this.active_sidebar_plugin = mod;
            this.active_sidebar_plugin_idx = Object.keys(this.loaded_plugins).findIndex(key => key === this.active_sidebar_plugin.name);
        }
        // console.log(`renderSidebarComponent`, this.active_sidebar_plugin);
        if (this.active_sidebar_plugin.listComponent) {
            this.sidebarRef.clear();
            this.sidebarRef.createComponent(this.active_sidebar_plugin.listComponent);
        } else
            // console.log(`Add new tab for plugin "${this.active_sidebar_plugin.title}"`);
            this.addNewTab(mod);
    }

    addNewTab(mod: Plugin, data?: { [key: string]: any }): void {
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
        this.activeTabRef.clear();
        if (this.tabs[this.active_tab_idx].component) {
            const componentRef = this.activeTabRef.createComponent(this.tabs[this.active_tab_idx].component);
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
    //                     component: this.loaded_plugins['settings'].editComponent,
    //                 });
    //                 break;
    //             case 'Plugins':
    //                 new_tab = new Tab({
    //                     title: 'Plugins',
    //                     component: this.loaded_plugins['plugins'].editComponent
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
