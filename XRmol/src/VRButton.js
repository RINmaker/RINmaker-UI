/**
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 */

import * as CORE from './Core.js';

var VRButton = {
    createButton: function (renderer, options) {
        if (options && options.referenceSpaceType) {
            renderer.xr.setReferenceSpaceType(options.referenceSpaceType);
        }
        var sceneobj, size;

        function showEnterVR(/*device*/) {
            var currentSession = null;

            function onSessionStarted(session) {
                session.addEventListener('end', onSessionEnded);

                CORE.setSessionMode('immersive-vr');

                renderer.xr.setSession(session);

                document.getElementById('VR').innerHTML = 'EXIT VR';

                document.getElementById('armobile').disabled = true;

                currentSession = session;
                //CORE.XRsession = session;
            }

            function onSessionEnded(/*event*/) {
                currentSession.removeEventListener('end', onSessionEnded);

                document.getElementById('VR').innerHTML = 'ENTER VR';

                if (!isDisabled) {
                    document.getElementById('armobile').disabled = false;
                }
                $('#cardboardmobile').removeClass('active');
                currentSession = null;
            }
            document.getElementById('VR').innerHTML = 'ENTER FULL VR';

            checkvr.addEventListener('click', startSession);
            mobileCheckvr.addEventListener('click', startSession);

            function startSession() {
                if (currentSession === null) {
                    if (document.getElementById('armobile').disabled == false) isDisabled = false;
                    else isDisabled = true;

                    //document.getElementById("ARmode").disabled = true;
                    document.getElementById('armobile').disabled = true;

                    // WebXR's requestReferenceSpace only works if the corresponding feature
                    // was requested at session creation time. For simplicity, just ask for
                    // the interesting ones as optional features, but be aware that the
                    // requestReferenceSpace call will fail if it turns out to be unavailable.
                    // ('local' is always available for immersive sessions and doesn't need to
                    // be requested separately.)

                    var sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor'] };
                    navigator.xr.requestSession('immersive-vr', sessionInit).then(onSessionStarted);
                } else {
                    currentSession.end();
                }
            }
        }

        function disableButton() {
            button.style.display = '';

            button.style.cursor = 'auto';
            button.style.left = 'calc(50% - 75px)';
            button.style.width = '150px';

            button.onmouseenter = null;
            button.onmouseleave = null;

            button.onclick = null;
        }

        function disableCheckVR() {
            checkvr.disabled = true;
            mobileCheckvr.disabled = true;
        }

        function showWebXRNotFound() {
            disableCheckVR();
            document.getElementById('VR').innerHTML = 'VR NOT SUPPORTED';
        }

        function stylizeElement(element) {
            //element.style.position = 'absolute';
            element.style.bottom = '20px';
            element.style.padding = '12px 6px';
            element.style.border = '1px solid #fff';
            element.style.borderRadius = '4px';
            element.style.background = 'rgba(0,0,0,0.1)';
            element.style.color = '#fff';
            element.style.font = 'normal 13px sans-serif';
            element.style.textAlign = 'center';
            element.style.opacity = '0.5';
            element.style.outline = 'none';
            element.style.zIndex = '999';
        }

        if ('xr' in navigator) {
            var isDisabled;
            var checkvr = document.getElementById('VRmode');
            var mobileCheckvr = document.getElementById('vrmobile');
            navigator.xr.isSessionSupported('immersive-vr').then(function (supported) {
                supported ? showEnterVR() : showWebXRNotFound();
            });
        } else {
            var message = document.createElement('a');

            if (window.isSecureContext === false) {
                message.href = document.location.href.replace(/^http:/, 'https:');
                message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message
            } else {
                message.href = 'https://immersiveweb.dev/';
                message.innerHTML = 'WEBXR NOT AVAILABLE';
            }

            disableCheckVR();
            document.getElementById('VR').innerHTML = 'VR NOT SUPPORTED';

            message.style.left = 'calc(50% - 90px)';
            message.style.width = '180px';
            message.style.textDecoration = 'none';

            return message;
        }
    },
};

export { VRButton };
