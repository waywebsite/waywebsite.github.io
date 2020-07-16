/*jslint browser: true */
/*global window, $, publicKey, PublicKeyCredential, alert */

function arrayToBase64String(a) {
    'use strict';
    return window.btoa(String.fromCharCode(...a));
}

function base64url2base64(input) {
    'use strict';
    input = input.replace(/\=/g, "").replace(/-/g, "+").replace(/_/g, "/");
    const pad = input.length % 4;
    if (pad) {
        if (pad === 1) {
            throw new Error("InvalidLengthError: Input base64url string is the wrong length to determine padding");
        }
        var x;
        for (x = 1; x < 5 - pad; x += 1) {
            input += '=';
        }
    }
    return input;
}

function webAuthnCreateCredentials() {
    'use strict';
    navigator.credentials.create({publicKey: publicKey})
        .then(function (data) {
            const publicKeyCredential = {
                id: data.id,
                rawId: arrayToBase64String(new Uint8Array(data.rawId)),
                response: {
                    attestationObject: arrayToBase64String(new Uint8Array(data.response.attestationObject)),
                    clientDataJSON: arrayToBase64String(new Uint8Array(data.response.clientDataJSON))
                },
                type: data.type
            };
            alert(JSON.stringify(publicKeyCredential));
        }, function (error) {
            alert(error);
        });
}

$(document).ready(function () {
    'use strict';
    // Load server data
    publicKey.challenge = Uint8Array.from(window.atob(base64url2base64(publicKey.challenge)), function (c) {
        return c.charCodeAt(0);
    });
    publicKey.user.id = Uint8Array.from(window.atob(publicKey.user.id), function (c) {
        return c.charCodeAt(0);
    });
    if (publicKey.excludeCredentials) {
        publicKey.excludeCredentials = publicKey.excludeCredentials.map(function (data) {
            data.id = Uint8Array.from(window.atob(base64url2base64(data.id)), function (c) {
                return c.charCodeAt(0);
            });
            return data;
        });
    }
    webAuthnCreateCredentials();
});