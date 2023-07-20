export function loadURLToCanvas(ctx, url, x = 0, y = 0) {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(url);
        const urlCreator = window.URL || window.webkitURL;
        const base64URL = urlCreator.createObjectURL(await response.blob());
        const image = new Image();

        image.onload = () => {
            ctx.drawImage(image, x, y);
            resolve();
        };
        image.onerror = (e) => {
            reject(e);
        };

        image.src = base64URL;
    });
}
