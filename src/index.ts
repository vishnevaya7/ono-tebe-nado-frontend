import './scss/styles.scss';

// Отладка переменных окружения
console.log('🔍 API_ORIGIN:', process.env.API_ORIGIN);
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

import { AuctionAPI } from "./components/AuctionAPI";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { Modal } from "./components/common/Modal";

// Импорт моделей
import { CatalogModel } from "./components/models/CatalogModel";
import { BasketModel } from "./components/models/BasketModel";
import { OrderModel } from "./components/models/OrderModel";

// Импорт компонентов
import { Page, LotCard, LotDetails, Basket, OrderForm } from "./components/views";
import { ILot } from "./types";

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = document.querySelector('#card') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;

// Модели данных приложения
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(document.querySelector('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(basketTemplate.content.querySelector('.basket').cloneNode(true) as HTMLElement, events);
const order = new OrderForm(orderTemplate.content.querySelector('.form').cloneNode(true) as HTMLElement, events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменился каталог
events.on('catalog:items-changed', () => {
    page.catalog = catalogModel.itemsList.map(item => {
        const card = new LotCard(cardCatalogTemplate.content.querySelector('.card').cloneNode(true) as HTMLElement, events);
        return card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            price: item.price,
            status: item.status
        });
    });
});

// Выбрали лот для просмотра
events.on('lot:select', (data: { lot: LotCard }) => {
    const lotId = data.lot.id;
    const lot = catalogModel.getLotById(lotId);
    if (lot) {
        catalogModel.selectLot(lot);
    }
});

// Показать детали лота
events.on('catalog:lot-selected', () => {
    const lot = catalogModel.currentLot;
    if (lot) {
        const lotDetails = new LotDetails(cardPreviewTemplate.content.querySelector('.card').cloneNode(true) as HTMLElement, events);
        modal.render({
            content: lotDetails.render({
                ...lot,
                inBasket: basketModel.hasItem(lot.id)
            })
        });
    }
});

// Добавить лот в корзину
events.on('lot:add-to-basket', (data: { id: string }) => {
    basketModel.addItem(data.id);
    modal.close();
});

// Изменилась корзина
events.on('basket:item-added', () => {
    page.counter = basketModel.count;
});

events.on('basket:item-removed', () => {
    page.counter = basketModel.count;
});

// Открыть корзину
events.on('basket:open', () => {
    const basketItems = basketModel.itemsList.map(id => {
        const lot = catalogModel.getLotById(id);
        if (lot) {
            const card = new LotCard(cardCatalogTemplate.content.querySelector('.card').cloneNode(true) as HTMLElement, events);
            return card.render({
                id: lot.id,
                title: lot.title,
                price: lot.price
            });
        }
    }).filter(Boolean);

    modal.render({
        content: basket.render({
            items: basketItems,
            total: basketModel.totalAmount,
            selected: basketModel.itemsList
        })
    });
});

// Оформить заказ
events.on('basket:order', () => {
    orderModel.setItems(basketModel.itemsList);
    modal.render({
        content: order.render({
            email: orderModel.userEmail,
            phone: orderModel.userPhone,
            valid: orderModel.isValid
        })
    });
});

// Изменение полей заказа
events.on('order:change', (data: { field: string, value: string }) => {
    if (data.field === 'email') {
        orderModel.setEmail(data.value);
    } else if (data.field === 'phone') {
        orderModel.setPhone(data.value);
    }
});

// Валидация заказа
events.on('order:email-changed', () => {
    const errors = orderModel.validate();
    order.render({ valid: orderModel.isValid, errors });
});

events.on('order:phone-changed', () => {
    const errors = orderModel.validate();
    order.render({ valid: orderModel.isValid, errors });
});

// Отправка заказа
events.on('order:submit', () => {
    if (orderModel.isValid) {
        api.orderLots(orderModel.getOrderData())
            .then(() => {
                basketModel.clear();
                orderModel.clear();
                modal.close();
                page.counter = 0;
            })
            .catch(err => {
                console.error('Ошибка заказа:', err);
            });
    }
});

// Закрытие модального окна
events.on('modal:close', () => {
    modal.close();
});

// Получаем лоты с сервера
catalogModel.setLoading(true);
api.getLotList()
    .then(result => {
        catalogModel.setItems(result);
    })
    .catch(err => {
        console.error(err);
        catalogModel.setLoading(false);
    });
