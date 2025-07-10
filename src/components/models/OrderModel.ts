import { Model } from '../base/Model';
import { IEvents } from '../base/events';
import { IOrder, FormErrors } from '../../types';

export class OrderModel extends Model<IOrder> {
	email: string;
	phone: string;
	items: string[];

	constructor(events: IEvents) {
		super({ email: '', phone: '', items: [] }, events);
	}

	get userEmail(): string {
		return this.email;
	}

	get userPhone(): string {
		return this.phone;
	}

	get orderItems(): string[] {
		return this.items;
	}

	get isValid(): boolean {
		return this.email.length > 0 && this.phone.length > 0;
	}

	setEmail(email: string): void {
		this.email = email;
		this.emitChanges('order:email-changed', { email });
	}

	setPhone(phone: string): void {
		this.phone = phone;
		this.emitChanges('order:phone-changed', { phone });
	}

	setItems(items: string[]): void {
		this.items = items;
		this.emitChanges('order:items-changed', { items });
	}

	validate(): FormErrors {
		const errors: FormErrors = {};

		if (!this.email) {
			errors.email = 'Укажите email';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
			errors.email = 'Некорректный email';
		}

		if (!this.phone) {
			errors.phone = 'Укажите телефон';
		} else if (!/^\+?[1-9]\d{1,14}$/.test(this.phone.replace(/\s/g, ''))) {
			errors.phone = 'Некорректный телефон';
		}

		if (this.items.length === 0) {
			errors.items = 'Корзина пуста';
		}

		this.emitChanges('order:validation-changed', { errors, isValid: Object.keys(errors).length === 0 });
		return errors;
	}

	clear(): void {
		this.email = '';
		this.phone = '';
		this.items = [];
		this.emitChanges('order:cleared');
	}

	getOrderData(): IOrder {
		return {
			email: this.email,
			phone: this.phone,
			items: this.items
		};
	}
}