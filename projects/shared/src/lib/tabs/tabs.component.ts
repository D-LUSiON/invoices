import { Component, OnChanges, HostListener, ElementRef, Input, Output, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Tab } from './tab';

@Component({
    selector: 'lib-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements OnChanges {

    @Input() tabs: Document[] = [];

    @Output() tabClose: EventEmitter<[Document, number]> = new EventEmitter();
    @Output() tabActivate: EventEmitter<[Document, number]> = new EventEmitter();

    @HostListener('mousewheel', ['$event']) onMouseWheel(event) {
        this._elRef.nativeElement.scrollLeft -= event.wheelDelta;
    }

    active_tab_idx: number;

    constructor(
        private _elRef: ElementRef
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        const idx = changes['tabs'].currentValue.findIndex(tab => tab.active);
        if (idx > -1)
            this.active_tab_idx = idx;
        else if (idx === -1 && !this.active_tab_idx || this.active_tab_idx === -1) {
            this.activateTab(this.tabs[this.tabs.length - 1], this.tabs.length - 1);
        }
    }

    activateTab(tab: Document, idx: number) {
        this.active_tab_idx = idx;
        this.tabActivate.emit([tab, idx]);
    }

    closeTab(tab: Document, idx: number) {
        this.tabClose.emit([tab, idx]);
    }

}
