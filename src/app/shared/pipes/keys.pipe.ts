import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keys'
})
export class KeysPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        if (typeof value === 'object')
            return Object.keys(value);
        else
            return null;
    }

}
