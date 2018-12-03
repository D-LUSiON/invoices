export class Tools {
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
}
