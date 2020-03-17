import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ElectronClientService } from './electron-client.service';
import { ModulesProviderService } from './modules-provider.service';
import { Module, Document } from '../classes';
// import { Document } from '../shared/classes/document';
// import { Module } from '../shared/classes';

@Injectable({
    providedIn: 'root'
})
export class StateManagerService {

    sidebar: {
        [key: string]: {
            title: string,
            active: boolean,
            component: object,
            inputs: { [key: string]: any }
        }
    } = {};

    private _sidebar: Module[] = [];

    private _openedDocuments: Document[] = [];
    private _loadedModules: Module[] = [];

    loadedModules$: BehaviorSubject<Module[]> = new BehaviorSubject(this._loadedModules);
    sidebar$: BehaviorSubject<Module[]> = new BehaviorSubject(this._loadedModules);
    openedDocuments$: BehaviorSubject<Document[]> = new BehaviorSubject(this._openedDocuments);

    constructor(
        private _electronClient: ElectronClientService,
        private _modulesProvider: ModulesProviderService,
    ) {
        this.sidebar$.subscribe(sidebar => {
            this._sidebar = sidebar;
        });
        this.loadedModules$.subscribe(loadedModules => {
            this._loadedModules = loadedModules;
        });
        this.openedDocuments$.subscribe(openedDocuments => {
            console.log(`openedDocuments`, openedDocuments);
        });
    }

    getLastState() {
        return new Promise((resolve, reject) => {
            // TODO: Load last saved state from backend
            resolve();
        });
    }

    saveState() {
        return new Promise((resolve, reject) => {
            // TODO: Save state in a file
            resolve();
        });
    }

    addDocument(doc: Document) {
        const module = this._loadedModules.find(mod => mod.module_name === `${doc.module}Module`);

        if (module) {
            doc.active = true;
            this._openedDocuments.filter(d => d.title !== doc.title).forEach(d => {
                d.active = false;
            });

            const idx = this._openedDocuments.findIndex(opened => opened.module === doc.module && opened.id === doc.id);
            console.log(idx, doc, this._openedDocuments.find(opened => opened.module === doc.module && opened.id === doc.id), this._openedDocuments);

            if (idx === -1) {
                doc.mode = (!doc.mode) ? 'preview' : doc.mode;

                const didx = this._openedDocuments.findIndex(d => d.mode === 'preview');
                if (didx === -1) {
                    this._openedDocuments.push(doc);
                } else {
                    this._openedDocuments[didx] = doc;
                }
            } else {
                if (this._openedDocuments[idx].active) {
                    doc.mode = 'edit';
                    doc.component = module[`component_${doc.mode}`];
                    this._openedDocuments[idx] = doc;
                } else {
                    this._openedDocuments[idx].active = true;
                }
            }
            if (!doc.component)
                doc.component = module[`component_${doc.mode}`];

            this.openedDocuments$.next(this._openedDocuments);
        }
    }

    updateDocument(doc: Document) {
        console.log(`updateDocument`, doc);
        const idx = this._openedDocuments.findIndex(d => d.id === doc.id && d.module === doc.module);
        if (idx > -1) {
            this._openedDocuments[idx].inputs = doc.inputs;
            this.openedDocuments$.next(this._openedDocuments);
        }
    }

    removeDocument(idx: number) {
        this._openedDocuments.splice(idx, 1);
        this.openedDocuments$.next(this._openedDocuments);
    }

    activateTab(idx: number) {
        console.log(`activateTab`, idx);

        this._openedDocuments.forEach((doc, i) => doc.active = i === idx);
        this.openedDocuments$.next(this._openedDocuments);
    }

    closeTab(idx: number) {
        console.log(`closeTab idx: ${idx}`);

        const active_idx = this._openedDocuments.findIndex(doc => doc.active);
        if (idx === active_idx) {
            if (idx === 0) {
                if (this._openedDocuments.length > 1)
                    this._openedDocuments[1].active = true;
            } else if (idx === this._openedDocuments.length - 1) {
                this._openedDocuments[this._openedDocuments.length - 2].active = true;
            } else {
                this._openedDocuments[idx - 1].active = true;
            }
        }
        this._openedDocuments.splice(idx, 1);
        this.openedDocuments$.next(this._openedDocuments);
    }
}
