import { Injectable } from '@angular/core';
import { ElectronClientService } from './electron-client.service';
import { Tools } from '../tools';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TranslationsService {

    private _translations: { [key: string]: { [key: string]: { [key: string]: string } } };

    current_lang: string = 'en';

    current_lang$: BehaviorSubject<string> = new BehaviorSubject(this.current_lang);

    constructor(
        private _electron: ElectronClientService,
    ) {
        _electron.subscribeTo('translations:current-lang').subscribe(lang => {
            if (lang !== this.current_lang) {
                this.current_lang = lang;
                this.current_lang$.next(this.current_lang);
            }
        });
    }

    getCurrentLang() {
        return new Promise((resolve, reject) => {
            this._electron.get('translations:current-lang').subscribe(lang => {
                this.current_lang = lang;
                this.current_lang$.next(this.current_lang);
                resolve(lang);
            });
        });
    }

    getTranslations() {
        return new Promise((resolve, reject) => {
            this._electron.getAll('translations').subscribe(result => {
                this._translations = { ...result };
                resolve(this._translations);
            });
        });
    }

    translate(str: string, scope: string = '_general') {
        let new_str = str.split('.');
        if (scope)
            new_str = [scope.toLowerCase(), ...new_str];
        new_str.splice(1, 0, this.current_lang);
        const trn_str = Tools.resolveObj(this._translations, new_str.join('.'));
        return trn_str || str;
    }
}
