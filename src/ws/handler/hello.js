import {USERSCRIPT_REVISION} from '../../constants.js';

export async function handleHello(client, payload) {
    client.ws.connected = true;
    client.ws.id = payload.id;
    client.ws.keepaliveTimeout = payload.keepaliveTimeout;

    client.ws.subscribe('announcements');
    client.ws.subscribe('orders');
    client.ws.subscribe('stats');

    for (const capability of client.ws.capabilities) {
        client.ws.enableCapability(capability);
    }

    client.ws.sendPayload('brand', {
        author: 'PlaceNL',
        name: 'Userscript',
        version: USERSCRIPT_REVISION + ((typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).PLACENL_USERSCRIPT_AUTO_UPDATER ? '-auto' : '')
    });

    client.ws.sendPayload('getOrder');
    client.canvasPlacer.mayPlace = true;
}
