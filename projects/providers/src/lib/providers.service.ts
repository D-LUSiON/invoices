import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreeData, TreeItem, Tools, ElectronClientService } from '@shared';
import { Provider } from './classes';

@Injectable({
    providedIn: 'root'
})
export class ProvidersService {
    private _treeData = new TreeData([]);

    private _providers: Provider[] = [
        new Provider({
            _id: Tools.makeid(),
            organization: 'Silhouette Fashion ltd.',
            acc_person: 'Любомир Пейков',
            address: 'София, ул. 11-ти Август №29',
            vat: 'BG192168110',
            vat2: ''
        }),
        new Provider({
            _id: Tools.makeid(),
            organization: 'Уеб Фешън ООД',
            acc_person: 'Константин Дюлгеров',
            address: 'София, ул. Ст. Л. Костов №3',
            vat: 'BG101010120',
            vat2: ''
        }),
    ];

    tree$: BehaviorSubject<TreeData> = new BehaviorSubject(this._treeData);

    constructor(
        private _electronClient: ElectronClientService
    ) {
        console.log(`Hello from providers service!`);
        this._createTree();
    }

    get tree() {
        return [];
    }

    private _createTree() {
        const treeData = [];

        this._providers.forEach(provider => {
            treeData.push({
                title: provider.organization,
                branch: false
            });
        });

        this._treeData = treeData;
        this.tree$.next(this._treeData);
    }
}
