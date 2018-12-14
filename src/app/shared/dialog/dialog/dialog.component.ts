import { Component, OnInit, ContentChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

    @ContentChild('modal_header') modal_header: TemplateRef<any>;
    @ContentChild('modal_content') modal_content: TemplateRef<any>;
    @ContentChild('modal_footer') modal_footer: TemplateRef<any>;

    @Input() visible: boolean = false;
    @Input() max_width: string = null;
    @Input() max_height: string = null;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

    @Input() heading: string = '';

    constructor() { }

    ngOnInit() {
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

}
