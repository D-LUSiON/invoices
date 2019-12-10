import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { map } from 'rxjs/operators';
import { preserveServerState } from './transfer-state.service';
import { isPlatformBrowser } from '@angular/common';
import { ExtensionsConfig } from 'src/app/shared/classes/extension';
import { BehaviorSubject } from 'rxjs';
import { ElectronClientService } from '../electron-client.service';

@Injectable()
export class ExtensionsConfigProvider {

    private _config: ExtensionsConfig;

    config$: BehaviorSubject<ExtensionsConfig> = new BehaviorSubject(this._config);

    constructor(
        private _electronService: ElectronClientService,
        @Inject(PLATFORM_ID) private platformId: {},
        @Inject('APP_BASE_URL') @Optional() private readonly _baseUrl: string
    ) {
        if (isPlatformBrowser(platformId)) {
            this._baseUrl = document.location.href.replace(/\/index\.html(?:\#){0,1}$/, '');
        }
    }

    @preserveServerState('EXTENSION_CONFIGS')
    loadConfig() {
        return this._electronService.get('extensions').pipe(map(config => {
            this._config = config;
            this._sortConfig();
            this.config$.next(this._config);
            return this._config;
        }));
    }

    private _sortConfig() {
        const sorted_config = {};
        Object.keys(this._config).sort((key, next) => {
            if (this._config[key].order > this._config[next].order) return 1;
            if (this._config[key].order < this._config[next].order) return -1;
            return 0;
        }).forEach(key => {
            sorted_config[key] = this._config[key];
        });
        this._config = { ...sorted_config };
    }

    get config() {
        return { ...this._config };
    }
}
