export class Provider {
    id: string;
    organization: string = '';
    acc_person: string = '';
    address: string = '';
    vat: string = '';

    constructor(data?) {
        if (data) {
            if (data.id) this.id = data.id;
            if (data.organization) this.organization = data.organization;
            if (data.acc_person) this.acc_person = data.acc_person;
            if (data.address) this.address = data.address;
            if (data.vat) this.vat = data.vat;
        }
    }

    raw() {
        return {
            id: this.id,
            organization: this.organization,
            acc_person: this.acc_person,
            address: this.address,
            vat: this.vat,
        };
    }
}
