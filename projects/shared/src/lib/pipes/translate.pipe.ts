import { Pipe, PipeTransform } from '@angular/core';
import { TranslationsService } from '../services';

@Pipe({
    name: 'translate'
})
export class TranslatePipe implements PipeTransform {

    private _current_lang: string = this._translations.current_lang;

    constructor(
        private _translations: TranslationsService
    ) {
        _translations.current_lang$.subscribe(lang => {
            this._current_lang = lang;
        });
    }

    transform(value: string, scope: string = '_general'): unknown {
        if (typeof value !== 'string')
            return value;
        else {
            const new_value = this._translations.translate(value, scope || '');
            return new_value || value;
        }
    }

}
