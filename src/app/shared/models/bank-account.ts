export class BankAccount {
    _id: string;
    bank_acc: string;
    bank: string;
    description: string;

    constructor(data?) {
        if (data) {
            this._id = data._id;
            this.bank_acc = data.bank_acc;
            this.bank = data.bank;
            this.description = data.description;
        }
    }
}
