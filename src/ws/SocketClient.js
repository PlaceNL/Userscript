import {CHIEF_WS_ENDPOINT} from '../constants.js';
import {handlePing} from './handler/ping.js';
import {handleHello} from './handler/hello.js';
import {infoNotification, setHUDTitle, warningNotification} from '../notifications.js';
import {lang} from '../lang/language.js';

export class SocketClient {
    ws;
    id;
    lastPing;
    connectionTimeoutChecker;
    keepaliveTimeout;
    keepaliveCheckerInterval;

    connect() {
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

        this.ws.onclose = (e) => {
            warningNotification(lang().TOAST_LOST_CONNECTION, lang().TOAST_LOST_CONNECTION_BODY);
            clearInterval(this.keepaliveCheckerInterval);

            setTimeout(() => {
                this.connect();
            }, 2500);
        };

        this.ws.onerror = (e) => {
            this.ws.close();
        };

        this.ws.onmessage = (msg) => {
            const message = JSON.parse(msg.data);
            console.log(message)
            const {type, payload} = message;

            switch (type) {
                case 'hello':
                    handleHello(this, payload);
                    break;

                case 'ping':
                    handlePing(this);
                    break;

                case 'brandUpdated':
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
}
