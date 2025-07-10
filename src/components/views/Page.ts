import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = container.querySelector('.header__basket-counter');
        this._catalog = container.querySelector('.catalog__items');
        this._wrapper = container.querySelector('.page__wrapper');
        this._basket = container.querySelector('.header__basket');

        if (this._basket) {
            this._basket.addEventListener('click', () => {
                this.events.emit('basket:open');
            });
        }
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }

    render(data: Partial<IPage>): HTMLElement {
        const { counter, catalog, locked } = data;
        
        if (counter !== undefined) this.counter = counter;
        if (catalog) this.catalog = catalog;
        if (locked !== undefined) this.locked = locked;

        return this.container;
    }
}