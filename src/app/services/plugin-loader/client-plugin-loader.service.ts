import { Injectable, NgModuleFactory, Injector } from '@angular/core';
import { PluginLoaderService } from './plugin-loader.service';
import { PLUGIN_EXTERNALS_MAP } from './plugin-externals';
import { PluginsConfigProvider } from './plugins-config.provider';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { PluginsConfig, Plugin } from '../../shared/classes/plugin';
import { map } from 'rxjs/operators';

const SystemJs = window.System;

@Injectable()
export class ClientPluginLoaderService extends PluginLoaderService {

    baseUrl: string = '';

    private _plugins: PluginsConfig = {};

    plugins$: BehaviorSubject<PluginsConfig> = new BehaviorSubject(this._plugins);

    constructor(
        private injector: Injector,
        private _configProvider: PluginsConfigProvider
    ) {
        super();
        this.baseUrl = document.location.href.split('#')[0].replace(/\/index\.html$/, '');
        this._configProvider.config$.subscribe(config => {
            this._plugins = { ...config };
            if (Object.keys(config).length)
                this.loadAllPlugins();
        });
    }

    provideExternals() {
        Object.keys(PLUGIN_EXTERNALS_MAP).forEach(externalKey =>
            window.define(externalKey, [], () => PLUGIN_EXTERNALS_MAP[externalKey])
        );
    }

    loadAllPlugins() {
        return Promise.all([
            ...Object.keys(this._plugins)
                .filter(key => this._plugins[key].enabled)
                .map(key => this.load(key))
        ]).then(moduleFactories => {
            const plugins = {};
            const plugins_keys = Object.keys(this._plugins).filter(key => this._plugins[key].enabled);

            moduleFactories.forEach((moduleFactory, idx) => {
                const moduleRef = moduleFactory.create(this.injector);
                const listComponent = (moduleFactory.moduleType as any).listComponent;
                const previewComponent = (moduleFactory.moduleType as any).previewComponent;
                const editComponent = (moduleFactory.moduleType as any).editComponent;

                plugins[plugins_keys[idx]] = new Plugin({
                    ...this._plugins[plugins_keys[idx]],
                    listComponent: (listComponent) ? moduleRef.componentFactoryResolver.resolveComponentFactory(listComponent) : null,
                    previewComponent: (previewComponent) ? moduleRef.componentFactoryResolver.resolveComponentFactory(previewComponent) : null,
                    editComponent: (editComponent) ? moduleRef.componentFactoryResolver.resolveComponentFactory(editComponent) : null,
                });
            });
            this._plugins = { ...plugins };
            this.plugins$.next(this._plugins);
        });
    }

    loadPlugins() {
        return from(Promise.all([
            ...Object.keys(this._plugins)
                .filter(key => this._plugins[key].enabled)
                .map(key => this.load(key))
        ])).pipe(map(result => {
            return result;
        }));
    }

    load<T>(pluginName): Promise<NgModuleFactory<T>> {
        if (!this._plugins[pluginName]) {
            throw Error(`Can't find plugin with the name "${pluginName}"!`);
        }

        const depsPromises = (this._plugins[pluginName].deps || []).map(dep => {
            return SystemJs.import(`${this.baseUrl}${this._plugins[dep].path}`).then(m => {
                window['define'](dep, [], () => m.default);
            });
        });

        return Promise.all(depsPromises).then(() => {
            return SystemJs.import(`${this.baseUrl}${this._plugins[pluginName].path}`).then(
                module => module.default.default
            );
        });
    }
}
