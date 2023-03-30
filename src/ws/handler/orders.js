import {infoNotification} from '../../notifications.js';
import {lang} from '../../lang/language.js';

export async function handleOrder(client, payload) {
    infoNotification(lang().TOAST_RECEIVED_NEW_ORDERS);

    if (!payload.images.priority) {
        // clear priority canvas if we don't have it
        client.orderPriority.clearRect(0, 0, client.orderPriority.canvas.width, client.orderPriority.canvas.height);
    }

    // Rescale if necessary
    client.orderReference.canvas.width = client.orderPriority.canvas.width = payload.size.width;
    client.orderReference.canvas.height = client.orderPriority.canvas.height = payload.size.height;

    await Promise.all([
        loadURLToCanvas(client.orderReference, payload.images.order),
        payload.images.priority ? loadURLToCanvas(client.orderPriority, payload.images.priority) : Promise.resolve() // an empty promise - a lie
    ]);
}

function loadURLToCanvas(ctx, url) {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(url);
        const urlCreator = window.URL || window.webkitURL;
        const base64URL = urlCreator.createObjectURL(await response.blob());
        const image = new Image();

        image.onload = () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(image, 0, 0);
            resolve();
        };
        image.onerror = (e) => {
            reject(e);
        };

        image.src = base64URL;
    });
}
