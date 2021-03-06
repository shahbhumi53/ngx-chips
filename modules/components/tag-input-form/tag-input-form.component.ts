import { Component, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
    selector: 'tag-input-form',
    styleUrls: [ './tag-input-form.style.scss' ],
    templateUrl: './tag-input-form.template.html'
})
export class TagInputForm implements OnChanges {
    /**
     * @name onSubmit
     */
    @Output() public onSubmit: EventEmitter<any> = new EventEmitter();

    /**
     * @name onBlur
     */
    @Output() public onBlur: EventEmitter<any> = new EventEmitter();

    /**
     * @name onFocus
     */
    @Output() public onFocus: EventEmitter<any> = new EventEmitter();

    /**
     * @name onKeyup
     */
    @Output() public onKeyup: EventEmitter<any> = new EventEmitter();

    /**
     * @name onKeydown
     */
    @Output() public onKeydown: EventEmitter<any> = new EventEmitter();

    // inputs

    /**
     * @name placeholder
     */
    @Input() public placeholder: string;

    /**
     * @name validators
     */
    @Input() public validators: ValidatorFn[] = [];

    /**
     * @name asyncValidators
     * @desc array of AsyncValidator that are used to validate the tag before it gets appended to the list
     */
    @Input() public asyncValidators: AsyncValidatorFn[] = [];

    /**
     * @name inputId
     */
    @Input() public inputId: string;

    /**
     * @name inputClass
     */
    @Input() public inputClass: string;

    /**
     * @name inputText
     */
    @Input() public get inputText(): string {
        return this.inputTextValue;
    }

    /**
     * @name tabindex
     * @desc pass through the specified tabindex to the input
     */
    @Input() public tabindex = '';

    /**
     * @name disabled
     */
    @Input() public disabled = false;

    /**
     * @name inputText
     * @param text {string}
     */
    public set inputText(text: string) {
        this.inputTextValue = text;
        this.inputTextChange.emit(text);
    }

    /**
     * @name input
     */
    @ViewChild('input') public input;

    /**
     * @name form
     */
    public form: FormGroup;

    /**
     * @name inputTextChange
     */
    @Output() public inputTextChange: EventEmitter<string> = new EventEmitter();

    /**
     * @name inputTextValue
     */
    public inputTextValue = '';

    public ngOnInit() {
        // creating form
        this.form = new FormGroup({
            item: new FormControl({value: '', disabled: this.disabled}, this.validators, this.asyncValidators)
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.disabled && !changes.disabled.firstChange) {
            if (changes.disabled.currentValue) {
                this.form.controls['item'].disable();
            } else {
                this.form.controls['item'].enable();
            }
        }
    }

	/**
     * @name value
     */
    public get value(): FormControl {
        return this.form.get('item') as FormControl;
    }

	/**
     * @name isInputFocused
     */
    public isInputFocused(): boolean {
        return document.activeElement === this.input.nativeElement;
    }

	/**
     * @name getErrorMessages
     * @param messages
     */
    public getErrorMessages(messages: {[key: string]: string}): string[] {
        return Object.keys(messages)
            .filter(err => this.value.hasError(err))
            .map(err => messages[err]);
    }

    /**
     * @name hasErrors
     */
    public hasErrors(): boolean {
        const { dirty, value, valid } = this.form;
        return dirty && value.item && !valid;
    }

	/**
     * @name focus
     */
    public focus(): void {
        this.input.nativeElement.focus();
    }

    /**
     * @name blur
     */
    public blur(): void {
        this.input.nativeElement.blur();
    }

	/**
     * @name getElementPosition
     */
    public getElementPosition(): ClientRect {
        return this.input.nativeElement.getBoundingClientRect();
    }

    /**
     * - removes input from the component
     * @name destroy
     */
    public destroy(): void {
        const input = this.input.nativeElement;
        input.parentElement.removeChild(input);
    }

    /**
     * @name onKeyDown
     * @param $event
     */
    public onKeyDown($event) {
        return this.onKeydown.emit($event);
    }

    /**
     * @name submit
     */
    public submit($event: any): void {
        if (this.form.valid) {
            this.onSubmit.emit($event);
        }
    }
}
