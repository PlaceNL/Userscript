import {CHIEF_WS_ENDPOINT} from '../constants.js';
import {handlePing} from './handler/ping.js';
import {handleHello} from './handler/hello.js';
import {infoNotification, setHUDTitle, warningNotification} from '../notifications.js';
import {lang} from '../lang/language.js';
import {handleOrder} from './handler/orders.js';
import {handleDisconnect} from './handler/disconnect.js';
import {handleAnnouncement} from './handler/announcement.js';
import {handleStats} from './handler/stats.js';

export class SocketClient {
    ws;
    id;
    lastPing;
    connectionTimeoutChecker;
    keepaliveTimeout;
    keepaliveCheckerInterval;
    connected = false;
    capabilities = ['priorityMappings'];

    connect(client) {
        this.connected = false;
        this.ws = new WebSocket(CHIEF_WS_ENDPOINT);

        this.connectionTimeoutChecker = setTimeout(() => {
            this.ws.close();
        }, 10000); // open connection within 10sec

        infoNotification(lang().TOAST_CONNECTING);
        setHUDTitle(lang().TOAST_CONNECTING);

        this.lastPing = new Date();
        this.ws.onopen = () => {
            infoNotification(lang().TOAST_CONNECTED);
            setHUDTitle(lang().TOAST_CONNECTED);
            clearTimeout(this.connectionTimeoutChecker);

            this.keepaliveCheckerInterval = setInterval(() => {
                if (!this.keepaliveTimeout) return;
                if (Date.now() - this.lastPing.getTime() <= this.keepaliveTimeout) return;

                warningNotification(lang().TOAST_SERVER_NOT_RESPONDING, lang().TOAST_SERVER_NOT_RESPONDING_BODY);
                this.ws.close();
            }, 1000);
        };

        this.ws.onclose = () => {
            client.canvasPlacer.mayPlace = false;
            warningNotification(lang().TOAST_LOST_CONNECTION, lang().TOAST_LOST_CONNECTION_BODY);
            clearInterval(this.keepaliveCheckerInterval);
            this.connected = false;

            setTimeout(() => {
                this.connect(client);
            }, 2500);
        };

        this.ws.onerror = () => {
            this.ws.close();
        };

        this.ws.onmessage = (msg) => {
            const message = JSON.parse(msg.data);
            const {type, payload} = message;

            switch (type) {
                case 'error':
                    console.warn('Got error: ', payload);
                    break;

                case 'announcement':
                    handleAnnouncement(payload);
                    break;

                case 'disconnect':
                    handleDisconnect(payload);
                    break;

                case 'hello':
                    handleHello(client, payload);
                    break;

                case 'order':
                    handleOrder(client, payload);
                    break;

                case 'ping':
                    handlePing(client);
                    break;

                case 'stats':
                    handleStats(client, payload);
                    break;

                case 'brandUpdated':
                case 'enabledCapability':
                case 'disabledCapability':
                case 'subscribed':
                case 'unsubscribed':
                    break;

                default:
                    console.warn(`Unknown payload type '${type}'`);
                    break;
            }
        };
    }

    sendPayload(type, payload) {
        this.ws.send(JSON.stringify({
            type,
            payload
        }));
    }

    subscribe(to) {
        this.sendPayload('subscribe', to);
    }

    unsubscribe(from) {
        this.sendPayload('unsubscribe', from);
    }

    enableCapability(capability) {
        if (!this.capabilities.includes(capability)) this.capabilities.push(capability);
        this.sendPayload('enableCapability', capability);
    }

    disableCapability(capability) {
        if (this.capabilities.includes(capability)) this.capabilities.splice(this.capabilities.indexOf(capability), 1);
        this.sendPayload('disableCapability', capability);
    }
}
