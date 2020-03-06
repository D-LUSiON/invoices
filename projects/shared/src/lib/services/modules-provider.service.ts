import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModulesProviderService {

    modules: { [key: string]: any } = {};
    // modules: any[] = [];

    module_names: string[] = [
        'invoices',
        'providers',
        // 'sending',
        // 'settings'
    ];

    constructor() { }

    async loadModules() {
        this.module_names = await (await fetch('./assets/modules.json')).json();
        console.log(__dirname);

        return Promise
            .all(
                [
                    ...this.module_names.map(mod_name => import(`../../../../resources/modules/${mod_name}/ng/bundles/${mod_name}.umd`))
                ]
            )
            // .all(this.module_names.map(mod_name => import(`../interfaces/${mod_name}/${mod_name}.module`)))
            // .all(this.module_names.map(mod_name => import(`./interfaces-${mod_name}-${mod_name}-module`)))
            // .all([
            // import('../interfaces/invoices/invoices.module'),
            // import('../interfaces/providers/providers.module'),
            // import('../interfaces/sending/sending.module'),
            // import('../interfaces/settings/settings.module'),
            // ])
            .then((modules) => {
                modules.forEach(m => {
                    const key = Object.keys(m).find(m_key => m_key.match(/Module$/));
                    this.modules[key] = new m[key]();
                });
            });
    }
}
