/*jslint browser: true */
/*global window, $, publicKey, PublicKeyCredential */

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
    $("#alertbox").css('visibility', 'hidden');
    $("#alertbox").text("PLACEHOLDER TEXT");
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
            location.href = 'parse_w.php?data=' + window.btoa(JSON.stringify(publicKeyCredential));
        }, function (error) {
            console.log(error);
            $("#alertbox").html("Registration failed. Please try again!");
            $("#alertbox").css('visibility', 'visible');
            $("#register").html('Retry ...');
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

    // Register event listener
    var forms = document.getElementsByClassName('needs-validation');
    Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (form.checkValidity() === true) {
                webAuthnCreateCredentials();
            }
            form.classList.add('was-validated');
        }, false);
    });

});