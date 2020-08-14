import { Component, OnInit } from '@angular/core';
import { StateManagerService, Document, TranslationsService, TreeItem, TreeData } from '@shared';
import { Income } from '../classes';
import { Subscription } from 'rxjs';
// import { IncomesService } from '../incomes.service';
import { IncomesService } from '@incomes';

@Component({
    selector: 'inv-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    incomes: Income[] = [];

    expanded_idx: number = 0;

    private _treeDataAll: TreeData = new TreeData([]);
    filteredTreeDataAll: TreeData = new TreeData([]);

    subs: Subscription = new Subscription();

    constructor(
        private _stateManager: StateManagerService,
        private _incomesService: IncomesService,
        private _translate: TranslationsService,
    ) {
        this.subs.add(
            this._incomesService.treeAll$.subscribe(tree => {
                this._treeDataAll = tree;
                this.filteredTreeDataAll = this._treeDataAll.slice();
            })
        );
    }

    ngOnInit(): void {
    }

    groupExpanded(group_idx: number) {
        this.expanded_idx = group_idx;
    }

    newIncome() {
        this._stateManager.addDocument(new Document({
            id: 0,
            title: this._translate.translate(`New income`, 'incomes'),
            module: 'Incomes',
            mode: 'edit',
            inputs: {
                income: new Income()
            }
        }));
    }

    filterTree(substr: string) {

    }

    onTreeNodeClicked(node: TreeItem) {
        this._stateManager.addDocument(new Document({
            id: node.obj.id,
            title: node.title || node.heading,
            module: 'Incomes',
            inputs: {
                income: node.obj
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
