import Toastify from 'toastify-js';
import css from 'toastify-js/src/toastify.css';
import {USERSCRIPT_REVISION} from './constants.js';
import {lang} from './lang/language.js';

export const HUDToast = Toastify({
    text: 'PlaceNL Userscript',
    duration: -1,
    close: false,
    gravity: 'bottom',
    position: 'right',
    style: {
        background: '#e17000',
        opacity: 0.75,
        color: 'white',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderImage: 'linear-gradient(180deg, red 33.3%, white 33.3%, white 66.6%, mediumblue 66.6%) 1 1',
        zIndex: 100000,
        transition: 'none'
    }
}).showToast();
HUDToast.title = HUDToast.body = '';

export function setHUDTitle(title) {
    HUDToast.title = title;
    reshowHUD();
}

export function setHUDBody(body) {
    HUDToast.body = body;
    reshowHUD();
}

function reshowHUD() {
    HUDToast.options.text = `PlaceNL Userscript (version ${USERSCRIPT_REVISION.slice(0, 7)}${window.PLACENL_USERSCRIPT_AUTO_UPDATER ? '-auto' : ''}) | ${HUDToast.title}\n${HUDToast.body}`;
    HUDToast.hideToast();
    HUDToast.toastElement.parentNode.removeChild(HUDToast.toastElement);
    HUDToast.showToast();
}

export function infoNotification(title, body = undefined) {
    Toastify({
        text: (body ? (title + '\n' + body) : title),
        duration: 5000,
        close: false,
        gravity: 'top',
        position: 'right',
        stopOnFocus: true,
        style: {
            background: '#001F3F',
            border: '2.5px solid #0074D9',
            zIndex: 1000
        }
    }).showToast();
}

export function warningNotification(title, body = undefined) {
    Toastify({
        text: (body ? (title + '\n' + body) : title),
        duration: 10000,
        close: false,
        gravity: 'top',
        position: 'right',
        stopOnFocus: true,
        style: {
            background: '#FF851B',
            border: '2.5px solid #FFDC00',
            zIndex: 1000
        }
    }).showToast();
}

export function createToastifyStyle() {
    const style = document.createElement('style');
    style.innerText = css;
    document.body.appendChild(style);
}

export function hookIntoAutoUpdater() {
    if (!window.PLACENL_USERSCRIPT_AUTO_UPDATER) return;

    window.PLACENL_USERSCRIPT_AUTO_UPDATER.updateHook = () => {
        infoNotification(lang().TOAST_UPDATE_DETECTED);
    };
}
