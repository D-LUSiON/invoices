import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Provider } from '../classes';

@Component({
    selector: 'inv-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnChanges {

    @Input() provider: Provider;

    constructor() { }

    ngOnInit(): void {

    }

    ngOnChanges(changes) {
        console.log(`provider preview changes`, changes);

    }

}
