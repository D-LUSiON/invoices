import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { preserveServerState } from './transfer-state.service';
import { isPlatformBrowser } from '@angular/common';
import { PluginsConfig } from 'src/app/shared/classes/plugin';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PluginsConfigProvider {

    private _config: PluginsConfig;

    config$: BehaviorSubject<PluginsConfig> = new BehaviorSubject(this._config);

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: {},
        @Inject('APP_BASE_URL') @Optional() private readonly _baseUrl: string
    ) {
        if (isPlatformBrowser(platformId)) {
            this._baseUrl = document.location.href.replace(/\/index\.html(?:\#){0,1}$/, '');
        }
    }

    @preserveServerState('PLUGIN_CONFIGS')
    loadConfig() {
        return this.http.get<PluginsConfig>(
            `${this._baseUrl}/assets/plugins-config.json`
        ).pipe(map(result => {
            this._config = result;
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
