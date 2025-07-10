import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _counter: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = container.querySelector('.basket__list');
        this._total = container.querySelector('.basket__price');
        this._button = container.querySelector('.basket__button');
        this._counter = container.querySelector('.basket__counter');

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('basket:order');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren();
            this.setText(this._list, 'Корзина пуста');
        }
    }

    set selected(items: string[]) {
        this.setDisabled(this._button, items.length === 0);
    }

    set total(total: number) {
        this.setText(this._total, `${total} ₽`);
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    render(data: Partial<IBasketView>): HTMLElement {
        const { items, total, selected } = data;
        
        if (items) this.items = items;
        if (total !== undefined) this.total = total;
        if (selected) this.selected = selected;

        return this.container;
    }
}