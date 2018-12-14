import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RecipientsService } from '@app/core';
import { Recipient } from '@app/shared';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-recipients-list',
    templateUrl: './recipients-list.component.html',
    styleUrls: ['./recipients-list.component.scss']
})
export class RecipientsListComponent implements OnInit {

    recipients: Recipient[] = [];
    filtered_recipients: Recipient[] = [];

    recipients_columns: string[] = ['name', 'city', 'address', 'email', 'bank_acc', 'actions'];

    recipients_subs: Subscription;

    edit_dialog_visible: boolean = false;

    recipient_form: FormGroup;

    constructor(
        private _fb: FormBuilder,
        private _recipientsService: RecipientsService,
        private _snackBar: MatSnackBar
    ) {
        this.recipients_subs = this._recipientsService.recipients$.subscribe(recipients => {
            this.recipients = recipients;
            this.filtered_recipients = [...recipients];
        });

        this._recipientsService.getAll();

        this._initForm();
    }

    ngOnInit() {
    }

    private _initForm() {
        this.recipient_form = this._fb.group({
            '_id': this._fb.control(''),
            'name': this._fb.control('', [Validators.required]),
            'city': this._fb.control(''),
            'address': this._fb.control(''),
            'email': this._fb.control(''),
            'bank_acc': this._fb.control('')
        });
    }

    private _resetForm() {
        this.recipient_form.patchValue({});
        this.recipient_form.markAsPristine();
        this.recipient_form.markAsUntouched();
    }

    editRecipient(event, recipient: Recipient) {
        event.preventDefault();
        if (!recipient) recipient = new Recipient();
        this.recipient_form.patchValue(recipient);
        this.recipient_form.markAsPristine();
        this.edit_dialog_visible = true;
    }

    filterRecipients(value) {
        if (value === undefined)
            value = '';

        if (value)
            this.filtered_recipients = this.recipients.filter(
                (x: Recipient) =>
                    (
                        x.name.toLowerCase().startsWith(value.toLowerCase()) ||
                        x.city.toLowerCase().startsWith(value.toLowerCase()) ||
                        x.address.toLowerCase().startsWith(value.toLowerCase()) ||
                        x.email.toLowerCase().startsWith(value.toLowerCase()) ||
                        x.bank_acc.toLowerCase().startsWith(value.toLowerCase())
                    )
            );
        else
            this.filtered_recipients = [...this.recipients];
    }

    onSubmit() {
        const recipient = new Recipient(this.recipient_form.value);

        const idx = this.recipients.findIndex(x => x.name === recipient.name && !recipient._id);

        if (idx === -1)
            this._recipientsService.save(recipient).subscribe((response: Recipient) => {
                this.edit_dialog_visible = false;
                const message = (!recipient._id && response._id) ? `Успешно създадохте ${recipient.name}!` : `Успешно редактирахте ${recipient.name}!`;
                this._snackBar.open(message, '', {
                    duration: 2000,
                });
            });
        else
            alert('Вече съществува получател с такова име!');
    }

    onRemove(recipient: Recipient) {
        if (confirm(`Сигурни ли сте, че искате да изтриете "${recipient.name}"?`))
            this._recipientsService.remove(recipient).subscribe(response => {
                this._snackBar.open(`Успешно изтрихте ${recipient.name}!`, '', {
                    duration: 2000,
                });
            });
    }

}
