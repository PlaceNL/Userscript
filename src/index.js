import {SocketClient} from './ws/SocketClient.js';
import {createToastifyStyle, hookIntoAutoUpdater} from './notifications.js';

const client = {
    ws: new SocketClient(),
    orderReference: createCanvas('placenl-userscript-order-reference'),
    orderPriority: createCanvas('placenl-userscript-order-priority'),
    placeReference: createCanvas('placenl-userscript-place-reference')
};

createToastifyStyle();
hookIntoAutoUpdater();
client.ws.connect(client);
window.PLACENL_USERSCRIPT_CLIENT = client;

function createCanvas(id) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'none';
    canvas.id = id;
    document.body.appendChild(canvas);

    return ctx;
}
