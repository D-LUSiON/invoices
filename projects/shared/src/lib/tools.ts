export class Tools {
    static makeid(length: number = 16) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    static formatDate(date, format: string) {
        if (!date)
            return '';

        if (typeof date === 'string') {
            date = new Date(date);
        }

        const date_elements = {
            YYYY: date.getFullYear(),
            yyyy: date.getFullYear(),
            YY: date.getFullYear().toString().substr(2, 2),
            MM: ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)),
            M: date.getMonth() + 1,
            DD: ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate()),
            dd: ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate()),
            D: date.getDate(),
            HH: ((date.getHours() < 10) ? '0' + date.getHours() : date.getHours()),
            H: date.getHours(),
            mm: ((date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()),
            m: date.getMinutes(),
            ss: ((date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()),
            s: date.getSeconds(),
            mss: ((date.getMilliseconds() / 1000).toFixed(3)).split('.').pop(),
        };

        let formatted = format.split('').join('');

        for (let key in date_elements) {
            if (date_elements.hasOwnProperty(key)) {
                formatted = formatted.replace(new RegExp(key, 'g'), date_elements[key]);
            }
        }

        return formatted;
    }

    static formatSum(sum: number) {
        return (Math.round((sum + Number.EPSILON) * 100) / 100).toFixed(2);
    }

    /**
     * @description Resolve deep object property from string
     * @example Tools.resolveObj(this.planning_task_form.value, 'assignment_lot.materials[0].material_lot.count') resolves the value of "count" property
     * @example Usage of *:
     * 'assignment_lot.materials[*].material_lot.count' resolves all values of materials[n].material_log.count, concatenated with ', '
     * @example Usage of $:
     * 'assignment_lot.materials[$].material_lot.count' resolves value of last element in 'materials'
     * @param object {object} Object to search in
     * @param path {string} Path of the property
     */
    static resolveObj(object: object = {}, path: string) {
        path = path.replace(/\[([\w\*\$]+)\]/g, '.$1').replace(/^\./, '').replace(/\.$/, '~~').replace(/\.\./, '~~.').replace(/\.\s/, '~~ ');

        let idx = path.indexOf('.');
        if (path.startsWith('*') && Array.isArray(object)) {
            idx = path.indexOf('.');
            if (idx > -1) {
                return object.map(x => {
                    return Tools.resolveObj(x, path.substr(idx + 1));
                }).join(', ');
            }
            return object.join(', ');
        } else if (path.startsWith('$') && Array.isArray(object)) {
            return Tools.resolveObj(object[object.length - 1], path.substr(idx + 1));
        } else if (idx > -1) {
            return Tools.resolveObj(object[path.substring(0, idx)], path.substr(idx + 1));
        }
        path = path.replace('~~', '.');
        return object[path] === undefined ? '' : object[path];
    }
}
