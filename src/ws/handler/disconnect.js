import {warningNotification} from '../../notifications.js';
import {lang} from '../../lang/language.js';

export function handleDisconnect(payload) {
    warningNotification(lang().TOAST_DISCONNECTED_BY_SERVER, payload.message ?? payload.reason);
    console.warn('Disconnected by server!', payload);
}
