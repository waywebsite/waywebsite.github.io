/*jslint browser: true */
/*global window, $, UAParser*/

$(document).ready(function () {
    'use strict';

    /* Web Authentication */
    const publicKey = {
        rp: {
            name: "Something",
            id: "wayworkshop.org"
        },
        pubKeyCredParams: [
            {
                type: "public-key",
                alg: -7
            },
            {
                type: "public-key",
                alg: -257
            }
        ],
        challenge: "cGw87RgCCIa_SBBHwS0BMQ",
        attestation: "none",
        user: {
            name: "anonymous",
            id: "c3VwZXItYmYxZDIzZDQtMTJmMS00Y2Y0LWJmYWQtYTdiZTk2M2ExNmU0",
            displayName: "Anonymous Participant"
        },
        authenticatorSelection: {
            requireResidentKey: false,
            userVerification: "required",
            authenticatorAttachment: "platform"
        },
        excludeCredentials: [
            {
                type: "public-key",
                id: "QUJDREVGR0guLi4"
            }
        ],
        extensions: {
            txAuthSimple: "Execute order 66.",
            loc: true,
            uvm: true,
            uvi: true,
            exts: true
        },
        timeout: 60000
    };

    function arrayToBase64String(a) {
        return window.btoa(String.fromCharCode(...a));
    }

    function base64url2base64(input) {
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
                console.log(JSON.stringify(publicKeyCredential));
            }, function (error) {
                console.log(error);
            });
    }

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

    // Check whether correct device and browser is used
    if (window.PublicKeyCredential) {
        console.log("WebAuthn is supported");
    } else {
        $("#login").prop('disabled', true);
    }

    /*
    var isChrome = /Chrome/.test(navigator.userAgent) && (/Google\ Inc/).test(navigator.vendor);
    if (!isChrome) {
        $('#console').text("Sorry you cannot use this browser. You need to use Google Chrome!");
        $("#login").attr('disabled', true);
        $("#login").html("<del>Start</del>");
        $("#login").removeClass("btn-primary").addClass("btn-danger");
    }
    var ua = navigator.userAgent;
    var isAndroid = ua.indexOf("Android") > -1;
    if (!isAndroid) {
        $('#console').text("You need to use Android. Your operating system is not supported.");
        $("#login").attr('disabled', true);
        $("#login").html("<del>Start</del>");
        $("#login").removeClass("btn-primary").addClass("btn-danger");
    }*/
    $("#login").on('click', function () {
        webAuthnCreateCredentials();
    });

});