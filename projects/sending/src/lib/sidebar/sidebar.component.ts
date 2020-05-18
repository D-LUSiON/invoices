import { Component, OnInit } from '@angular/core';
import { StateManagerService, Document, TranslationsService, TreeData, TreeItem } from '@shared';
import { SendingService } from '../sending.service';
import { InvoicesService, Invoice } from '@invoices';

@Component({
    selector: 'lib-sending-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    expanded_idx: number = 0;

    invoicesTreeData: TreeData = new TreeData([]);
    sendingTreeData: TreeData = new TreeData([]);

    constructor(
        private _stateManager: StateManagerService,
        private _translations: TranslationsService,
        private _sendingService: SendingService,
        private _invoicesService: InvoicesService,
    ) {
        this._invoicesService.treeActive$.subscribe(tree => {
            this.invoicesTreeData = tree;
            console.log(`invoicesTreeData`, this.invoicesTreeData);

        });

        this._sendingService.tree$.subscribe(tree => {
            this.sendingTreeData = tree;
            console.log(`sendingTreeData`, this.sendingTreeData);

        });
    }

    ngOnInit(): void {
    }

    groupExpanded(group_idx: number) {
        this.expanded_idx = group_idx;
    }

    newSending() {
        this._stateManager.addDocument(new Document({
            title: this._translations.translate('New sending', 'sending'),
            module: 'Sending',
            mode: 'edit',
            inputs: {}
        }));
    }

    previewInvoice(node: TreeItem) {
        this._stateManager.addDocument(new Document({
            title: node.title || node.heading,
            module: 'Invoices',
            mode: 'preview',
            inputs: {
                invoice: node.obj
            }
        }));
    }

    previewSending(node: TreeItem) {
        console.log(`previewSending`, node);

        this._stateManager.addDocument(new Document({
            title: this._translations.translate('Sending', 'sending'),
            module: 'Sending',
            mode: 'preview',
            inputs: {
                sending: node.obj
            }
        }));
    }

}
