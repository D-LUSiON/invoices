import { Tools } from '../tools';

export class TreeItem {
    id?: any;
    heading: string;
    title: string;
    description?: string;
    obj?: any;
    branch: boolean = true;
    children?: TreeItem[];
    expanded?: boolean;

    constructor(data?) {
        if (data) {
            this.id = data?.id || Tools.makeid();
            this.heading = data?.heading;
            this.title = data?.title;
            this.description = data?.description || '';
            this.obj = data?.obj;
            if (data?.hasOwnProperty('branch')) this.branch = data['branch'];
            if (this.branch) {
                if (data?.hasOwnProperty('children'))
                    this.children = data['children'].map(child => new TreeItem(child));
                else
                    this.children = [];
                this.expanded = true;
            }
        }
    }
}
