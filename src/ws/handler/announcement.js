import Toastify from 'toastify-js';

const IMPORTANT_DURATION = 300_000;

export function handleAnnouncement(payload) {
    Toastify({
        message: payload.message,
        duration: payload.showFor ?? (payload.important ? IMPORTANT_DURATION : 60000),
        style: payload.style ?? undefined
    }).showToast();

    if (payload.important) {
        const originalTitle = document.title;
        document.title = `(!!!) ${originalTitle} (!!!)`;
        setTimeout(() => document.title = originalTitle, payload.showFor ?? IMPORTANT_DURATION);
    }
}
