import { Document } from './document';

export class OpenedDocuments {

    items: Document[] = [];

    constructor(items?: Document[]) {
        if (items) this.items = items;
        console.log(this);
    }

    // get tabsData() {
    //     const tabs = [];
    //     this.items.forEach(x => {
    //         tabs.push(x.tab);
    //     });
    //     return tabs;
    //     // return this.items.map(doc => doc.tab);
    // }

    // activateTab(id: string) {
    //     this.items.forEach(doc => {
    //         doc.tab.active = false;
    //     });
    //     console.log(`Activate tab: ${id}`, this.items.find(doc => doc.data.id === id), this.items);

    //     this.items.find(doc => doc.data.id === id).tab.active = true;
    // }

    // filter(fn) {
    //     return this.items.filter(fn);
    // }

    // find(fn) {
    //     return this.items.find(fn);
    // }

    // forEach(fn) {
    //     return this.items.forEach(fn);
    // }

    // map(fn) {
    //     return this.items.map(fn);
    // }

    // push(fn) {
    //     return this.items.push(fn);
    // }

    // get length() {
    //     return this.items.length;
    // }
}
