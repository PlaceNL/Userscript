import {SocketClient} from './ws/SocketClient.js';
import {createToastifyStyle, hookIntoAutoUpdater, warningNotification} from './notifications.js';
import {CanvasPlacer} from './CanvasPlacer.js';
import {getAccessToken} from './util/session.js';
import {lang} from './lang/language.js';

const client = {
    ws: new SocketClient(),
    orderReference: createCanvas('placenl-userscript-order-reference'),
    orderPriority: createCanvas('placenl-userscript-order-priority'),
    placeReference: createCanvas('placenl-userscript-place-reference'),
    orderOffset: {x: 0, y: 0},
    canvasPlacer: new CanvasPlacer()
};

createToastifyStyle();
hookIntoAutoUpdater();
client.ws.connect(client);
(async function() {
    if (!await getAccessToken(client, false)) {
        warningNotification(lang().TOAST_SIGN_IN_REQUIRED, null, 100_000_000);
        return;
    }

    client.ws.enableCapability('place');
    client.canvasPlacer.startTimer(client);
})();
(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).PLACENL_USERSCRIPT_CLIENT = client;

function createCanvas(id) {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'none';
    canvas.id = id;
    document.body.appendChild(canvas);

    return ctx;
}
