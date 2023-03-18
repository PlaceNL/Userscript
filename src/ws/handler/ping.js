export function handlePing(client) {
    client.lastPing = new Date();
    client.sendPayload('pong');
}
