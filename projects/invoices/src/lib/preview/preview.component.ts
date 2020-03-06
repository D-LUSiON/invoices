import { Component, OnInit, Input } from '@angular/core';
import { Invoice } from '../classes/invoice';

@Component({
    selector: 'inv-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

    @Input() invoice: Invoice;

    constructor() { }

    ngOnInit(): void {
    }

}
