const EXPIRY_MARGIN = 15_000; // Prevent the token expiring while making the request

export async function getAccessToken(client, allowAnonymous = false) {
    if (client.session) {
        if (client.session.expires.getTime() - EXPIRY_MARGIN < Date.now()) {
            return client.session.token;
        }
    }

    const response = await fetch('/r/place');
    const body = await response.text();

    // todo: yuck
    const configRaw = body.split('<script id="data">window.___r = ')[1].split(';</script>')[0];
    const config = JSON.parse(configRaw);

    if (config.user.session.unsafeLoggedOut) {
        if (allowAnonymous) {
            return config.user.session.accessToken;
        }
        return null;
    }

    client.session = {
        expires: new Date(config.user.session.expires),
        token: config.user.session.accessToken
    };

    return client.session.token;
}
