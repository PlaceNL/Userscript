import {getAccessToken} from './session.js';

export async function placePixel(client, x, y, color, canvasIndex) {
    const accessToken = await getAccessToken(client);

    if (!accessToken) {
        return [false];
    }

    const resp = await fetch('https://gql-realtime-2.reddit.com/query', {
        credentials: 'omit',
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${accessToken}`,
            'apollographql-client-name': 'garlic-bread',
            'apollographql-client-version': '0.0.1',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site'
        },
        referrer: 'https://garlic-bread.reddit.com/',
        body: JSON.stringify(
            {
                'operationName': 'setPixel',
                'variables': {
                    'input': {
                        'actionName': 'r/replace:set_pixel',
                        'PixelMessageData': {
                            'coordinate': {x, y},
                            'colorIndex': color,
                            'canvasIndex': canvasIndex
                        }
                    }
                },
                'query': 'mutation setPixel($input: ActInput!) {\n  act(input: $input) {\n    data {\n      ... on BasicMessage {\n        id\n        data {\n          ... on GetUserCooldownResponseMessageData {\n            nextAvailablePixelTimestamp\n            __typename\n          }\n          ... on SetPixelResponseMessageData {\n            timestamp\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n'
            }
        ),
        method: 'POST',
        mode: 'cors'
    });
    const data = await resp.json();

    if (!data.data) {
        let nextTs = data.errors?.find((e) => e.extensions?.nextAvailablePixelTs)?.extensions.nextAvailablePixelTs;

        return [false, nextTs];
    }

    return [true, data.data.act.data.find((e) => e.data.__typename === 'GetUserCooldownResponseMessageData').data.nextAvailablePixelTimestamp];
}

export function getCanvasURLS(client, canvases) {
    return new Promise(async (resolve, reject) => {
        const accessToken = await getAccessToken(client, true);
        const ws = new WebSocket('wss://gql-realtime-2.reddit.com/query');

        function getCanvas(id) {
            ws.send(JSON.stringify({
                id: '2',
                type: 'start',
                payload: {
                    variables: {
                        input: {
                            channel: {
                                teamOwner: 'GARLICBREAD',
                                category: 'CANVAS',
                                tag: String(id)
                            }
                        }
                    },
                    extension: {},
                    operationName: 'replace',
                    query: 'subscription replace($input: SubscribeInput!) {    subscribe(input: $input) {        id        ... on BasicMessage {            data {                __typename                ... on FullFrameMessageData {                    __typename                    name                    timestamp                }            }            __typename        }        __typename    }}'
                }
            }));
        }

        ws.addEventListener('open', () => {
            ws.send(JSON.stringify({
                type: 'connection_init',
                payload: {
                    Authorization: `Bearer ${accessToken}`
                }
            }));
            getCanvas(canvases.shift());
        });

        let urls = [];
        ws.addEventListener('message', (message) => {
            const data = message.data;
            const {payload} = JSON.parse(data);
            if (!payload?.data?.subscribe?.data) return;

            const {__typename, name} = payload.data.subscribe.data;
            if (__typename !== 'FullFrameMessageData') return;

            urls.push(getProxiedURL(name));
            if (canvases.length !== 0) {
                getCanvas(canvases.shift());
                return;
            }
            ws.close();
            resolve(urls);
        });

        ws.addEventListener('error', (e) => reject(e));
    });
}

function getProxiedURL(garlicURL) {
    const url = new URL(garlicURL);
    return `https://garlic-proxy.placenl.nl/${url.pathname.replace(/^\/media\//, '')}?bust=${Date.now()}`;
}

export async function getPlaceCooldown(client) {
    const accessToken = await getAccessToken(client);

    if (!accessToken) {
        return undefined;
    }

    const resp = await fetch('https://gql-realtime-2.reddit.com/query', {
        credentials: 'omit',
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${accessToken}`,
            'apollographql-client-name': 'garlic-bread',
            'apollographql-client-version': '0.0.1',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site'
        },
        referrer: 'https://garlic-bread.reddit.com/',
        body: JSON.stringify(
            {
                query: 'mutation GetPersonalizedTimer{\n  act(\n    input: {actionName: "r/replace:get_user_cooldown"}\n  ) {\n    data {\n      ... on BasicMessage {\n        id\n        data {\n          ... on GetUserCooldownResponseMessageData {\n            nextAvailablePixelTimestamp\n          }\n        }\n      }\n    }\n  }\n}\n\n\nsubscription SUBSCRIBE_TO_CONFIG_UPDATE {\n  subscribe(input: {channel: {teamOwner: GARLICBREAD, category: CONFIG}}) {\n    id\n    ... on BasicMessage {\n      data {\n        ... on ConfigurationMessageData {\n          __typename\n          colorPalette {\n            colors {\n              hex\n              index\n            }\n          }\n          canvasConfigurations {\n            dx\n            dy\n            index\n          }\n          canvasWidth\n          canvasHeight\n        }\n      }\n    }\n  }\n}\n\n\nsubscription SUBSCRIBE_TO_CANVAS_UPDATE {\n  subscribe(\n    input: {channel: {teamOwner: GARLICBREAD, category: CANVAS, tag: "0"}}\n  ) {\n    id\n    ... on BasicMessage {\n      id\n      data {\n        __typename\n        ... on DiffFrameMessageData {\n          currentTimestamp\n          previousTimestamp\n          name\n        }\n        ... on FullFrameMessageData {\n          __typename\n          name\n          timestamp\n        }\n      }\n    }\n  }\n}\n\n\n\n\nmutation SET_PIXEL {\n  act(\n    input: {actionName: "r/replace:set_pixel", PixelMessageData: {coordinate: { x: 53, y: 35}, colorIndex: 3, canvasIndex: 0}}\n  ) {\n    data {\n      ... on BasicMessage {\n        id\n        data {\n          ... on SetPixelResponseMessageData {\n            timestamp\n          }\n        }\n      }\n    }\n  }\n}\n\n\n\n\n# subscription configuration($input: SubscribeInput!) {\n#     subscribe(input: $input) {\n#       id\n#       ... on BasicMessage {\n#         data {\n#           __typename\n#           ... on RReplaceConfigurationMessageData {\n#             colorPalette {\n#               colors {\n#                 hex\n#                 index\n#               }\n#             }\n#             canvasConfigurations {\n#               index\n#               dx\n#               dy\n#             }\n#             canvasWidth\n#             canvasHeight\n#           }\n#         }\n#       }\n#     }\n#   }\n\n# subscription replace($input: SubscribeInput!) {\n#   subscribe(input: $input) {\n#     id\n#     ... on BasicMessage {\n#       data {\n#         __typename\n#         ... on RReplaceFullFrameMessageData {\n#           name\n#           timestamp\n#         }\n#         ... on RReplaceDiffFrameMessageData {\n#           name\n#           currentTimestamp\n#           previousTimestamp\n#         }\n#       }\n#     }\n#   }\n# }\n',
                variables: {
                    input: {
                        channel: {
                            teamOwner: 'GARLICBREAD',
                            category: 'R_REPLACE',
                            tag: 'canvas:0:frames'
                        }
                    }
                },
                operationName: 'GetPersonalizedTimer',
                id: null
            }
        ),
        method: 'POST',
        mode: 'cors'
    });
    const data = await resp.json();

    if (!data.data) {
        return undefined;
    }

    let ts = data.data.act.data[0].data.nextAvailablePixelTimestamp;

    return !ts ? 1 : ts;
}
