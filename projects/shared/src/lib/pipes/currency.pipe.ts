import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

    /**
     * Pipe that transforms number to currency string
     *
     * @param number value Number to be transformed
     * @param number [digits] Decimal digits
     * @param string [currency] Currency sign or string
     * @param ('start' | 'end') [position] Position of currency sign (front or back of the value)
     * @returns string
     * @memberof CurrencyPipe
     */
    transform(value: number, digits?: number, currency?: string, position?: 'start' | 'end'): string {
        if (typeof value !== 'number')
        return value;

        if (!digits) digits = 2;
        if (!currency) currency = '';
        if (!position) position = 'start';
        return `${position === 'start' ? currency : ''}${value.toFixed(2)}${position === 'end' ? currency : ''}`;

    }

}
