import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreeData, TreeItem, Tools, ElectronClientService, StateManagerService, Document } from '@shared';
import { Provider } from './classes';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProvidersService {
    private _treeData = new TreeData([]);

    private _providers: Provider[] = [];

    providers$: BehaviorSubject<Provider[]> = new BehaviorSubject(this._providers);
    tree$: BehaviorSubject<TreeData> = new BehaviorSubject(this._treeData);

    constructor(
        private _electronClient: ElectronClientService,
        private _stateManager: StateManagerService,
    ) {
        this.getSaved();
    }

    get tree() {
        return this._treeData;
    }

    get providers() {
        return [...this._providers];
    }

    getSaved() {
        return new Promise((resolve, reject) => {
            this._electronClient.getAll('providers').subscribe(providers => {
                this._providers = providers.map(x => new Provider(x));
                this.sortProvidersByName();
                this.providers$.next(this._providers);
                this._createTree();
                resolve(this._providers);
            });
        });
    }

    sortProvidersByName() {
        this._providers = this._providers.sort((a, b) => {
            if (a.organization > b.organization) return 1;
            if (a.organization < b.organization) return -1;
            return 0;
        });
    }

    private _createTree() {
        const treeData = [];

        this._providers.forEach(provider => {
            treeData.push({
                id: provider.id,
                title: provider.organization,
                branch: false,
                obj: provider
            });
        });

        this._treeData = treeData;
        this.tree$.next(this._treeData);
    }

    saveProvider(provider: Provider) {
        return this._electronClient.save('provider', provider).pipe(tap((data) => {
            const idx = this._providers.findIndex(prov => prov.id === data[0]);
            if (!provider.id && idx === -1) {
                provider.id = data[0];
                this._providers.push(provider);
            } else {
                this._providers[idx] = provider;
            }
            this.sortProvidersByName();
            this.providers$.next(this._providers);
            this._createTree();
            this._stateManager.updateDocument(new Document({
                id: provider.id,
                title: provider.organization,
                module: 'Providers',
                inputs: {
                    provider: provider
                }
            }));
            return provider;
        }));
    }
}
