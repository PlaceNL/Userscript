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
    TOAST_UPDATE_DETECTED: 'Userscript update gedetecteerd! Pagina herladen om toe te passen...',
    TOAST_SIGN_IN_REQUIRED: 'Je moet op reddit inloggen en de pagina herladen!',
    TOAST_PLACE_PIXELS_IN: 'Volgende pixel wordt geplaatst om {time}!',
    TOAST_PLACING_PIXEL: 'Pixel plaatsen...',
    TOAST_ALL_PIXELS_RIGHT: 'Alle pixels kloppen!',
    TOAST_ALL_PIXELS_RIGHT_BODY: 'Opnieuw checken over 30 seconden...',
    TOAST_PLACING_PIXEL_AT: 'Pixel plaatsen op {x}, {y}...',
    TOAST_PLACED_PIXEL_AT: 'Pixel geplaatst op {x}, {y}!',
    HUD_NEXT_PIXEL_IN: 'Volgende pixel over {time}...',
    HUD_PIXELS_CORRECT: `{right}/{total} pixels ({percentage}%) kloppen, {wrong} over`
};
