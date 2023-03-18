import {SocketClient} from './ws/SocketClient.js';
import {createToastifyStyle} from './notifications.js';

const client = {
    ws: new SocketClient()
};

createToastifyStyle();
client.ws.connect();
