import { Directive, ElementRef, Renderer2, HostListener, HostBinding, forwardRef, Input } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[libContenteditable][formControlName],[libContenteditable][formControl],[libContenteditable][ngModel]',
    // selector: '[contenteditable][formControlName],[contenteditable][formControl],[contenteditable][ngModel]',
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ContenteditableDirective), multi: true }],
})
export class ContenteditableDirective implements ControlValueAccessor {
    @Input() propValueAccessor = 'innerText';
    @HostBinding('attr.contenteditable') @Input() contenteditable = true;

    private _onChange: (value: string) => void;
    private _onTouched: () => void;
    private _removeDisabledState: () => void;

    constructor(
        private _elementRef: ElementRef,
        private _renderer: Renderer2
    ) { }

    @HostListener('input')
    callOnChange() {
        if (typeof this._onChange == 'function') {
            this._onChange(this._elementRef.nativeElement[this.propValueAccessor]);
        }
    }

    @HostListener('blur')
    callOnTouched() {
        if (typeof this._onTouched == 'function') {
            this._onTouched();
        }
    }

    /**
     * Writes a new value to the element.
     * This method will be called by the forms API to write
     * to the view when programmatic (model -> view) changes are requested.
     *
     * See: [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor#members)
     */
    writeValue(value: any): void {
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, this.propValueAccessor, normalizedValue);
    }

    /**
     * Registers a callback function that should be called when
     * the control's value changes in the UI.
     *
     * This is called by the forms API on initialization so it can update
     * the form model when values propagate from the view (view -> model).
     */
    registerOnChange(fn: () => void): void {
        this._onChange = fn;
    }

    /**
     * Registers a callback function that should be called when the control receives a blur event.
     * This is called by the forms API on initialization so it can update the form model on blur.
     */
    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    /**
     * This function is called by the forms API when the control status changes to or from "DISABLED".
     * Depending on the value, it should enable or disable the appropriate DOM element.
     */
    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this._renderer.setAttribute(this._elementRef.nativeElement, 'disabled', 'true');
            this._removeDisabledState = this._renderer.listen(
                this._elementRef.nativeElement,
                'keydown',
                this._listenerDisabledState
            );
        } else {
            if (this._removeDisabledState) {
                this._renderer.removeAttribute(this._elementRef.nativeElement, 'disabled');
                this._removeDisabledState();
            }
        }
    }

    private _listenerDisabledState(e: KeyboardEvent) {
        e.preventDefault();
    }
}
