export class Tab {
    title: string = 'New Tab';
    dirty: boolean = false;
    active: boolean = false;
    related_obj: any;

    constructor(data?) {
        this.title = data?.title;
        this.dirty = data?.dirty || false;
        this.active = data?.active || false;
        this.related_obj = data?.related_obj;
    }
}
