import {EN} from './en.js';

export const NL = {
    ...EN, // fallback

    TOAST_CONNECTING: 'Verbinden...',
    TOAST_CONNECTED: 'Verbonden!',
    TOAST_LOST_CONNECTION: 'Verbinding met server verbroken',
    TOAST_LOST_CONNECTION_BODY: 'Herverbinden in een paar seconden...',
    TOAST_SERVER_NOT_RESPONDING: 'Server reageert niet',
    TOAST_SERVER_NOT_RESPONDING_BODY: 'De server heeft een tijdje niet gereageerd. Herverbinden...',
    TOAST_DISCONNECTED_BY_SERVER: 'Verbinding verbroken by server',
    TOAST_RECEIVED_NEW_ORDERS: 'Nieuwe orders zijn aangekondigd, laden...',
    TOAST_UPDATE_DETECTED: 'Userscript update gedetecteerd! Pagina herladen om toe te passen...'
};
