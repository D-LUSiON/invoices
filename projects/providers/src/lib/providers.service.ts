import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreeData, TreeItem, Tools, ElectronClientService } from '@shared';
import { Provider } from './classes';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProvidersService {
    private _treeData = new TreeData([]);

    private _providers: Provider[] = [
        // new Provider({
        //     _id: Tools.makeid(),
        //     organization: 'Silhouette Fashion ltd.',
        //     acc_person: 'Любомир Пейков',
        //     address: 'София, ул. 11-ти Август №29',
        //     vat: 'BG192168110',
        //     vat2: ''
        // }),
        // new Provider({
        //     _id: Tools.makeid(),
        //     organization: 'Уеб Фешън ООД',
        //     acc_person: 'Константин Дюлгеров',
        //     address: 'София, ул. Ст. Л. Костов №3',
        //     vat: 'BG101010120',
        //     vat2: ''
        // }),
    ];

    providers$: BehaviorSubject<Provider[]> = new BehaviorSubject(this._providers);
    tree$: BehaviorSubject<TreeData> = new BehaviorSubject(this._treeData);

    constructor(
        private _electronClient: ElectronClientService
    ) {
        console.log(`Hello from providers service!`);
        this.getSaved();
        this.providers$.subscribe(prov => {
            console.log(`Providers service, providers changed:`, prov.length);
        });
    }

    get tree() {
        return this._treeData;
    }

    getSaved() {
        console.log(`Getting saved providers...`);
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
        console.log(`Saving provider`, provider);

        return this._electronClient.save('provider', provider).pipe(tap((data) => {
            console.log(data);
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
            return provider;
        }));
    }
}
