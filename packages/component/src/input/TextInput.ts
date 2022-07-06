import {IElementInternals, ValidityStateFlags} from "types/lib.elementInternals";
import {Validator, validate} from "./validator";

export class TextInputComponent extends HTMLElement {
    static formAssociated = true;
    public attachInternals: () => IElementInternals;
    private internals: IElementInternals;
    public $validator: Validator;
    private $attr = {};

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        const template = document.createElement('template');
        template.innerHTML = `
        <style>
        :host {
            display: block;
            font-family: var(--font-default);
            font-size: var(--font-body-sm);
        }
        input {
            height: var(--input-min-dimension);
            width: 100%;
            border-radius: var(--radius-sm);
            border: var(--border-default);
            font-size: var(--font-body-md);
            padding-left: var(--padding-sm);
            outline: none;
            box-sizing: border-box;
        }
        input:focus,
        input:focus:hover,
        input:active {
            border: var(--border-focus);
        }
        input.error,
        input.error:hover,
        input.error:focus,
        input.error:active {
            border: var(--border-error);
            outline: none;
            box-shadow: none;
            color: var(--color-error);
        }
        .message {
            margin-top: var(--margin-xxs);
            color: var(--color-error);
            font-weight: var(--font-weight-default);
        }
        input[disabled] {
            opacity: var(--color-disable);
            background: var(--color-disable);
            border: var(--border-disable);
        }
        input[disabled]:hover,
        input[disabled]:focus,
        input[disabled]:active {
            border: var(--border-disable);
            outline: none;
            box-shadow: none;
        }
        </style>
        <div class="control">
            <input type="text" aria-describedby="message">
        </div>
        <div 
            id="message" 
            class="message"
            aria-role="alert"
            aria-live="assertive"
        ></div>
        `;
        shadowRoot.appendChild(template.content.cloneNode(true));
        this.internals = this.attachInternals();
    }

    static get observedAttributes() {
        return [
            "name",
            "type",
            "required",
            "minlength",
            "maxlength",
            "pattern",
            "list",
            "placeholder",
            "readonly",
            "spellcheck",
            "value",
            "disabled"];
    }

    attributeChangedCallback(name, prev, next) {
        this.$attr[name] = next;
        switch(name) {
            case "value":
                this.value = next;
                break;
            case "required":
                this.required = next;
                break;
            case "disabled":
                this.disabled = next;
                break;
            case "type":
                this.$input.setAttribute("type", next);
                break;
            case "minlength":
                this.$input.setAttribute("minlength", next);
                break;
            case "maxlength":
                this.$input.setAttribute("maxlength", next);
                break;
            case "pattern":
                this.$input.setAttribute("pattern", next);
                break;
            case "list":
                this.$input.setAttribute("list", next);
                break;
            case "placeholder":
                this.$input.setAttribute("placeholder", next);
                break;
            case "readonly":
                this.$input.setAttribute("readonly", next);
                break;
            case "spellcheck":
                this.$input.setAttribute("spellcheck", next);
                break;
        }
    }

    connectedCallback() {
        this.$input.onchange = () => {
            this.onChange();
        };
        this.$input.onblur = () => {
            this.onValidate(true);
        };
        this.$input.onkeyup = () => {
            this.onChange();
        };
        for (let prop in this.$attr) {
            this.$input.setAttribute(prop, this.$attr[prop]);
        }
        this.onValidate(false);
    }

    onChange() {
        this.shadowRoot.querySelector(".message").innerHTML = "";
        this.$input.classList.remove("error");
        this.$input.removeAttribute("aria-invalid");
        this.internals.setFormValue(this.value, this.value);
    }

    formStateRestoreCallback(state: string, mode: string) {
        this.value = state;
    }

    formResetCallback(state: string) {
        this.value = this.getAttribute("value") || "";
    }

    onValidate(showError: boolean) {
        validate(this, showError);
    }

    checkValidity() {
        return this.internals.checkValidity();
    }

    reportValidity() {
        return this.internals.reportValidity();
    }

    get validity() {
        return this.internals.validity;
    }

    get validationMessage() {
        return this.internals.validationMessage;
    }

    setValidity(flags: ValidityStateFlags,
                message?: string,
                anchor?: HTMLElement) {
        this.internals.setValidity(flags, message, anchor);
    }

    get $input(): HTMLInputElement {
        return this.shadowRoot.querySelector("input");
    }

    set value(value: string) {
        this.$input.value = value;
    }

    get value() {
        return this.$input.value;
    }

    get required() : boolean {
        return this.$input.required;
    }

    set required(value: boolean | string) {
        if (value === "true" || value === true) {
            this.$input.setAttribute("required", "true");
        }
        if (value === "false" || value === false) {
            this.$input.removeAttribute("required");
        }
    }

    formDisabledCallback(disabled) {
        this.disabled = disabled;
    }

    set disabled(value: boolean | string) {
        if (value === "true" || value === true) {
            this.$input.setAttribute("disabled", "true");
        }
        if (value === "false" || value === false) {
            this.$input.removeAttribute("disabled");
        }
    }

    get disabled() {
        return this.$input.disabled;
    }

    get type() {
        return this.$input.type ?? "text";
    }

    set type(type: string) {
        this.$input.setAttribute("type", type);
    }

    get list() {
        return this.$input.list;
    }

    get minLength() {
        return this.$input.minLength;
    }

    set minLength(min: number) {
        this.$input.minLength = min;
    }

    get maxLength() {
        return this.$input.maxLength;
    }

    set maxLength(max: number) {
        this.$input.maxLength = max;
    }

    get readOnly() {
        return this.$input.readOnly;
    }

    get pattern() {
        return this.$input.pattern;
    }

    set pattern(pattern: string) {
        this.$input.pattern = pattern;
    }

    get placeholder() {
        return this.$input.placeholder;
    }

    get spellcheck() {
        return this.$input.spellcheck;
    }

    focus() {
        this.$input.focus();
    }

    blur() {
        this.$input.blur();
    }
}

customElements.define('in-textinput', TextInputComponent);
