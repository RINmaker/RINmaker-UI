import * as CORE from './Core.js';
import { XRControllerModelFactory } from './libs/XRControllerModelFactory.js';
import { showToast, showToastVR, getAtomFromPosition, centerGeometry, putInScene, prepareForAR, putInPivotAndCenter, colorFaces, invertColor, euclideanDistance } from './Functions.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import { TransformControls } from './libs/TransformControls.js';
//import ThreeMeshUI from '../../node_modules/three-mesh-ui/src/three-mesh-ui.js';

var XRControllers = {
    intersected: [],
    tempMatrix: new THREE.Matrix4(),

    createControllers: function () {
        var motionController;
        var controllerGrip1, controllerGrip2;
        var intersectedMesh1, intersectedMesh2;

        //CONTROLLERS FOR VR
        CORE.setController1(CORE.renderer.xr.getController(0));
        CORE.controller1.userData.hand = 'right';
        CORE.controller1.addEventListener('selectstart', onSelectStart);
        CORE.controller1.addEventListener('selectend', onSelectEnd);
        CORE.controller1.addEventListener('squeezestart', onSqueezeStart);
        CORE.controller1.addEventListener('squeezeend', onSqueezeEnd);

        CORE.Scene.add(CORE.controller1);

        CORE.setController2(CORE.renderer.xr.getController(1));
        CORE.controller2.userData.hand = 'left';
        CORE.controller2.addEventListener('selectstart', onSelectStart);
        CORE.controller2.addEventListener('selectend', onSelectEnd);
        CORE.controller2.addEventListener('squeezestart', onSqueezeStart);
        CORE.controller2.addEventListener('squeezeend', onSqueezeEnd);

        CORE.Scene.add(CORE.controller2);

        var controllerModelFactory = new XRControllerModelFactory();

        controllerGrip1 = CORE.renderer.xr.getControllerGrip(0);
        controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
        CORE.Scene.add(controllerGrip1);

        controllerGrip2 = CORE.renderer.xr.getControllerGrip(1);
        controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
        CORE.Scene.add(controllerGrip2);

        //LINES TO DETECT CONTROLLER POSITION
        var geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);

        var line = new THREE.Line(geometry);
        line.name = 'line';
        line.scale.z = 5;

        CORE.controller1.add(line.clone());
        CORE.controller2.add(line.clone());

        //create interactive block which contains atoms info when displayed
        /*const container = new ThreeMeshUI.Block({
            height: 0.5,
            width: 0.7,
        });

        let v = new THREE.Vector3(0, 1, -1.8);
        container.position.set(v.x, v.y, v.z);
        container.rotation.x = -0.55;

        container.set({
            fontFamily: './src/vrassets/Roboto-msdf.json',
            fontTexture: './src/vrassets/Roboto-msdf.png',
        });

        container.set({
            alignContent: 'center', // could be 'center' or 'left' or 'right'
            justifyContent: 'center', // could be 'center' or 'start' or 'end'
            padding: 0.03,
        });

        CORE.Scene.add(container);
        //better to hide or to always show container?
        container.visible = false;
        */

        //GRAB THE PROTEIN AND MOVE/ROTATE
        function onSqueezeStart(event) {
            var controller = event.target;

            if (controller.userData.hand == 'right') motionController = controllerGrip1.children[0].motionController;
            else motionController = controllerGrip2.children[0].motionController;

            motionController.updateFromGamepad();

            var components = motionController.components;

            //OCULUS TOUCH MAPPING

            //TRIGGER PER SELEZIONARE LA PROTEINA E MUOVERLA/RUOTARLA/RIDIMENSIONARLA

            //THUMBSTICK O THUMBREST(TOUCHPAD) PER MUOVERSI ALL'INTERNO DELLA STRUTTURA DELLA PROTEINA E PER SELZIONARE UN ATOMO ( SE PREMUTO )

            //A-X BUTTONS OPEN MENU
            //B-Y BUTTONS CLOSE MENU

            for (var component in components) {
                var comp = components[component];

                switch (comp.id) {
                    case 'xr-standard-trigger':
                        handleTrigger(controller); //move and rotate protein
                        break;

                    default:
                        break;
                }
            }
        }

        //RELEASE THE PROTEIN
        function onSqueezeEnd(event) {
            console.log('squeeze button released');

            var controller = event.target;

            if (controller.userData.hand == 'right') motionController = controllerGrip1.children[0].motionController;
            else motionController = controllerGrip2.children[0].motionController;

            motionController.updateFromGamepad();

            if (controller.userData.selected !== undefined && controller.userData.selected.length) {
                controller.userData.selected.forEach((object) => {
                    object.matrix.premultiply(controller.matrixWorld);
                    object.matrix.decompose(object.position, object.quaternion, object.scale);

                    //NOT WORKING
                    /*object.children.forEach(( child )=> { 
                        
                        if (child.material.emissive)
                            
                            child.material.emissive.b = 0; 
                        
                        else
                            
                            child.material.color.b = 0; 
                        
                    });*/

                    let parent = object.userData.originalParent;

                    parent.add(object);
                });

                controller.userData.selected = [];
            }
        }

        function onSelectStart(event) {
            //HANDLING BUTTON
            // states = PRESSED, TOUCHED, DEFAULT
            //xAxis and Yaxis is used for Thumbstick and Touchpad

            //OCULUS TOUCH BUTTONS
            //
            // RIGHT CONTROLLER
            //
            // THUMBSTICK
            // TRIGGER (SQUEEZE)
            // THUMBREST (TOUCHPAD)
            // A BUTTON
            // B BUTTON
            // GRIP
            // UNIVERSAL MENU (RESERVED FOR OCULUS MENU)
            //
            //LEFT CONTROLLER
            //
            // THUMBSTICK
            // TRIGGER
            // GRIP
            // THUMBREST (TOUCH)
            // MENU BUTTON (RESERVED FOR OCULUS MENU?)
            // X BUTTON (SELECT)
            // Y BUTTON (BACK)

            // HTC VIVE --> NOT IMPLEMENTED
            //
            // TRIGGER
            // GRIP-SQUEEZE
            // TOUCHPAD

            // OCULUS GO --> NOT IMPLEMENTED
            //
            // TRIGGER
            // TOUCHPAD

            //VR SESSION
            if (CORE.sessionMode == 'immersive-vr') {
                console.log('select button pressed');

                var controller = event.target;

                if (controller.userData.hand == 'right') motionController = controllerGrip1.children[0].motionController;
                else motionController = controllerGrip2.children[0].motionController;

                motionController.updateFromGamepad();

                var components = motionController.components;

                //OCULUS TOUCH MAPPING

                //TRIGGER PER SELEZIONARE LA PROTEINA E MUOVERLA/RUOTARLA/RIDIMENSIONARLA

                //THUMBSTICK O THUMBREST(TOUCHPAD) PER MUOVERSI ALL'INTERNO DELLA STRUTTURA DELLA PROTEINA E PER SELZIONARE UN ATOMO ( SE PREMUTO )

                //A-X BUTTONS OPEN MENU
                //B-Y BUTTONS CLOSE MENU

                for (var component in components) {
                    var comp = components[component];

                    switch (comp.id) {
                        case 'xr-standard-thumbstick':
                            handleThumbstick(comp, controller);
                            break;

                        case 'a-button':
                            openMenu();
                            break;

                        case 'b-button':
                            closeMenu();
                            break;

                        case 'x-button':
                            openMenu();
                            break;

                        case 'y-button':
                            closeMenu();
                            break;

                        default:
                            break;
                    }
                }

                //HTC VIVE MAPPING  ---> NOT IMPLEMENTED

                //TRIGGER PER SELEZIONARE LA PROTEINA E MUOVERLA/RUOTARLA/INGRANDIRLA O RIMPICCIOLIRLA

                //TOUCHPAD PER MUOVERSI ALL'INTERNO DELLA STRUTTURA DELLA PROTEINA E PER SELEZIONARE UN ATOMO
            } else {
                //AR SESSION
                //interact with the phone using the XR controller

                //place the protein (actually it only sets the visibility to true and move the protein in the correct position)

                if (CORE.reticle.visible && !CORE.proteinPlaced) {
                    CORE.pivot.position.setFromMatrixPosition(CORE.reticle.matrix);

                    //ex rotation controls-> no more used
                    CORE.setARControls(new TransformControls(CORE.camera, CORE.renderer.domElement));
                    CORE.ARcontrols.addEventListener('change', () => CORE.renderer.render(CORE.Scene, CORE.camera));
                    CORE.ARcontrols.attach(CORE.pivot);
                    CORE.Scene.add(CORE.ARcontrols);
                    CORE.ARcontrols.setMode('rotate');
                    CORE.ARcontrols.enabled = true;
                    //CORE.ARcontrols.showX = false;
                    //CORE.ARcontrols.showY = false;
                    //CORE.ARcontrols.showZ = false;
                    CORE.ARcontrols.setSize(2);

                    //CLONE ATOMS MESH AND PUT IN THE AR PIVOT, THIS IS USED TO RETRIEVE A REFERENCE BOUNDING BOX. THE BOX IS THEN USED TO CENTER ALL THE MESHES

                    if (CORE.refBoundingBox == null) {
                        let box = new THREE.Box3();
                        let temp = CORE.SecondaryStructureScene.getObjectByName('AR');

                        let mesh = new THREE.Mesh(temp.geometry.clone(), temp.material.clone());

                        mesh.scale.set(0.02, 0.02, 0.02);
                        mesh.visible = false;

                        CORE.pivot.add(mesh);
                        CORE.pivot.matrixWorldNeedsUpdate = true;

                        mesh.geometry.computeBoundingBox();
                        box.copy(mesh.geometry.boundingBox);
                        CORE.setRefBoundingBox(box.clone());

                        mesh.geometry.center();
                        mesh.geometry.verticesNeedUpdate = true;

                        CORE.pivot.remove(mesh);
                    }

                    CORE.selectables.forEach((obj) => {
                        if (CORE.CheckNonCovAtoms.checked == true) {
                            let COVARmesh = obj.getObjectByName('COVAR');

                            if (COVARmesh) {
                                COVARmesh.visible = true;

                                if (!COVARmesh.userData.aldreadyPutInAR) {
                                    putInPivotAndCenter(CORE.pivot, COVARmesh);
                                    COVARmesh.userData.aldreadyPutInAR = true;
                                } else {
                                    CORE.pivot.add(COVARmesh);
                                    CORE.pivot.matrixWorldNeedsUpdate = true;
                                }
                            } else {
                                let ARmesh = obj.getObjectByName('AR');
                                if (ARmesh) {
                                    let regex = /bond_/;

                                    if (ARmesh.userData.type.match(regex)) ARmesh.visible = true;
                                    else ARmesh.visible = false;

                                    if (!ARmesh.userData.aldreadyPutInAR) {
                                        putInPivotAndCenter(CORE.pivot, ARmesh);
                                        ARmesh.userData.aldreadyPutInAR = true;
                                    } else {
                                        CORE.pivot.add(ARmesh);
                                        CORE.pivot.matrixWorldNeedsUpdate = true;
                                    }
                                }
                            }
                        } else {
                            let ARmesh = obj.getObjectByName('AR');
                            if (ARmesh) {
                                ARmesh.visible = true;

                                if (!ARmesh.userData.aldreadyPutInAR) {
                                    putInPivotAndCenter(CORE.pivot, ARmesh);
                                    ARmesh.userData.aldreadyPutInAR = true;
                                } else {
                                    CORE.pivot.add(ARmesh);
                                    CORE.pivot.matrixWorldNeedsUpdate = true;
                                }
                            }
                        }
                    });

                    CORE.setProteinPlaced(true);
                    CORE.reticle.visible = false;
                }
            }
        }

        //THE ONLY BUTTON THAT USES THIS TYPE OF EVENT IS THUMBSTICK.
        function onSelectEnd(event) {
            if (CORE.sessionMode == 'immersive-vr') {
                console.log('select button released');

                if (intersectedMesh1 && event.target.userData.hand == 'right') {
                    /*intersectedMesh1.material.emissive = new THREE.Color(0x000000); 
                    intersectedMesh1 = undefined;  
                    if ( intersectedMesh2 )
                        showToast( intersectedMesh2.userData.atom );
                    else
                        CORE.toast.className = "hide";*/

                    intersectedMesh1 = undefined;
                    //clear textblock
                    container.remove(container.children[1]);
                    container.visible = false;
                }
                if (intersectedMesh2 && event.target.userData.hand == 'left') {
                    /*intersectedMesh2.material.emissive = new THREE.Color(0x000000); 
                    intersectedMesh2 = undefined;
                    if ( intersectedMesh1 )
                        showToast( intersectedMesh1.userData.atom );
                    else
                        CORE.toast.className = "hide";*/
                    intersectedMesh2 = undefined;
                    //clear textblock
                    container.remove(container.children[1]);
                    container.visible = false;
                }
            } else {
                //AR
                //NOTHING TO DO
            }
        }

        //SELECT SOMETHING IN THE MENU OR GRAB ONE PROTEIN TO MOVE/ROTATE/SCALE IT
        function handleTrigger(controller) {
            //TODO SELECT IN THE MENU
            console.log('squeeze button pressed');

            var intersections = XRControllers.getIntersections(controller);

            if (intersections.length > 0) {
                //TODO implement zoom if the protein is grabbed toghether by the 2 controllers

                //if the menu is close
                //GRAB the PROTEIN
                CORE.selectables.forEach((object) => {
                    XRControllers.tempMatrix.getInverse(controller.matrixWorld);
                    object.matrix.premultiply(XRControllers.tempMatrix);
                    object.matrix.decompose(object.position, object.quaternion, object.scale);

                    object.children.forEach((child) => {
                        if (child.material.emissive) child.material.emissive.b = 0;
                        else child.material.color.b = 0;
                    });

                    if (!object.userData.originalParent) object.userData.originalParent = object.parent;

                    //DOUBLE GRAB -> ZOOM -> NOT WORKING
                    if (object.parent != object.userData.originalParent) {
                        //GET OBJECT.PARENT POSITION AND THIS CONTROLLER POSITION
                        var posC1 = object.parent.position;
                        var posC2 = controller.position;

                        var lastC1, lastC2;
                        var posStart = euclideanDistance(posC1, posC2);

                        //never ending while
                        /*while( (posC1 = object.parent.position) != lastC1 && (posC2 = controller.position) != lastC2 ){
                            
                            var posEnd = euclideanDistance( posC1, posC2 );

                            var factor = posEnd / posStart;
                            posStart = posEnd;
                            
                            //devi scalare tutti gli oggetti non solo questo comunque, tutti quelli grabbati dal controller
                            
                            object.scale.set( factor, factor, factor );
                        }*/
                    } else {
                        //1 grab -> MOVE PROTEIN

                        controller.add(object);

                        if (!controller.userData.selected) controller.userData.selected = [];

                        controller.userData.selected.push(object); //array of selected objects
                    }
                });

                //if the menu is open
                //SELECT IN THE MENU
                //TODO
                //
                // ...
            }
        }

        //TRANSIT THE STRUCTURE OF THE PROTEIN BY MOVING THE THUMSTICK, PRESSING IT
        //RETRIEVE INFO ABOUT THE ATOM
        function handleThumbstick(thumbstick, controller) {
            if (thumbstick.values.state === 'touched' && thumbstick.values.yAxis !== 0) {
                console.log('thumbstick touched!');
                //TODO transit the structure: see info in chrome favorites for a tutorial
            } else if (thumbstick.values.state === 'pressed') {
                //debug
                console.log('thumbstick pressed!');

                //select an atom, highlight it and show toast with informations about it
                var line = controller.getObjectByName('line');

                var intersections = XRControllers.getIntersections(controller);

                if (intersections.length > 0) {
                    var intersection = intersections[0];

                    line.scale.z = intersection.distance;

                    //this works only if serial are in increasing order and without missing numbers
                    var faceIndex = intersection.faceIndex;
                    var posIndex = intersection.object.geometry.index.array[faceIndex * 3] * 3;
                    var indexArray;

                    if (intersection.object.parent.name == 'secondary')
                        indexArray = intersection.object.geometry.userData.faceArray.findIndex((arr) => arr != undefined && arr[0] <= posIndex && arr[arr.length - 1] >= posIndex);
                    else {
                        indexArray = Math.floor(posIndex / intersection.object.geometry.userData.faceArray.find((element) => element != undefined).length + 1);
                        indexArray = parseInt(Object.keys(intersection.object.geometry.userData.faceArray)[indexArray]);
                    }

                    var atomIndex = indexArray - 1;
                    var atom;

                    //TODO questa è una DEMO: funziona solo con gli atomi, non con ligandi e solventi
                    atom = CORE.Atoms[atomIndex];

                    while (!atom) atom = CORE.Atoms[atomIndex++];

                    //highlight the atom--> colorFaces not working!
                    if (controller.userData.hand == 'right') {
                        intersectedMesh1 = intersection.object;
                        //colorFaces( intersectedMesh1, intersectedMesh1.geometry.userData.faceArray[indexArray], new THREE.Color( invertColor( atom.color )));
                    } else {
                        intersectedMesh2 = intersection.object;
                        //colorFaces( intersectedMesh2, intersectedMesh2.geometry.userData.faceArray[indexArray], new THREE.Color( invertColor( atom.color )));
                    }
                    let camera = CORE.renderer.xr.getCamera(CORE.camera);

                    var direction = new THREE.Vector3();
                    camera.getWorldDirection(direction);

                    container.position.copy(camera.position).add(direction.multiplyScalar(1));
                    container.quaternion.copy(camera.quaternion);

                    showToastVR(atom, container, CORE.bondloaded, 'atom');
                }
            }
        }

        function openMenu() {
            //TODO
            console.log('a or x button pressed!');
        }

        function closeMenu() {
            //TODO
            console.log('b or y button pressed!');
        }
    },

    getIntersections: function (controller) {
        //RAYCASTER USED IN VR
        var raycasterVR = new THREE.Raycaster();

        XRControllers.tempMatrix.identity().extractRotation(controller.matrixWorld);

        raycasterVR.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycasterVR.ray.direction.set(0, 0, -1).applyMatrix4(XRControllers.tempMatrix);

        if (CORE.selectables.length)
            //with true it explore all the children
            return raycasterVR.intersectObjects(CORE.selectables, true);
        else return new Array();
    },

    intersectObjects: function (controller) {
        if (CORE.sessionMode == 'immersive-vr') {
            //Do not highlight when already selected
            if (controller.userData.selected !== undefined && controller.userData.selected.length) return;

            //console.log( controllerGrip1.children[0].XRControllerModel.motionController.components.values );

            var line = controller.getObjectByName('line');
            var intersections = XRControllers.getIntersections(controller);

            if (intersections.length > 0) {
                //nel caso ci siano più proteine nella scena
                var intersection = intersections[0];

                line.scale.z = intersection.distance;

                CORE.selectables.forEach((object) => {
                    XRControllers.intersected.push(object);
                });
            } else {
                line.scale.z = 5;
            }
        } else {
            //immersive-AR
            //cannot raycast in AR mode
        }
    },

    cleanIntersected: function (obj) {
        if (obj) {
            //here change code and use colorFaces-> colorFaces not working!!
            obj.children.forEach((child) => {
                if (child.material.emissive) child.material.emissive.b = 0;
                else child.material.color.b = 0;
            });
        }

        while (this.intersected.length) {
            var object = this.intersected.pop();

            object.children.forEach((child) => {
                if (child.material.emissive) child.material.emissive.b = 0;
                else child.material.color.b = 0;
            });
        }
    },
};

export { XRControllers };
