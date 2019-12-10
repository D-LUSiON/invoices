import { Injectable, NgModuleFactory, Injector } from '@angular/core';
import { ExtensionLoaderService } from './extension-loader.service';
import { EXTENSION_EXTERNALS_MAP } from './extension-externals';
import { ExtensionsConfigProvider } from './extensions-config.provider';
import { BehaviorSubject, Observable, from } from 'rxjs';
// import { ExtensionsConfig, Extension } from '../../shared/classes/extension';
import { ExtensionsConfig, Extension } from 'shared';
import { map } from 'rxjs/operators';
import { ElectronClientService } from '../electron-client.service';

const SystemJs = window.System;

@Injectable()
export class ClientExtensionLoaderService extends ExtensionLoaderService {

    baseUrl: string = '';

    private _extensions: ExtensionsConfig = {};

    extensions$: BehaviorSubject<ExtensionsConfig> = new BehaviorSubject(this._extensions);

    constructor(
        private injector: Injector,
        private _configProvider: ExtensionsConfigProvider,
        private _electronClient: ElectronClientService,
    ) {
        super();
        this.baseUrl = document.location.href.split('#')[0].replace(/\/index\.html$/, '');
        this._configProvider.config$.subscribe(config => {
            this._extensions = { ...config };
            if (Object.keys(config).length)
                this.loadAllExtensions();
        });
    }

    provideExternals() {
        Object.keys(EXTENSION_EXTERNALS_MAP).forEach(externalKey =>
            window.define(externalKey, [], () => EXTENSION_EXTERNALS_MAP[externalKey])
        );
    }

    loadAllExtensions() {
        return Promise.all([
            ...Object.keys(this._extensions)
                .filter(key => this._extensions[key].enabled)
                .map(key => this.load(key))
        ]).then(moduleFactories => {
            const extensions = {};
            const extensions_keys = Object.keys(this._extensions).filter(key => this._extensions[key].enabled);

            moduleFactories.forEach((moduleFactory, idx) => {
                const moduleRef = moduleFactory.create(this.injector);
                const listComponent = (moduleFactory.moduleType as any).listComponent;
                const previewComponent = (moduleFactory.moduleType as any).previewComponent;
                const editComponent = (moduleFactory.moduleType as any).editComponent;

                extensions[extensions_keys[idx]] = new Extension({
                    ...this._extensions[extensions_keys[idx]],
                    listComponent: (listComponent) ? moduleRef.componentFactoryResolver.resolveComponentFactory(listComponent) : null,
                    previewComponent: (previewComponent) ? moduleRef.componentFactoryResolver.resolveComponentFactory(previewComponent) : null,
                    editComponent: (editComponent) ? moduleRef.componentFactoryResolver.resolveComponentFactory(editComponent) : null,
                });
            });
            this._extensions = { ...extensions };
            this.extensions$.next(this._extensions);
        });
    }

    loadExtensions() {
        return from(Promise.all([
            ...Object.keys(this._extensions)
                .filter(key => this._extensions[key].enabled)
                .map(key => this.load(key))
        ])).pipe(map(result => {
            return result;
        }));
    }

    load<T>(extensionName): Promise<NgModuleFactory<T>> {
        if (!this._extensions[extensionName]) {
            throw Error(`Can't find extension with the name "${extensionName}"!`);
        }

        const depsPromises = (this._extensions[extensionName].deps || []).map(dep => {
            return SystemJs.import(`${this._extensions[dep].path}`).then(m => {
                window.define(dep, [], () => m.default);
            });
        });

        return Promise.all(depsPromises).then(() => {
            return SystemJs.import(`${this._extensions[extensionName].path}`).then(
                module => module.default.default
            );
        });
    }
}
