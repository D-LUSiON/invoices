import { ComponentFactory } from '@angular/core';

export class Tab {
    title: string;
    component: ComponentFactory<any>;
    component_data: { [key: string]: any } | any = {};
    componentRef?: any;

    constructor(data) {
        this.title = data['title'] ? data['title'] : 'New tab';
        this.component = data['component'];
        this.component_data = data['component_data'] || {};
        if (data.hasOwnProperty('componentRef')) this.componentRef = data['componentRef'];
    }
}
