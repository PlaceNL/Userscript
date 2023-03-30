export function handlePing(client) {
    client.ws.lastPing = new Date();
    client.ws.sendPayload('pong');
}
