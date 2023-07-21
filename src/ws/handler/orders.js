import {infoNotification} from '../../notifications.js';
import {lang} from '../../lang/language.js';
import {loadURLToCanvas} from '../../util/canvasUtil.js';

export async function handleOrder(client, payload) {
    infoNotification(lang().TOAST_RECEIVED_NEW_ORDERS);

    client.orderReference.clearRect(0, 0, client.orderReference.canvas.width, client.orderReference.canvas.height);
    client.orderPriority.clearRect(0, 0, client.orderPriority.canvas.width, client.orderPriority.canvas.height);

    await Promise.all([
        loadURLToCanvas(client.orderReference, payload.images.order, 1500 + payload.offset.x, 1000 + payload.offset.y),
        payload.images.priority ? loadURLToCanvas(client.orderPriority, payload.images.priority) : Promise.resolve() // an empty promise - a lie
    ]);
}
