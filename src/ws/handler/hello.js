import {USERSCRIPT_REVISION} from '../../constants.js';

export function handleHello(client, payload) {
    client.ws.connected = true;
    client.ws.id = payload.id;
    client.ws.keepaliveTimeout = payload.keepaliveTimeout;

    client.ws.subscribe('announcements');
    client.ws.subscribe('orders');

    client.ws.enableCapability('priorityMappings');

    client.ws.sendPayload('brand', {
        author: 'PlaceNL',
        name: 'Userscript',
        version: USERSCRIPT_REVISION + (window.PLACENL_USERSCRIPT_AUTO_UPDATER ? '-auto' : '')
    });

    client.ws.sendPayload('getOrder');
}
