import {infoNotification} from '../../notifications.js';
import {lang} from '../../lang/language.js';
import {loadURLToCanvas} from '../../util/canvasUtil.js';

export async function handleOrder(client, payload) {
    infoNotification(lang().TOAST_RECEIVED_NEW_ORDERS);

    client.orderReference.clearRect(0, 0, client.orderReference.canvas.width, client.orderReference.canvas.height);
    client.orderPriority.clearRect(0, 0, client.orderPriority.canvas.width, client.orderPriority.canvas.height);

    let x = 1500 + payload.offset.x;
    let y = 1000 + payload.offset.y;

    await Promise.all([
        loadURLToCanvas(client.orderReference, payload.images.order, x, y),
        payload.images.priority ? loadURLToCanvas(client.orderPriority, payload.images.priority, x, y) : Promise.resolve() // an empty promise - a lie
    ]);
}
