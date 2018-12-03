export class Goods {
    title: string = '';
    measure: string = '';
    quantity: number = 0;
    price: number = 0;
    total: number = 0;

    constructor(data?) {
        if (data) {
            if (data.title) this.title = data.title;
            if (data.measure) this.measure = data.measure;
            if (data.quantity) this.quantity = data.quantity;
            if (data.price) this.price = data.price;
            if (data.total) this.total = data.total;
        }
    }
}
