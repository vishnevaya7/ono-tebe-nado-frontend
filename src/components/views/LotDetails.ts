import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ILot } from '../../types';

export class LotDetails extends Component<ILot> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _about: HTMLElement;
    protected _price: HTMLElement;
    protected _status: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._title = container.querySelector('.lot__title');
        this._image = container.querySelector('.lot__image');
        this._description = container.querySelector('.lot__description');
        this._about = container.querySelector('.lot__about');
        this._price = container.querySelector('.lot__price');
        this._status = container.querySelector('.lot__status');
        this._button = container.querySelector('.lot__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('lot:add-to-basket', { id: this.container.dataset.id });
            });
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
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

    set description(value: string) {
        this.setText(this._description, value);
    }

    set about(value: string) {
        this.setText(this._about, value);
    }

    set price(value: number) {
        this.setText(this._price, `${value} ₽`);
    }

    set status(value: string) {
        this.setText(this._status, value);
        
        if (this._button) {
            const isActive = value === 'active';
            this.setDisabled(this._button, !isActive);
            this._button.textContent = isActive ? 'В корзину' : 'Недоступен';
        }
    }

    set inBasket(value: boolean) {
        if (this._button) {
            this._button.textContent = value ? 'В корзине' : 'В корзину';
            this.setDisabled(this._button, value);
        }
    }

    render(data: Partial<ILot & { inBasket?: boolean }>): HTMLElement {
        const { id, title, image, description, about, price, status, inBasket } = data;
        
        if (id) this.id = id;
        if (title) this.title = title;
        if (image) this.image = image;
        if (description) this.description = description;
        if (about) this.about = about;
        if (price !== undefined) this.price = price;
        if (status) this.status = status;
        if (inBasket !== undefined) this.inBasket = inBasket;

        return this.container;
    }
}