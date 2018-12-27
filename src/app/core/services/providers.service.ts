import { Injectable } from '@angular/core';
import { ElectronClientService } from './electron-client.service';
import { Provider } from '@app/shared';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ProvidersService {

    private _providers: Provider[] = [];

    providers$: BehaviorSubject<Provider[]> = new BehaviorSubject(this.providers);

    constructor(
        private _electron: ElectronClientService,
    ) { }

    get providers() {
        return this._providers.slice();
    }

    getAll() {
        return this._electron.getAll('providers').subscribe(response => {
            this._providers = response.map(provider => new Provider(provider));
            this.providers$.next(this.providers);
            return this.providers;
        });
    }

    save(provider: Provider) {
        return this._electron.save('provider', provider).pipe(map(response => {
            const provider_upd = new Provider(response);
            if (!provider._id && response._id)
                this._providers = [provider_upd, ...this._providers];
            else {
                const idx = this._providers.findIndex(x => x._id === provider._id);
                this._providers.splice(idx, 1, provider_upd);
            }
            this.providers$.next(this.providers);
            return response;
        }));
    }

    remove(provider) {
        return this._electron.remove('provider', provider).pipe(map(response => {
            if (provider._id) {
                const idx = this._providers.findIndex(x => x._id === provider._id);
                this._providers.splice(idx, 1);
            }
            this.providers$.next(this.providers);
            return provider;
        }));
    }

}
