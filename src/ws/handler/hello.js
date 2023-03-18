import {USERSCRIPT_REVISION} from '../../constants.js';

export function handleHello(client, payload) {
    client.id = payload.id;
    client.keepaliveTimeout = payload.keepaliveTimeout;

    client.subscribe('announcement');

    client.sendPayload('brand', {
        author: 'PlaceNL',
        name: 'Userscript',
        version: USERSCRIPT_REVISION
    });
}
