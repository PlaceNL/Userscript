import {getCanvasURLS, getPlaceCooldown, placePixel} from './util/placeUtil.js';
import {loadURLToCanvas} from './util/canvasUtil.js';
import {getIncorrectPixels} from './util/orderUtil.js';
import {infoNotification, setHUDBody} from './notifications.js';
import {lang} from './lang/language.js';

const PALETTE = ['#6D001A', '#BE0039', '#FF4500', '#FFA800', '#FFD635', '#FFF8B8', '#00A368', '#00CC78', '#7EED56', '#00756F', '#009EAA', '#00CCC0', '#2450A4', '#3690EA', '#51E9F4', '#493AC1', '#6A5CFF', '#94B3FF', '#811E9F', '#B44AC0', '#E4ABFF', '#DE107F', '#FF3881', '#FF99AA', '#6D482F', '#9C6926', '#FFB470', '#000000', '#515252', '#898D90', '#D4D7D9', '#FFFFFF'];

export class CanvasPlacer {

    mayPlace = false;
    cooldownEndsAt = undefined;
    placing = false;
    placingSince = 0;

    startTimer(client) {
        setInterval(async () => {
            if (this.placing && Date.now() - this.placingSince > 30_000) {
                this.placing = false;
            }

            if (!this.mayPlace || this.placing) return;
            if (!this.cooldownEndsAt) {
                if (this.cooldownEndsAt === undefined) {
                    this.cooldownEndsAt = null;
                    this.cooldownEndsAt = await getPlaceCooldown(client);
                    if (this.cooldownEndsAt) {
                        infoNotification(lang().TOAST_PLACE_PIXELS_IN.replace('{time}', new Date(this.cooldownEndsAt).toLocaleTimeString()), null, Math.max(this.cooldownEndsAt - Date.now(), 1000));
                    }
                }
                return;
            }

            let secondsRemaining = Math.floor((this.cooldownEndsAt - Date.now()) / 1000);
            let minutesRemaining = Math.floor(secondsRemaining / 60);
            secondsRemaining = secondsRemaining % 60;

            setHUDBody(lang().HUD_NEXT_PIXEL_IN.replace('{time}', `${String(minutesRemaining).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')}`));
            if (this.cooldownEndsAt > Date.now()) return;

            this.placing = true;
            this.placingSince = Date.now();
            client.ws.enableCapability('placeNow');
            infoNotification(lang().TOAST_PLACING_PIXEL);
            setHUDBody('');
            try {
                const canvases = await getCanvasURLS(client, [1, 2, 4, 5]);
                client.placeReference.clearRect(0, 0, client.placeReference.canvas.width, client.placeReference.canvas.height);

                // todo: shove in array
                await Promise.all([
                    loadURLToCanvas(client.placeReference, canvases[0], 1000, 0),
                    loadURLToCanvas(client.placeReference, canvases[1], 2000, 0),
                    loadURLToCanvas(client.placeReference, canvases[2], 1000, 1000),
                    loadURLToCanvas(client.placeReference, canvases[3], 2000, 1000)
                ]);

                const wrongPixels = getIncorrectPixels(client);
                if (wrongPixels.length !== 0) {
                    while (wrongPixels.length !== 0) {
                        let pixel = wrongPixels.shift();
                        const hex = rgbToHex(pixel[2]);
                        const pi = PALETTE.indexOf(hex.toUpperCase());
                        if (pi === -1) continue;

                        let canvasX = pixel[0];
                        let canvasY = pixel[1];
                        let canvas = 0;
                        if (canvasY < 1000) {
                            if (canvasX < 1000) canvas = 0;
                            else if (canvasX >= 2000) canvas = 2;
                            else canvas = 1;
                        } else {
                            if (canvasX < 1000) canvas = 3;
                            else if (canvasX >= 2000) canvas = 5;
                            else canvas = 4;
                        }
                        let displayX = canvasX - 1500;
                        let displayY = canvasY - 1000;
                        canvasX %= 1000;
                        canvasY %= 1000;
                        infoNotification(lang().TOAST_PLACING_PIXEL_AT.replace('{x}', displayX).replace('{y}', displayY));

                        let delay = await placePixel(client, canvasX, canvasY, pi, canvas);
                        if (typeof delay === 'number') {
                            this.cooldownEndsAt = delay;
                            let timeout = Math.max(this.cooldownEndsAt - Date.now(), 1000);
                            infoNotification(lang().TOAST_PLACED_PIXEL_AT.replace('{x}', displayX).replace('{y}', displayY), null, timeout);
                            infoNotification(lang().TOAST_PLACE_PIXELS_IN.replace('{time}', new Date(this.cooldownEndsAt).toLocaleTimeString()), null, timeout);
                        }

                        break;
                    }
                } else {
                    infoNotification(lang().TOAST_ALL_PIXELS_RIGHT, lang().TOAST_ALL_PIXELS_RIGHT_BODY, 30_000);
                    this.cooldownEndsAt = Date.now() + 30_000;
                }
            } finally {
                this.placing = false;
                client.ws.disableCapability('placeNow');
            }
        }, 1000);
    }

}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex([r, g, b]) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
