import { Component, OnInit, AfterViewInit, QueryList, ContentChildren, Input, Output, EventEmitter } from '@angular/core';
import { AccordionGroupComponent } from './accordion-group/accordion-group.component';

@Component({
    selector: 'lib-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit, AfterViewInit {

    @Input() expandOnInit: boolean = true;
    @Input() collapseOthers: boolean = true;

    @Output() groupExpanded: EventEmitter<number> = new EventEmitter();

    @ContentChildren(AccordionGroupComponent) accordionGroups: QueryList<AccordionGroupComponent>;

    active_section_idx: number = 0;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        if (this.expandOnInit)
            this.accordionGroups.first.expandGroup();
        this.accordionGroups.forEach((group: AccordionGroupComponent, idx: number) => {
            group.expandChange.subscribe(expanded => {
                if (expanded && this.collapseOthers) {
                    this.accordionGroups.filter(g => g.heading !== group.heading).forEach((g: AccordionGroupComponent) => {
                        g.collapseGroup();
                    });
                    this.groupExpanded.emit(idx);
                }
            });
        });
    }

}
