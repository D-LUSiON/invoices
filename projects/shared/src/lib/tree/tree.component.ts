import { Component, OnChanges, Input, SimpleChanges, ContentChild, TemplateRef, EventEmitter, Output } from '@angular/core';
import { TreeData } from './tree-data';
import { TreeItem } from './tree-item';

@Component({
    selector: 'lib-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnChanges {

    @Input() nodes: TreeData = [];

    @Input() selectedNode: TreeItem;
    @Output() selectedNodeChange: EventEmitter<TreeItem> = new EventEmitter();
    @Output() nodeClick: EventEmitter<TreeItem> = new EventEmitter();
    @Output() nodeDblClick: EventEmitter<TreeItem> = new EventEmitter();

    @ContentChild('root', { static: false }) root: TemplateRef<any>;
    @ContentChild('node_item', { static: false }) node_item: TemplateRef<any>;
    @ContentChild('branch', { static: false }) branch: TemplateRef<any>;
    @ContentChild('leaf', { static: false }) leaf: TemplateRef<any>;
    @ContentChild('empty', { static: false }) empty: TemplateRef<any>;
    @ContentChild('loading_node', { static: false }) loading_node: TemplateRef<any>;

    private _is_single_click: boolean = true;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
    }

    onNodeClick(node: TreeItem) {
        this._is_single_click = true;
        if (node.branch) {
            node.expanded = !node.expanded;
        } else {
            setTimeout(() => {
                if (this._is_single_click)
                    this.selectedNode = node;
                    this.selectedNodeChange.next(this.selectedNode);
                    this.nodeClick.emit(node);
            }, 300);
        }
    }

    onNodeDblClick(node: TreeItem) {
        if (!node.branch) {
            setTimeout(() => {
                this._is_single_click = false;
                this.nodeDblClick.emit(node);
            }, 200);
        }
    }

}
