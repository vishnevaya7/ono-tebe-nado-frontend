import { Component } from '../base/Component';
import { ILot } from '../../types';
import { IEvents } from '../base/events';



export class LotCard extends Component<ILot> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _status: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._title = container.querySelector('.card__title');
		this._image = container.querySelector('.card__image');
		this._price = container.querySelector('.card__price');
		this._status = container.querySelector('.card__status');
		this._button = container.querySelector('.card__button');

		if (this._button) {
			this._button.addEventListener('click', (event) => {
				this.events.emit('lot:select', { lot: this });
			});
		}
	}

	set id(value: string) {
		this.container.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number) {
		this.setText(this._price, `${value} ₽`);
	}

	set status(value: string) {
		this.setText(this._status, value);

		// Управление состоянием кнопки в зависимости от статуса
		if (this._button) {
			const isActive = value === 'active';
			this.setDisabled(this._button, !isActive);
			this._button.textContent = isActive ? 'В корзину' : 'Недоступен';
		}
	}

	set selected(value: boolean) {
		this.toggleClass(this.container, 'card_selected', value);
	}

	render(data: Partial<ILot>): HTMLElement {
		const { id, title, image, price, status } = data;

		if (id) this.id = id;
		if (title) this.title = title;
		if (image) this.image = image;
		if (price) this.price = price;
		if (status) this.status = status;

		return this.container;
	}

}