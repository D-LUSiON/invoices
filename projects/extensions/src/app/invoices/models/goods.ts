export class Goods {
    title: string = '';
    measure: string = '';
    quantity: number = 0;
    price: number = 0;
    total: number = 0;

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('title')) this.title = data.title;
            if (data.hasOwnProperty('measure')) this.measure = data.measure;
            if (data.hasOwnProperty('quantity')) this.quantity = data.quantity;
            if (data.hasOwnProperty('price')) this.price = data.price;
            if (data.hasOwnProperty('total')) this.total = data.total;
        }
    }
}
