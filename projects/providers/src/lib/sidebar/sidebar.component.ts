import { Component, OnInit } from '@angular/core';
import { TreeData, StateManagerService, Document, TreeItem, TranslationsService } from '@shared';
import { Provider } from '../classes';
import { ProvidersService } from '@providers';

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
        private _providersService: ProvidersService,
        private _stateManager: StateManagerService,
        private _translateService: TranslationsService,
    ) {
        this._providersService.tree$.subscribe(tree => {
            this._treeData = tree;
            this.filteredTreeData = this._treeData.slice();
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
            title: this._translateService.translate(`New provider`, 'providers'),
            module: 'Providers',
            mode: 'edit',
            inputs: {
                provider: new Provider()
            }
        }));
    }

    filterTree(substr: string) {
        this.filteredTreeData = this._treeData.filter(x => substr === '' || x.title.toLowerCase().indexOf(substr) > -1);
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
