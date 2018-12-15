import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-invoice-edit',
    templateUrl: './invoice-edit.component.html',
    styleUrls: ['./invoice-edit.component.scss']
})
export class InvoiceEditComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<InvoiceEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
