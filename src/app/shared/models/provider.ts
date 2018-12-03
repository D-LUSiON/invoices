export class Provider {
    _id: string;
    organization: string = '';
    acc_person: string = '';
    address: string = '';
    vat: string = '';
    vat2: string = '';

    constructor(data?) {
        if (data) {
            if (data._id) this._id = data._id;
            if (data.organization) this.organization = data.organization;
            if (data.acc_person) this.acc_person = data.acc_person;
            if (data.address) this.address = data.address;
            if (data.vat) this.vat = data.vat;
            if (data.vat2) this.vat2 = data.vat2;
        }
    }

    raw() {
        return {
            organization: this.organization,
            acc_person: this.acc_person,
            address: this.address,
            vat: this.vat,
            vat2: this.vat2,
        };
    }
}
