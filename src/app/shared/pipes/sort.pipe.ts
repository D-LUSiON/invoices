import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort'
})
export class SortPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        if (value instanceof Array) {
            if (args[0] === 'asc') {
                return value.sort((item, next) => {
                    if (isNaN(+item) || isNaN(+next)) {
                        if (item > next) return 1;
                        if (item < next) return -1;
                        return 0;
                    } else {
                        if (+item > +next) return 1;
                        if (+item < +next) return -1;
                        return 0;
                    }
                });
            } else if (args[0] === 'desc') {
                return value.sort((item, next) => {
                    if (isNaN(+item) || isNaN(+next)) {
                        if (item < next) return 1;
                        if (item > next) return -1;
                        return 0;
                    } else {
                        if (+item < +next) return 1;
                        if (+item > +next) return -1;
                        return 0;
                    }
                });
            }
            return value;
        } else
            return value;
    }

}
