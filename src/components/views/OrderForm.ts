import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { IOrder, FormErrors } from '../../types';

export class OrderForm extends Component<IOrder> {
    protected _form: HTMLFormElement;
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._form = container.querySelector('.form');
        this._emailInput = container.querySelector('input[name="email"]');
        this._phoneInput = container.querySelector('input[name="phone"]');
        this._submitButton = container.querySelector('.form__button');
        this._errors = container.querySelector('.form__errors');

        if (this._form) {
            this._form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.events.emit('order:submit');
            });
        }

        if (this._emailInput) {
            this._emailInput.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                this.events.emit('order:change', {
                    field: 'email',
                    value: target.value
                });
            });
        }

        if (this._phoneInput) {
            this._phoneInput.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                this.events.emit('order:change', {
                    field: 'phone',
                    value: target.value
                });
            });
        }
    }

    set email(value: string) {
        if (this._emailInput) {
            this._emailInput.value = value;
        }
    }

    set phone(value: string) {
        if (this._phoneInput) {
            this._phoneInput.value = value;
        }
    }

    set valid(isValid: boolean) {
        this.setDisabled(this._submitButton, !isValid);
    }

    set errors(errors: FormErrors) {
        const errorTexts = Object.values(errors).filter(Boolean);
        if (errorTexts.length) {
            this.setText(this._errors, errorTexts.join('; '));
            this.setVisible(this._errors);
        } else {
            this.setHidden(this._errors);
        }
    }

    clear() {
        if (this._emailInput) this._emailInput.value = '';
        if (this._phoneInput) this._phoneInput.value = '';
        this.setHidden(this._errors);
    }

    render(data: Partial<IOrder & { valid?: boolean; errors?: FormErrors }>): HTMLElement {
        const { email, phone, valid, errors } = data;
        
        if (email !== undefined) this.email = email;
        if (phone !== undefined) this.phone = phone;
        if (valid !== undefined) this.valid = valid;
        if (errors) this.errors = errors;

        return this.container;
    }
}