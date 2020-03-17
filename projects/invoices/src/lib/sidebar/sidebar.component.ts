import { Component, OnInit } from '@angular/core';
import { InvoicesService } from '../invoices.service';
import { TreeData, TreeItem, Document, StateManagerService } from '@shared';
import { Invoice } from '../classes/invoice';

@Component({
    selector: 'inv-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    treeData: TreeData = new TreeData([]);

    expanded_idx: number = 0;

    constructor(
        private _invoicesService: InvoicesService,
        private _stateManager: StateManagerService,
    ) {
        this._invoicesService.tree$.subscribe(tree => {
            this.treeData = tree;
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
            title: `New invoice`,
            module: 'Invoices',
            mode: 'edit',
            inputs: {
                invoice: new Invoice()
            }
        }));
    }

    onTreeNodeClicked(node: TreeItem) {
        console.log(`onTreeNodeClicked`, node);

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
