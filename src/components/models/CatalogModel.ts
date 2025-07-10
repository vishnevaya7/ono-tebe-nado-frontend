import { ILot } from '../../types';
import { Model } from '../base/Model';
import { IEvents } from '../base/events';

interface ICatalogData  {
	items: ILot[];
	loading: boolean;
	selectedLot?: ILot;
}

export class CatalogModel extends Model<ICatalogData> {
	items: ILot[];
	loading: boolean;
	selectedLot?: ILot;

	constructor(events: IEvents) {
		super({ items: [], loading: false }, events);
	}

	get itemsList(): ILot[] {
		return this.items;
	}

	get isLoading(): boolean {
		return this.loading;
	}

	get currentLot(): ILot | null {
		return this.selectedLot || null;
	}

	getLotById(id: string): ILot | undefined {
		return this.items.find(item => item.id === id);
	}

	setItems(items: ILot[]): void {
		this.items = items;
		this.loading = false;
		this.emitChanges('catalog:items-changed', { items });
	}

	setLoading(loading: boolean): void {
		this.loading = loading;
		this.emitChanges('catalog:loading-changed', { loading });
	}

	selectLot(lot: ILot): void {
		this.selectedLot = lot;
		this.emitChanges('catalog:lot-selected', { lot });
	}

	updateLot(lot: ILot): void {
		const index = this.items.findIndex(item => item.id === lot.id);
		if (index !== -1) {
			this.items[index] = lot;
			this.emitChanges('catalog:lot-updated', { lot });
		}
	}

	get count(): number {
		return this.items.length;
	}

	clear(): void {
		this.items = [];
		this.loading = false;
		this.selectedLot = undefined;
		this.emitChanges('catalog:cleared');
	}

}
