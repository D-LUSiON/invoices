import { NgModuleFactory } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { PluginsConfig } from '../../shared/classes/plugin';

export abstract class PluginLoaderService {
    protected constructor() {
        this.provideExternals();
    }

    plugins$: BehaviorSubject<PluginsConfig>;

    abstract provideExternals(): void;

    abstract loadPlugins(): Observable<NgModuleFactory<any>[]>;
    abstract loadAllPlugins(): void;
    abstract load<T>(pluginName): Promise<NgModuleFactory<T>>;
}
