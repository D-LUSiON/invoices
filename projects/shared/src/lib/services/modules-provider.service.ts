import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModulesProviderService {

    modules: { [key: string]: any } = {};

    module_names: string[] = [];

    constructor() { }

    async loadModules() {
        this.module_names = await (await fetch('./assets/modules.json')).json();

        return Promise
            .all(
                [
                    ...this.module_names.map(mod_name => import(`../../../../resources/modules/${mod_name}/ng/bundles/${mod_name}.umd`))
                ]
            )
            .then((modules) => {
                modules.forEach(m => {
                    const key = Object.keys(m).find(m_key => m_key.match(/Module$/));
                    this.modules[key] = new m[key]();
                });
            });
    }
}
