import { Component, OnInit, ComponentFactoryResolver, AfterViewInit, ViewChild, ViewContainerRef, EventEmitter } from '@angular/core';
import { ModulesProviderService, StateManagerService, Module, Document, TranslationsService } from '@shared';

@Component({
    selector: 'inv-desktop',
    templateUrl: './desktop.component.html',
    styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit, AfterViewInit {

    @ViewChild('sidebarContent', { read: ViewContainerRef }) private _sidebarContentContainerRef: ViewContainerRef;
    @ViewChild('mainContent', { read: ViewContainerRef }) private _mainContentContainerRef: ViewContainerRef;

    loadedModules: Module[] = [];

    active_module_idx: number = 0;

    openedDocuments: Document[] = [];

    loaded: boolean = true;

    notification: {
        type: 'info' | 'success' | 'warning' | 'error',
        message: string
    };

    constructor(
        private _translations: TranslationsService,
        private _modulesProvider: ModulesProviderService,
        private _stateManager: StateManagerService,
        private readonly _componentFactoryResolver: ComponentFactoryResolver,
    ) {
        this._translations.current_lang$.subscribe((lang) => {
            this.loaded = false;
            setTimeout(() => { this.loaded = true; });
            this.updateSidebar();
            this.renderContent(this.openedDocuments.find(d => d.active));
        });

        this.preloadModules();
        this._stateManager.sidebar$.subscribe(sidebar => {
            this.loadedModules = sidebar;
            this.updateSidebar();
        });
        this._stateManager.openedDocuments$.subscribe(opened_documents => {
            if (opened_documents instanceof Array) {
                this.openedDocuments = [...opened_documents];
                this.renderContent(this.openedDocuments.find(d => d.active));
            }
        });

        this._stateManager.notification$.subscribe(notification => {
            this.notification = notification;
        });
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {

    }

    preloadModules() {
        const loadedModules = [];

        Object.keys(this._modulesProvider.modules).forEach((module_name: string, idx: number) => {
            const module = new Module({
                module_name,
                title: this._modulesProvider.modules[module_name].title,
                icon: this._modulesProvider.modules[module_name].icon,
                sidebar_position: this._modulesProvider.modules[module_name].sidebar_position || 'top',
                active: idx === 0,
                component_sidebar: this._modulesProvider.modules[module_name].sidebar,
                component_preview: this._modulesProvider.modules[module_name].preview,
                component_edit: this._modulesProvider.modules[module_name].edit,
                inputs: {}
            });

            loadedModules.push(module);
        });

        this._stateManager.loadedModules$.next(loadedModules);
        this._stateManager.sidebar$.next(loadedModules);
    }

    updateSidebar() {
        setTimeout(() => {
            if (this.loadedModules.length) {
                const activeModule = this.loadedModules.find(x => x.active);
                const sidebar_component = this._componentFactoryResolver.resolveComponentFactory(activeModule.component_sidebar);
                this._sidebarContentContainerRef.clear();
                const component_instance = this._sidebarContentContainerRef.createComponent(sidebar_component);
                Object.keys(activeModule.inputs).forEach(key => {
                    if (!component_instance.instance[key]) {
                        component_instance.instance[key] = activeModule.inputs[key];
                    } else
                        console.warn(`Key "${key}" already exists in sidebar component for module "${activeModule.module_name}"!`);
                });
            }
        }, 10);
    }

    renderContent(activeDocument: Document) {
        if (this._mainContentContainerRef)
            this._mainContentContainerRef.clear();
        if (activeDocument) {
            const component = this._componentFactoryResolver.resolveComponentFactory(activeDocument.component);
            activeDocument.instance = this._mainContentContainerRef.createComponent(component);

            Object.keys(activeDocument.inputs).forEach(key => {
                activeDocument.instance.instance[key] = activeDocument.inputs[key];
            });
            Object.keys(activeDocument.instance.instance).forEach(key => {
                if (activeDocument.instance.instance[key] instanceof EventEmitter) {
                    (activeDocument.instance.instance[key] as EventEmitter<any>).asObservable().subscribe((value) => {
                        Object.keys(activeDocument.inputs).forEach(key_doc => {
                            activeDocument.inputs[key_doc] = activeDocument.instance.instance[key_doc];
                        });
                    });
                }
            });
        }
    }

    activateSidebarModule(idx: number) {
        if (!this.loadedModules[idx].component_sidebar) {
            if (this.loadedModules[idx].component_edit) {
                this._stateManager.addDocument(new Document({
                    title: this._translations.translate(this.loadedModules[idx].title, this.loadedModules[idx].title.toLowerCase()),
                    module: this.loadedModules[idx].title,
                    mode: 'edit',
                    inputs: {}
                }));
            } else if (this.loadedModules[idx].component_preview) {
                this._stateManager.addDocument(new Document({
                    title: this._translations.translate(this.loadedModules[idx].title, this.loadedModules[idx].title.toLowerCase()),
                    module: this.loadedModules[idx].title,
                    mode: 'preview',
                    inputs: {}
                }));
            } else {
                console.error(`Module "${this.loadedModules[idx].title}" has no EditComponent, nor PreviewComponent!\nPlease, create SidebarComponent/EditComponent/PreviewComponent!`, this.loadedModules[idx]);
            }
        } else {
            this.active_module_idx = 0;
            this.loadedModules.forEach(module => {
                module.active = false;
            });
            this.loadedModules[idx].active = true;
            this._stateManager.sidebar$.next(this.loadedModules);
        }
    }

    activateTab([tab, idx]) {
        if (tab && idx > -1) {
            this._stateManager.activateTab(idx);
        }
    }

    closeTab([tab, idx]) {
        if (tab && idx > -1) {
            this._stateManager.closeTab(idx);
        }
    }

    openSettings() {
        this._stateManager.addDocument(new Document({
            title: this._translations.translate('Settings', 'settings'),
            module: 'Settings',
            mode: 'edit',
            inputs: {}
        }));
    }

}
