import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Invoice } from '@app/shared';
import { ElectronClientService } from './electron-client.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { RecipientsService } from './recipients.service';
import { ProvidersService } from './providers.service';

@Injectable()
export class InvoicesService {

    private _invoices: Invoice[] = [];
    private _archive: Invoice[] = [];

    invoices$: BehaviorSubject<Invoice[]> = new BehaviorSubject(this.invoices);
    archive$: BehaviorSubject<Invoice[]> = new BehaviorSubject(this.archive);

    constructor(
        private _electron: ElectronClientService,
        private _recipients: RecipientsService,
        private _providers: ProvidersService,
    ) { }

    get invoices() {
        return this._invoices.slice();
    }

    get archive() {
        return this._archive.slice();
    }

    getAll() {
        return this._electron.getAll('invoices').subscribe(response => {
            this._invoices = response.map(invoice => new Invoice(invoice));
            this.sortBy('issue_date');
            return this.invoices;
        });
    }

    getArchived() {
        return this._electron.getAll('invoices', { status: 'archived' }).subscribe(response => {
            this._archive = response.map(invoice => new Invoice(invoice));
            this.archive$.next(this.archive);
            return this.archive;
        });
    }

    get(id: string) {
        return this._electron.get('invoice', id).pipe(map(response => {
            const invoice = new Invoice(response);
            return invoice;
        }));
    }

    save(data: Invoice) {
        return this._electron.save('invoice', data).pipe(map(response => {
            const invoice = new Invoice(response);
            this._recipients.getAll();
            this._providers.getAll();
            if (!data && response['_id']) {
                this._invoices = [...this._invoices, invoice];
                this.invoices$.next(this.invoices);
                return invoice;
            } else {
                const idx = this._invoices.findIndex(x => x._id === invoice._id);
                this._invoices[idx] = invoice;
                this.invoices$.next(this.invoices);
                return invoice;
            }
        }));
    }

    remove(id) {
        return this._electron.remove('invoice', id).pipe(map(response => {
            const invoice = new Invoice(response);
            if (invoice._id) {
                const idx = this._invoices.findIndex(x => x._id === invoice._id);
                this._invoices.splice(idx, 1);
            }
            this.invoices$.next(this.invoices);
            return invoice;
        }));
    }

    getByID(id) {
        return this._invoices.filter(invoice => invoice._id === id);
    }

    sortBy(prop, sort?) {
        if (['issue_date', 'creation_date', 'update_date'].indexOf(prop) > -1) {
            this._invoices = this._invoices.sort((x, y) => {
                if (x.getDateTime(prop) < y.getDateTime(prop))
                    return (sort && sort === 'asc') ? -1 : 1;
                if (x.getDateTime(prop) > y.getDateTime(prop))
                    return (sort && sort === 'asc') ? 1 : -1;
                if (x.getDateTime(prop) === y.getDateTime(prop))
                    return 0;
            });
            this.invoices$.next(this.invoices);
        }
    }

    sendInvoices(send_data) {
        return this._electron.send('invoices:send', send_data).pipe(map(response => {
            this.getAll();
            return response;
        }));
    }

}
