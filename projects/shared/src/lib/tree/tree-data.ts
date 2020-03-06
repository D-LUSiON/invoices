import { TreeItem } from './tree-item';

export class TreeData extends Array<TreeItem> {
    constructor(items?: TreeItem[]) {
        super(...(items || []).map(x => new TreeItem(x)));
        Object.setPrototypeOf(this, Object.create(TreeData.prototype));
    }
}
