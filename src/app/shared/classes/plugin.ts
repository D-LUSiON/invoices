import { NgModuleFactory } from '@angular/core';

export interface PluginsConfig {
    [key: string]: Plugin;
}

export class Plugin {
    title: string;
    name: string;
    description: string;
    path: string;
    icon?: string;
    position?: 'top' | 'bottom';
    order: number = 1;
    deps?: string[];
    enabled?: boolean;
    listComponent?: any;
    previewComponent?: any;
    editComponent?: any;

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('title')) this.title = data['title'];
            if (data.hasOwnProperty('name')) this.name = data['name'];
            if (data.hasOwnProperty('description')) this.description = data['description'];
            if (data.hasOwnProperty('path')) this.path = data['path'];
            if (data.hasOwnProperty('icon')) this.icon = data['icon'];
            if (data.hasOwnProperty('position')) this.position = data['position'];
            if (data.hasOwnProperty('order')) this.order = data['order'];
            if (data.hasOwnProperty('deps')) this.deps = data['deps'];
            if (data.hasOwnProperty('enabled')) this.enabled = data['enabled'];
            if (data.hasOwnProperty('listComponent')) this.listComponent = data['listComponent'];
            if (data.hasOwnProperty('previewComponent')) this.previewComponent = data['previewComponent'];
            if (data.hasOwnProperty('editComponent')) this.editComponent = data['editComponent'];
        }
    }
}
