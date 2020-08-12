import { Component, OnDestroy } from '@angular/core';
import { InvoicesService } from '@invoices';
import { TreeData, TreeItem, Document, StateManagerService, TranslationsService, ElectronClientService } from '@shared';
import { Invoice } from '../classes/invoice';
import { Subscription } from 'rxjs';

@Component({
    selector: 'inv-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {

    private _treeDataActive: TreeData = new TreeData([]);
    filteredTreeDataActive: TreeData = new TreeData([]);

    private _treeDataSent: TreeData = new TreeData([]);
    filteredTreeDataSent: TreeData = new TreeData([]);

    private _treeDataArchived: TreeData = new TreeData([]);
    filteredTreeDataArchived: TreeData = new TreeData([]);

    private _treeDataAll: TreeData = new TreeData([]);
    filteredTreeDataAll: TreeData = new TreeData([]);

    expanded_idx: number = 0;

    subs: Subscription = new Subscription();

    constructor(
        private _electron: ElectronClientService,
        private _invoicesService: InvoicesService,
        private _stateManager: StateManagerService,
        private _translate: TranslationsService,
    ) {
        this.subs.add(
            this._invoicesService.treeActive$.subscribe(tree => {
                this._treeDataActive = tree;
                this.filteredTreeDataActive = this._treeDataActive.slice();
            })
        );
        this.subs.add(
            this._invoicesService.treeSent$.subscribe(tree => {
                this._treeDataSent = tree;
                this.filteredTreeDataSent = this._treeDataSent.slice();
            })
        );
        this.subs.add(
            this._invoicesService.treeArchived$.subscribe(tree => {
                this._treeDataArchived = tree;
                this.filteredTreeDataArchived = this._treeDataArchived.slice();
            })
        );
        this.subs.add(
            this._invoicesService.treeAll$.subscribe(tree => {
                this._treeDataAll = tree;
                this.filteredTreeDataAll = this._treeDataAll.slice();
            })
        );
    }

    groupExpanded(group_idx: number) {
        this.expanded_idx = group_idx;
    }

    newInvoice() {
        this._stateManager.addDocument(new Document({
            id: 0,
            title: this._translate.translate(`New invoice`, 'invoices'),
            module: 'Invoices',
            mode: 'edit',
            inputs: {
                invoice: new Invoice()
            }
        }));
    }

    async importInvoices() {
        const result = await this._electron.remote.dialog.showOpenDialog(this._electron.window, {
            title: this._translate.translate('Choose a backup file...', 'invoices'),
            filters: [
                { name: this._translate.translate('Invoices v2 database', 'invoices'), extensions: ['db'] },
                { name: this._translate.translate('JSON Files', 'invoices'), extensions: ['json'] },
            ],
            properties: ['openFile']
        });
        if (!result.canceled) {
            this._invoicesService.importOldDatabase(result).then(([title, message]) => {
                this._electron.remote.dialog.showMessageBox(this._electron.window, {
                    title,
                    message
                });
            }).catch(([title, content]) => {
                this._electron.remote.dialog.showErrorBox(title, content);
            });
        }
    }

    filterTree(substr: string) {
        // FIXME: Filter all statuses
        this.filteredTreeDataActive = this._invoicesService.filterInvoices(substr);
    }

    onTreeNodeClicked(node: TreeItem) {
        this._stateManager.addDocument(new Document({
            id: node.obj.id,
            title: node.title || node.heading,
            module: 'Invoices',
            inputs: {
                invoice: node.obj
            }
        }));
    }

    onTreeNodeDblClicked(node: TreeItem) {
        // console.log(`onTreeNodeDblClicked`, node);
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
