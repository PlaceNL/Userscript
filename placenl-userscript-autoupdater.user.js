// ==UserScript==
// @name         PlaceNL Userscript (Autoupdater)
// @namespace    https://github.com/PlaceNL/Userscript
// @version      0.0.2
// @description  The easiest way to run our automated placer and keep it up to date, right from your browser
// @author       PlaceNL
// @match        https://www.reddit.com/r/place/*
// @match        https://new.reddit.com/r/place/*
// @connect      reddit.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @updateURL    https://github.com/PlaceNL/Userscript/releases/download/latest/placenl-userscript-autoupdater.user.js
// @downloadURL  https://github.com/PlaceNL/Userscript/releases/download/latest/placenl-userscript-autoupdater.user.js
// @grant        GM.xmlHttpRequest
// @connect      github.com
// @connect      objects.githubusercontent.com
// ==/UserScript==

const SCRIPT_LOCATION = 'https://github.com/PlaceNL/Userscript/releases/download/latest/placenl-userscript.user.js';
const UPDATE_CHECK_INTERVAL = 10 * 60 * 1000;

(function () {
    (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).PLACENL_USERSCRIPT_AUTO_UPDATER = {
        version: '0.0.1',
        updateHook: () => {
        }
    };

    GM.xmlHttpRequest({
        method: 'GET',
        url: SCRIPT_LOCATION,
        onload: (response) => {
            if (response.status < 200 || response.status > 299) {
                alert('An error occured while loading the script. Please wait a bit and refresh the page.\n\nEr is een fout opgetreden bij het laden van het script. Wacht een ogenblikje en ververs de pagina.');
                return;
            }
            const scriptData = response.responseText;

            try {
                eval(scriptData);
            } catch (e) {
                alert('An error occurred while starting the script. Please wait a bit and refresh the page.\n\nEr is een fout opgetreden bij het starten van het script. Wacht een ogenblikje en ververs de pagina.');
                return;
            }

            setInterval(() => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: SCRIPT_LOCATION,
                    onload: async (response) => {
                        const newScriptData = response.responseText;
                        if (scriptData === newScriptData) return;

                        // Give the userscript some time to display its update message
                        await (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).PLACENL_USERSCRIPT_AUTO_UPDATER.updateHook();
                        setTimeout(() => window.location.reload(), 5000);
                    }
                });
            }, UPDATE_CHECK_INTERVAL);
        }
    });
})();
