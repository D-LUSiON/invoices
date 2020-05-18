import { Injectable } from '@angular/core';
import { ElectronClientService, TreeData, Tools } from '@shared';
import { Sending } from './classes';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SendingService {

    private _treeData = new TreeData([]);
    private _sendings: Sending[] = [];

    sendings$: BehaviorSubject<Sending[]> = new BehaviorSubject(this.sendings);
    tree$: BehaviorSubject<TreeData> = new BehaviorSubject(this._treeData);

    constructor(
        private _electronClient: ElectronClientService,
    ) {
        console.log(`Hello from sending service!`);
        this.getSaved();
    }

    get sendings() {
        return [...this._sendings];
    }

    sortByDate() {
        this._sendings = this._sendings.sort((a, b) => {
            if (a.sending_date.getDate() > b.sending_date.getDate()) return 1;
            if (a.sending_date.getDate() < b.sending_date.getDate()) return -1;
            return 0;
        }).reverse();
    }

    getSaved() {
        return new Promise((resolve, reject) => {
            this._electronClient.getAll('sending').subscribe(sendings => {
                this._sendings = sendings.map(x => new Sending(x));
                this.sortByDate();
                this.sendings$.next(this._sendings);
                this._createTree();
                resolve(this._sendings);
            });
        });
    }

    private _createTree() {
        const treeData = [];

        this._sendings.forEach(sending => {
            treeData.push({
                id: sending.id,
                title: Tools.formatDate(sending.sending_date, 'YYYY-MM-dd'),
                branch: false,
                obj: sending
            });
        });

        this._treeData = treeData;
        this.tree$.next(this._treeData);
    }
}
