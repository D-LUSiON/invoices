import { Component, OnInit } from '@angular/core';
import { TreeData, StateManagerService, Document, TreeItem } from '@shared';
import { Provider } from '../classes';
import { ProvidersService } from '../providers.service';

@Component({
    selector: 'inv-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    treeData: TreeData = new TreeData([]);

    expanded_idx: number = 0;

    constructor(
        private _providersService: ProvidersService,
        private _stateManager: StateManagerService,
    ) {
        this._providersService.tree$.subscribe(tree => {
            this.treeData = tree;
        });
    }

    ngOnInit(): void {
    }

    groupExpanded(group_idx: number) {
        this.expanded_idx = group_idx;
    }

    newProvider() {
        this._stateManager.addDocument(new Document({
            id: 0,
            title: `New provider`,
            module: 'Providers',
            mode: 'edit',
            inputs: {
                provider: new Provider()
            }
        }));
    }

    onTreeNodeClicked(node: TreeItem) {
        this._stateManager.addDocument(new Document({
            id: node.obj.id,
            title: node.title || node.heading,
            module: 'Providers',
            inputs: {
                provider: node.obj
            }
        }));
    }

    onTreeNodeDblClicked(node: TreeItem) {
        // console.log(`onTreeNodeDblClicked`, node);
    }

}
