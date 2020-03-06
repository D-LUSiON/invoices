export class Module {
    module_name: string = '';
    title: string = '';
    icon: string = '';
    active: boolean = false;
    component_sidebar?: any;
    component_preview?: any;
    component_edit?: any;
    inputs: object;

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('module_name')) this.module_name = data['module_name'];
            if (data.hasOwnProperty('title')) this.title = data['title'];
            if (data.hasOwnProperty('icon')) this.icon = data['icon'];
            if (data.hasOwnProperty('active')) this.active = data['active'];
            if (data.hasOwnProperty('component_sidebar')) this.component_sidebar = data['component_sidebar'];
            if (data.hasOwnProperty('component_preview')) this.component_preview = data['component_preview'];
            if (data.hasOwnProperty('component_edit')) this.component_edit = data['component_edit'];
            if (data.hasOwnProperty('inputs')) this.inputs = data['inputs'];
        }
    }
}
