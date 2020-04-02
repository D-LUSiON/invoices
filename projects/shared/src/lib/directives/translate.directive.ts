import { Directive, ElementRef, OnInit, Input, AfterViewChecked } from '@angular/core';
import { TranslationsService } from '../services';

@Directive({
    selector: '[translate]'
})
export class TranslateDirective implements OnInit, AfterViewChecked {

    scope: string = '_general';

    @Input() set translate(scope: string) {
        if (scope)
            this.scope = scope;
    }

    constructor(
        private _elRef: ElementRef,
        private _translate: TranslationsService
    ) { }

    ngOnInit() { }

    ngAfterViewChecked(): void {
        this.translateNodes();
    }

    translateNodes() {
        (this._elRef.nativeElement as HTMLDivElement).childNodes.forEach(node => {
            node.textContent = node.textContent.replace(node.textContent.trim(), this._translate.translate(node.textContent.trim(), this.scope));
        });
    }
}
