import { NgModuleFactory } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ExtensionsConfig } from '../../shared/classes/extension';

export abstract class ExtensionLoaderService {
    protected constructor() {
        this.provideExternals();
    }

    extensions$: BehaviorSubject<ExtensionsConfig>;

    abstract provideExternals(): void;

    abstract loadExtensions(): Observable<NgModuleFactory<any>[]>;
    abstract loadAllExtensions(): void;
    abstract load<T>(extensionName): Promise<NgModuleFactory<T>>;
}
