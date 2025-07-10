import { Model } from '../base/Model';
import { IEvents } from '../base/events';

interface IBasketData {
	items: string[];
	total: number;
}

export class BasketModel extends Model<IBasketData> {
	items: string[];
	total: number;

	constructor(events: IEvents) {
		super({ items: [], total: 0 }, events);
	}

	get itemsList(): string[] {
		return this.items;
	}

	get count(): number {
		return this.items.length;
	}

	get totalAmount(): number {
		return this.total;
	}

	get isEmpty(): boolean {
		return this.items.length === 0;
	}

	addItem(lotId: string): void {
		if (!this.items.includes(lotId)) {
			this.items.push(lotId);
			this.emitChanges('basket:item-added', { lotId, items: this.items });
		}
	}

	removeItem(lotId: string): void {
		const index = this.items.indexOf(lotId);
		if (index !== -1) {
			this.items.splice(index, 1);
			this.emitChanges('basket:item-removed', { lotId, items: this.items });
		}
	}

	hasItem(id: string): boolean {
		return this.items.includes(id);
	}

	setTotal(total: number): void {
		this.total = total;
		this.emitChanges('basket:total-changed', { total });
	}

	clear(): void {
		this.items = [];
		this.total = 0;
		this.emitChanges('basket:cleared');
	}

	setItems(items: string[]): void {
		this.items = items;
		this.emitChanges('basket:items-changed', { items });
	}
}