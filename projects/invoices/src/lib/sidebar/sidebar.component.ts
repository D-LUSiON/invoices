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
        // FIXME: Recursive filtering
        const filteredTreeData = this._treeData.filter(x => {
            if (x.branch) {
                console.log(`children`, x.children.filter(y => substr === '' || y.heading.toLowerCase().indexOf(substr) > -1));

                return x.children.filter(y => substr === '' || y.heading.toLowerCase().indexOf(substr) > -1).length;
            } else
                return substr === '' || x.title.toLowerCase().indexOf(substr) > -1;
        });
        console.log(filteredTreeData);

        this.filteredTreeData = filteredTreeData;
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
