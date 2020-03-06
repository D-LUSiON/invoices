import { Tools } from '../tools';
import { ComponentRef, Type } from '@angular/core';

export class Document {
    _id: string = Tools.makeid();
    title: string = '';
    module: string = '';
    dirty: boolean = false;
    active: boolean = false;
    mode: 'preview' | 'edit' = 'preview';
    component: Type<unknown>;
    instance: ComponentRef<any>;
    inputs: { [key: string]: any } = {};

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('_id')) this._id = data['_id'];
            if (data.hasOwnProperty('title')) this.title = data['title'];
            if (data.hasOwnProperty('module')) this.module = data['module'];
            if (data.hasOwnProperty('dirty')) this.dirty = data['dirty'];
            if (data.hasOwnProperty('active')) this.active = data['active'];
            if (data.hasOwnProperty('mode')) this.mode = data['mode'];
            if (data.hasOwnProperty('component')) this.component = data['component'];
            if (data.hasOwnProperty('instance')) this.instance = data['instance'];
            if (data.hasOwnProperty('inputs')) this.inputs = data['inputs'];
        }
    }
}
