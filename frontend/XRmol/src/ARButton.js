/**
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 */
import { setSessionMode } from './Core.js';

var ARButton = {
    createButton: function (renderer) {
        function showStartAR(/*device*/) {
            var currentSession = null;

            async function onSessionStarted(session) {
                session.addEventListener('end', onSessionEnded);

                setSessionMode('immersive-ar');

                //change background opacity
                renderer.setClearColor(0x000000, 0);
                renderer.xr.setReferenceSpaceType('local');
                await renderer.xr.setSession(session);
                currentSession = session;
            }

            function onSessionEnded(/*event*/) {
                currentSession.removeEventListener('end', onSessionEnded);

                if (!isDisabled) {
                    document.getElementById('VRmode').disabled = false;
                    document.getElementById('vrmobile').disabled = false;
                }

                currentSession = null;
                renderer.setClearColor(0x000000, 1);
            }
            checkar.addEventListener('click', startSession);
            mobileCheckar.addEventListener('click', startSession);

            function startSession() {
                if (currentSession === null) {
                    if (document.getElementById('VRmode').disabled == false) isDisabled = false;
                    else isDisabled = true;

                    document.getElementById('VRmode').disabled = true;
                    document.getElementById('vrmobile').disabled = true;

                    let sessionInit = {
                        optionalFeatures: ['dom-overlay', 'local', 'hit-test'],
                        domOverlay: { root: document.body },
                    };

                    navigator.xr.requestSession('immersive-ar', sessionInit).then(onSessionStarted);
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

        function disableCheckAR() {
            checkar.disabled = true;
            mobileCheckar.disabled = true;
        }

        function showARNotSupported() {
            disableCheckAR();
            document.getElementById('AR').innerHTML = 'AR NOT SUPPORTED';
        }

        function stylizeElement(element) {
            //element.style.position = 'absolute';
            //element.style.position = 'relative';
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

            var mobileCheckar = document.getElementById('armobile');
            var checkar = document.getElementById('ardesktop');

            navigator.xr
                .isSessionSupported('immersive-ar')
                .then(function (supported) {
                    supported ? showStartAR() : showARNotSupported();
                })
                .catch(showARNotSupported);
        } else {
            var message = document.createElement('a');

            if (window.isSecureContext === false) {
                message.href = document.location.href.replace(/^http:/, 'https:');
                message.innerHTML = 'WEBXR NEEDS HTTPS';
            } else {
                message.href = 'https://immersiveweb.dev/';
                message.innerHTML = 'WEBXR NOT AVAILABLE';
            }

            disableCheckAR();

            message.style.left = 'calc(50% - 90px)';
            message.style.width = '180px';
            message.style.textDecoration = 'none';
            return message;
        }
    },
};

export { ARButton };
