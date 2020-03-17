import {
    Component,
    OnInit,
    Input,
    forwardRef,
    Output,
    EventEmitter,
    SimpleChanges,
    OnChanges,
    Optional,
    Self,
    ElementRef,
    HostListener,
    ViewChild
} from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NgControl
} from '@angular/forms';

@Component({
    selector: 'lib-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
    // providers: [
    //     {
    //         provide: NG_VALUE_ACCESSOR,
    //         useExisting: forwardRef(() => AutocompleteComponent),
    //         multi: true
    //     }
    // ]
})
export class AutocompleteComponent implements ControlValueAccessor, OnInit, OnChanges {

    @Input() results: any[] = [];
    @Input() labelField: string = 'title';
    @Input() idField: string = 'id';

    private _modified_results: { label: string, value: any }[] = [];
    filtered_results: any[] = [];

    @Output() select: EventEmitter<any> = new EventEmitter();

    dropdown_opened: boolean = false;
    value: any;
    selected_value: any;

    highlighted_idx: number = -1;

    @ViewChild('input') inputRef: ElementRef;

    @HostListener('document:click', ['$event']) clickOut(event) {
        if (!this._eRef.nativeElement.contains(event.target)) {
            // setTimeout(() => {
            this.dropdown_opened = false;
            // }, 50);
        }
    }

    @HostListener('document:keyup', ['$event']) keyUp(event: KeyboardEvent) {
        if (this.dropdown_opened) {
            switch (event.key) {
                case 'ArrowUp':
                    this.highlighted_idx -= 1;
                    if (this.highlighted_idx < 0) {
                        this.highlighted_idx = this.filtered_results.length - 1;
                    }
                    break;
                case 'ArrowDown':
                    this.highlighted_idx += 1;
                    if (this.highlighted_idx === this.filtered_results.length) {
                        this.highlighted_idx = 0;
                    }

                    break;
                case 'Enter':
                    if (this.highlighted_idx > -1) {
                        this.onSelect(this.highlighted_idx);
                    }
                    break;

                default:
                    break;
            }
        }
    }

    constructor(
        @Optional() @Self() public _controlDirective: NgControl,
        private _eRef: ElementRef,
    ) {
        if (this._controlDirective)
            this._controlDirective.valueAccessor = this;
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['results']) {
            this._modified_results = this.results instanceof Array ? this.results.map(x => ({ label: x[this.labelField], value: x })) : [];
            this.filtered_results = [...this._modified_results];
            this.dropdown_opened = false;
            if (this.value) {
                this.selected_value = this.results.find(x => x[this.idField] === this.value);
            }
        }
    }

    writeValue(value: any) {
        this.value = {
            label: value[this.labelField],
            value
        };
        // this.value = this.results.find(x => x[this.idField] === this.value);
    }

    // propagateChange = (_: any) => { };

    onChange = (value: any) => { };

    onTouched = () => { };

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched() { }

    filterResults(value: string) {
        this.dropdown_opened = true;
        this.filtered_results = this._modified_results.filter(x => !value || x.label.toLowerCase().indexOf(value.toLowerCase()) > -1);
        this.highlighted_idx = -1;
    }

    onFocus() {
        this.filterResults(this.inputRef.nativeElement.value);
    }

    onBlur() {
        setTimeout(() => {
            this.dropdown_opened = false;
        }, 150);
    }

    onSelect(idx: number) {
        this.value = this.filtered_results[idx];

        this.dropdown_opened = false;
        this.highlighted_idx = -1;

        this.onChange(this.value.value);
    }

}
