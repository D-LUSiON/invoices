import { Component, OnInit } from '@angular/core';
import { InvoicesService } from '../invoices.service';
import { TreeData, TreeItem, Document, StateManagerService, TranslationsService, ElectronClientService } from '@shared';
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
        private _electron: ElectronClientService,
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
            if (result.filePaths[0].endsWith('.json') || result.filePaths[0].endsWith('.db')) {
                this._electron.get('file', result.filePaths).subscribe((files: string[]) => {
                    let imported_invoices = [];
                    if (result.filePaths[0].endsWith('.json')) {
                        try {
                            imported_invoices = files.map(file => JSON.parse(file))[0];
                        } catch (error) {
                            console.log(`Error parsing file contents!`);
                        }
                    } else if (result.filePaths[0].endsWith('.db')) {
                        imported_invoices = files.map(file => {
                            const file_rows = file.split('\n');
                            const json = file_rows.filter(row => !!row).map(row => {
                                try {
                                    return JSON.parse(row);
                                } catch (error) {
                                    return row;
                                }
                            });
                            return json;
                        })[0];
                    }

                    if (imported_invoices.length) {
                        this._electron.remote.dialog.showMessageBox(this._electron.window, {
                            type: 'question',
                            buttons: [
                                this._translate.translate('Merge', 'invoices'),
                                this._translate.translate('Overwrite', 'invoices'),
                            ],
                            title: this._translate.translate('Merge or Overwrite?', 'invoices'),
                            message: this._translate.translate('What do you want to do with the imported results?', 'invoices')
                        }).then(result => {
                            const mode = result.response ? 'overwrite' : 'merge';
                            this._invoicesService.importInvoices(imported_invoices, mode).subscribe(results => {
                                console.log(`FINALLY!`);
                            });
                        });
                    }
                });
            } else {
                this._electron.remote.dialog.showErrorBox(
                    this._translate.translate('Error occured when importing!'),
                    this._translate.translate(`File you've choosen could not be parsed!\nValid extensions are only .db and .json!`)
                );
            }
        }
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
