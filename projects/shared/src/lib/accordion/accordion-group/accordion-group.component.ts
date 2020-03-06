import { Component, Input, HostBinding, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
    selector: 'lib-accordion-group',
    templateUrl: './accordion-group.component.html',
    styleUrls: ['./accordion-group.component.scss']
})
export class AccordionGroupComponent implements OnChanges {

    @Input() heading: string = '';

    @Input() expand: boolean = false;
    @Output() expandChange: EventEmitter<boolean> = new EventEmitter();

    @HostBinding('class.expanded') private _expanded: boolean = false;

    constructor() { }

    ngOnChanges(changes): void {
        if (changes.hasOwnProperty('expand')) {
            this._expanded = changes['expand'].currentValue;
        }
    }

    toggleExpanded() {
        this._expanded = !this._expanded;
        this.expandChange.emit(this._expanded);
    }

    expandGroup() {
        setTimeout(() => {
            this.expand = true;
            this._expanded = true;
        });
    }

    collapseGroup() {
        setTimeout(() => {
            this.expand = false;
            this._expanded = false;
        });
    }

}
