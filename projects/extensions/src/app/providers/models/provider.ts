export class Provider {
    id: string; // RethinkDB ID
    organization: string = '';
    acc_person: string = '';
    address: string = '';
    vat: string = '';
    vat2: string = '';

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('id')) this.id = data.id;
            if (data.hasOwnProperty('organization')) this.organization = data.organization;
            if (data.hasOwnProperty('acc_person')) this.acc_person = data.acc_person;
            if (data.hasOwnProperty('address')) this.address = data.address;
            if (data.hasOwnProperty('vat')) this.vat = data.vat;
            if (data.hasOwnProperty('vat2')) this.vat2 = data.vat2;
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
