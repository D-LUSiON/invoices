import { Injectable } from '@angular/core';
import { Recipient } from '@app/shared';
import { map } from 'rxjs/operators';
import { ElectronClientService } from './electron-client.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class RecipientsService {

    private _recipients: Recipient[] = [];

    recipients$: BehaviorSubject<Recipient[]> = new BehaviorSubject(this.recipients);

    constructor(
        private _electron: ElectronClientService,
    ) { }

    get recipients() {
        return this._recipients.slice();
    }

    getAll() {
        return this._electron.getAll('recipients').subscribe(response => {
            this._recipients = response.map(recipient => new Recipient(recipient));
            this.recipients$.next(this.recipients);
            return this.recipients;
        });
    }

    save(recipient: Recipient) {
        return this._electron.save('recipient', recipient).pipe(map(response => {
            const recipient_upd = new Recipient(response);
            if (!recipient._id && response._id)
                this._recipients = [recipient_upd, ...this._recipients];
            else {
                const idx = this._recipients.findIndex(x => x._id === recipient._id);
                this._recipients.splice(idx, 1, recipient_upd);
            }
            this.recipients$.next(this.recipients);
            return response;
        }));
    }

    remove(recipient) {
        return this._electron.remove('recipient', recipient).pipe(map(response => {
            if (recipient._id) {
                const idx = this._recipients.findIndex(x => x._id === recipient._id);
                this._recipients.splice(idx, 1);
            }
            this.recipients$.next(this.recipients);
            return recipient;
        }));
    }

}
