import { Component, OnInit } from '@angular/core';
import { InvoicesService } from '../invoices.service';
import { TreeData, TreeItem, Document, StateManagerService, TranslationsService } from '@shared';
import { Invoice } from '../classes/invoice';

@Component({
    selector: 'inv-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    private _treeData: TreeData = new TreeData([]);
    filteredTreeData: TreeData = new TreeData([]);

    expanded_idx: number = 0;

    constructor(
        private _invoicesService: InvoicesService,
        private _stateManager: StateManagerService,
        private _translate: TranslationsService
    ) {
        this._invoicesService.tree$.subscribe(tree => {
            this._treeData = tree;
            this.filteredTreeData = this._treeData.slice();
        });
    }

    ngOnInit(): void {
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

    filterTree(substr: string) {
        this.filteredTreeData = this._invoicesService.filterInvoices(substr);
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

}
