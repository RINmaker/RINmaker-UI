import {
    Atoms,
    distance,
    Ligands,
    toast,
    Scene,
    AlsoConnect,
    selectables,
    renderer,
    camera,
    Helix,
    Sheet,
    reticle,
    pivot,
    CheckNonCovAtoms,
    refBoundingBox,
    mouseUserData,
    AtomBonds,
    LigandBonds,
} from './Core.js';

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';

export function isIOS() {
    //detect if device is an iOs device
    return (
        ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
}

export function saveAsImage(pdbname) {
    var imgData, imgNode;

    try {
        var strMime = 'image/jpeg';

        renderer.setSize(window.innerWidth * 2, window.innerHeight * 2);
        renderer.render(Scene, camera);

        imgData = renderer.domElement.toDataURL(strMime);

        saveFile(imgData.replace(strMime, 'image/octet-stream'), pdbname + '.jpg');
        renderer.setSize(window.innerWidth, window.innerHeight);
    } catch (e) {
        console.log(e);
        return;
    }
}

var saveFile = function (strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link); //remove the link when done
    } else {
        location.replace(uri);
    }
};

export function chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size);
    }

    return chunks;
}

export function getColorFromURLcode(code) {
    let color;
    switch (code) {
        case 1:
            color = 'element';
            break;
        case 2:
            color = 'residue';
            break;
        case 2:
            color = 'secondary';
            break;
        case 2:
            color = 'chain';
            break;
        case 2:
            color = 'BFactor';
            break;
        case 2:
            color = 'hydrofobicity';
            break;
        case 2:
            color = 'spectrum';
            break;
        case 2:
            color = 'chainspectrum';
            break;
        case 2:
            color = 'noncov';
            break;
    }
    return color;
}

export function addBond(atom1, atom2, flag) {
    let res = collegamentoBuono(atom2);
    if (res != 'error') {
        if (res == 'atom' && !flag)
            //both atom are atoms
            AtomBonds.push({ atom1: Atoms[atom1], atom2: Atoms[atom2] });
        else if (res == 'atom' && flag) {
            //first atom is a ligand, second atom is an atom
            LigandBonds.push({ atom1: Ligands[atom1], atom2: Atoms[atom2] });
        } else if (res == 'ligand' && !flag) {
            //first atom is an atom, second is a ligand
            LigandBonds.push({ atom1: Atoms[atom1], atom2: Ligands[atom2] });
        } else {
            //both ligands
            LigandBonds.push({ atom1: Ligands[atom1], atom2: Ligands[atom2] });
        }
    }
}

export function normalize(val, max, min) {
    return (val - min) / (max - min);
}

export function generateRainbow(size) {
    var rainbow = new Array(size);

    for (var i = 0; i < size; i++) {
        var red = sin_to_hex(i, (0 * Math.PI * 2) / 3, size); // 0   deg
        var blue = sin_to_hex(i, (1 * Math.PI * 2) / 3, size); // 120 deg
        var green = sin_to_hex(i, (2 * Math.PI * 2) / 3, size); // 240 deg

        rainbow[i] = '#' + red + green + blue;
    }
    return rainbow;
}

function sin_to_hex(i, phase, size) {
    var sin = Math.sin((Math.PI / size) * 2 * i + phase);
    var int = Math.floor(sin * 127) + 128;
    var hex = int.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
}

export function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

export function mod(n, m) {
    return ((n % m) + m) % m;
}

export function removeTER(atom) {
    return atom != 'TER';
}

export function colorFaces(mesh, facearray, color) {
    let colors = mesh.geometry.attributes.color.array;
    for (let i = 0; i < facearray.length; i += 3) {
        colors[facearray[i]] = color.r;
        colors[facearray[i + 1]] = color.g;
        colors[facearray[i + 2]] = color.b;
    }
    mesh.geometry.computeFaceNormals();
    mesh.geometry.computeVertexNormals();
    mesh.geometry.attributes.color.needsUpdate;
}

export function getCenterPoint(mesh) {
    var geometry = mesh.geometry;
    geometry.computeBoundingBox();
    var center = new THREE.Vector3();
    geometry.boundingBox.getCenter(center);
    mesh.localToWorld(center);
    return center;
}

export function centerGeometry(geometry) {
    //duplicate of geometry.center() but without geometry.computeBoundingBox;
    let _offset = new THREE.Vector3();
    geometry.boundingBox.getCenter(_offset).negate();
    geometry.translate(_offset.x, _offset.y, _offset.z);
}

export function putInPivotAndCenter(pivot, mesh) {
    pivot.add(mesh);
    pivot.matrixWorldNeedsUpdate = true;
    mesh.geometry.computeBoundingBox();
    //
    //let box = new THREE.Box3();
    //box.copy(mesh.geometry.boundingBox);
    //mesh.userData.bounBox = box.clone();
    //
    mesh.geometry.boundingBox.copy(refBoundingBox);
    centerGeometry(mesh.geometry);
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.userData.bb = mesh.geometry.boundingBox;
}

//return all indexes = val in array arr
export function getAllIndexes(arr, val) {
    var indexes = [],
        i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}

//return the atom closest to position for a given tolerance
export function getAtomFromPosition(array, position, tolerance) {
    for (let i = 0; i < array.length; i++) {
        let atom;
        if (!array[i].pos) atom = array[i].atom;
        else atom = array[i];
        if (euclideanDistance(atom.pos, position) < tolerance) return atom;
    }
    return undefined;
}

export function getBondFromPosition(array, position, tolerance) {
    //controlla se position si trova nella retta che interseca
    //array[i].coord1 e array[i].coord2
    for (let i = 0; i < array.length; i++) {
        if (isPoinctOnLIne(array[i].coord1, array[i].coord2, position)) return array[i];
    }
    return undefined;
}

function isPoinctOnLIne(A, B, C) {
    return Math.round((euclideanDistance(A, C) + euclideanDistance(B, C)) * 10) / 10 == Math.round(euclideanDistance(A, B) * 10) / 10;
}

export function manhattanDistance(v1, v2) {
    return Math.abs(v1.x - v2.x) + Math.abs(v1.y - v2.y) + Math.abs(v1.z - v2.z);
}

export function euclideanDistance(v1, v2) {
    return v1.distanceTo(v2);
}

export function fastEuclideanDistance(v1, v2) {
    let deltaX = v2.x - v1.x;
    let deltaY = v2.y - v2.y;
    let deltaZ = v2.z - v1.z;

    return deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
}

export function KDTreeDistance(a, b) {
    let deltaX = b['x'] - a['x'];
    let deltaY = b['y'] - a['y'];
    let deltaZ = b['z'] - a['z'];

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
}

//find point between pointA and pointB
export function getPointInBetween(pointA, pointB) {
    var dir = pointB.clone().sub(pointA);
    var len = dir.length();
    dir = dir.normalize().multiplyScalar(len * 0.5);
    return pointA.clone().add(dir);
}

/*export function getAtomOfSheet(){
    
    var end = false;
    var sheetAtoms = [];
    var j = 1;
    var clone = Atoms.slice(0);
    
    for( var i = 0; i < Sheet.length; i++ ) {
        
        //j = 1;
        
        while( !end ) {
            while ( clone[j] != undefined && clone[j].resSeq >= Sheet[i].start 
                   && clone[j].resSeq <= Sheet[i].end
                  && (
                   clone[j].chainId >= Sheet[i].startChainId || 
                    clone[j].chainId <= Sheet[i].endChainId)
                  )    
            {
                    sheetAtoms.push(clone[j] );
                    if (clone[j].resSeq == Sheet[i].end)
                        end = true;
                    clone.splice(j,1);
            }

            if ( clone[j] != undefined && clone[j].resSeq >= Sheet[i].end && clone[j].chainId == Sheet[i].startChainId )
                end = true;

            if (!end) j++;
        }
        end = false;
      
    }
    return sheetAtoms;
    
}
    
export function getAtomOfHelix(){
    
    var end = false;
    var helixAtoms = [];
    var j=1;
    var clone = Atoms.slice(0);
    
    for( var i = 0; i < Helix.length; i++ ) {
        
        //j = 1;
        
        while( !end ) {
            
            while ( clone[j] != undefined && clone[j].resSeq >= Helix[i].start 
                   && clone[j].resSeq <= Helix[i].end
                  && (
                   clone[j].chainId >= Helix[i].startChainId || 
                    clone[j].chainId <= Helix[i].endChainId)
                   )    
            {
                    helixAtoms.push(clone[j] );
                    if ( clone[j].resSeq >= Helix[i].end )
                        end = true;
                    clone.splice(j,1);
            }

            if ( clone[j] != undefined && clone[j].resSeq >= Helix[i].end && clone[j].chainId == Helix[i].startChainId )
                end = true;    
            
            if (!end) j++;
        }
        end = false;
      
    }
    return helixAtoms;
    
}
*/

export function changeScene(oldscene, newscene, oldobj, newobj) {
    selectables.splice(
        selectables.findIndex((x) => x.name === oldobj),
        1
    );
    Scene.remove(Scene.getObjectByName(oldscene));
    Scene.add(newscene);
    selectables.push(Scene.getObjectByName(newobj));
}

export function prepareForVR(obj, flag) {
    let valscale = 1 / (Atoms.length / distance);
    if (valscale > 0.1) valscale = 0.1;

    obj.userData.lookat = obj.rotation.clone();
    obj.userData.position = obj.position.clone();
    obj.scale.set(valscale, valscale, valscale);

    if (selectables.length) obj.position.set(selectables[0].position.x, selectables[0].position.y, selectables[0].position.z);
    else obj.position.set(0, 1.6, -2);

    obj.lookAt(5, 0, 0); //ruota in orizzontale l'oggetto
    if (!flag)
        //obj not already in selectables
        selectables.push(obj);
}

//obj is a group
export function prepareForAR(obj) {
    var notHaveCOVARchild = false;
    if (!obj.getObjectByName('COVAR')) notHaveCOVARchild = true;

    obj.children.forEach((child) => {
        if ((CheckNonCovAtoms.checked && child.name == 'COVAR') || (notHaveCOVARchild && child.name == 'AR')) {
            child.visible = true;
        } else if (child.name == 'AR' && CheckNonCovAtoms.checked && !notHaveCOVARchild) child.visible = false;
        else if (child.name == 'AR' && !CheckNonCovAtoms.checked) child.visible = true;
        else child.visible = false;
    });

    let ARmesh;
    if (
        CheckNonCovAtoms.checked &&
        !obj.userData.isBond &&
        (obj.name == 'bonds' || obj.name == 'bondsL' || obj.name == 'atoms' || obj.name == 'smallatoms' || obj.name == 'atomsL' || obj.name == 'smallatomsL')
    )
        ARmesh = obj.getObjectByName('COVAR');
    else ARmesh = obj.getObjectByName('AR');

    if (!ARmesh.userData.aldreadyPutInAR) {
        putInPivotAndCenter(pivot, ARmesh);
        ARmesh.userData.aldreadyPutInAR = true;
    } else {
        pivot.add(ARmesh);
        pivot.matrixWorldNeedsUpdate = true;
    }
    //ARmesh.scale.set(pivot.scale.x,pivot.scale.y,pivot.scale.z);
    selectables.push(obj);
}

//flag = true if obj is aldready in selectables, false otherwise
export function prepareForNonAR(obj, flag) {
    //obj is a mesh

    obj.userData.originalParent.visible = true;
    obj.userData.originalParent.children.forEach((child) => {
        if (child.name != 'AR' && child.name != 'COVAR') child.visible = true;
    });
    obj.visible = false;

    //pivot.scale.set(1,1,1);

    let parent = obj.userData.originalParent;
    parent.add(obj);

    //obj.geometry.boundingBox.copy( obj.userData.bounBox.clone() );

    //obj.geometry.computeBoundingBox();
    //obj.geometry.center();

    //centerGeometry(obj.geometry);

    //obj.geometry.verticesNeedUpdate = true;

    if (flag)
        selectables.splice(
            selectables.findIndex((x) => x.name === parent.name),
            1
        );
}

export function prepareForNONVR(obj, flag) {
    let position = obj.userData.position;
    let rotation = obj.userData.lookat;
    obj.lookAt(rotation._x, rotation._y, rotation._z);
    obj.scale.set(1, 1, 1);
    obj.position.set(position.x, position.y, position.z);
    //if ( flag ) //obj is used only in VR
    selectables.splice(
        selectables.findIndex((x) => x.name === obj.name),
        1
    );
}

export function moveSlider(slider, value, sceneobj, rangevalue) {
    var val;
    if (value) val = value;
    else val = (slider.val() - slider.attr('min')) / (slider.attr('max') - slider.attr('min'));

    slider.css('background-image', '-webkit-gradient(linear, left top, right top, ' + 'color-stop(' + val + ', #A3CD99), ' + 'color-stop(' + val + ', #d3d3db)' + ')');
    slider.val(val);
    rangevalue.text(val);
    //let sceneobj = Scene.getObjectByName( 'atoms' );
    if (sceneobj) {
        sceneobj.children.forEach((child) => {
            child.material.transparent = true;
            child.material.opacity = val;
        });
    }
}

export function putInScene(obj) {
    //obj.children.forEach( (child) => {
    switch (obj.name) {
        case 'atoms':
            Scene.getObjectByName('atomi1').add(obj);
            break;
        case 'bonds':
            Scene.getObjectByName('collegamenti').add(obj);
            break;
        case 'smallatoms':
            Scene.getObjectByName('atomi2').add(obj);
            break;
        case 'secondary':
            Scene.getObjectByName('scenaSecondary').add(obj);
            break;
        case 'wireframe':
            Scene.getObjectByName('scenaWireframe').add(obj);
            break;
        case 'atomsVR':
            Scene.getObjectByName('atomi1VR').add(obj);
            break;
        case 'smallatomsVR':
            Scene.getObjectByName('atomi2VR').add(obj);
            break;
        case 'atomsL':
            Scene.getObjectByName('ligands1').add(obj);
            break;
        case 'smallatomsL':
            Scene.getObjectByName('ligands2').add(obj);
            break;
        case 'atomsLVR':
            Scene.getObjectByName('ligands1VR').add(obj);
            break;
        case 'smallatomsLVR':
            Scene.getObjectByName('ligands2VR').add(obj);
            break;
        case 'bondsL':
            Scene.getObjectByName('ligandbonds').add(obj);
            break;
        case 'solvents':
            Scene.getObjectByName('solventi').add(obj);
            break;
        case 'solventsVR':
            Scene.getObjectByName('solventiVR').add(obj);
            break;
        case 'bond_HBOND':
            Scene.getObjectByName('HBOND').add(obj);
            break;
        case 'bond_VDW':
            Scene.getObjectByName('VDW').add(obj);
            break;
        case 'bond_SSBOND':
            Scene.getObjectByName('SSBOND').add(obj);
            break;
        case 'bond_IONIC':
            Scene.getObjectByName('IONIC').add(obj);
            break;
        case 'bond_GENERIC':
            Scene.getObjectByName('GENERIC').add(obj);
            break;
        case 'bond_PIPISTACK':
            Scene.getObjectByName('PIPISTACK').add(obj);
            break;
        case 'bond_PICATION':
            Scene.getObjectByName('PICATION').add(obj);
            break;
        default:
            console.log("Error, can't find Scene");
    }
}

export function putInGroupScene(obj) {
    switch (obj.userData.type) {
        case 'atomsAR':
            Scene.getObjectByName('atomi1').getObjectByName('atoms').add(obj);
            break;
        case 'bondsAR':
            Scene.getObjectByName('collegamenti').getObjectByName('bonds').add(obj);
            break;
        case 'smallatomsAR':
            Scene.getObjectByName('atomi2').getObjectByName('smallatoms').add(obj);
            break;
        case 'secondaryAR':
            Scene.getObjectByName('scenaSecondary').getObjectByName('secondary').add(obj);
            break;
        case 'wireframeAR':
            Scene.getObjectByName('scenaWireframe').getObjectByName('wireframe').add(obj);
            break;
        case 'atomsLAR':
            Scene.getObjectByName('ligands1').getObjectByName('atomsL').add(obj);
            break;
        case 'smallatomsLAR':
            Scene.getObjectByName('ligands2').getObjectByName('smallatomsL').add(obj);
            break;
        case 'bondsLAR':
            Scene.getObjectByName('ligandbonds').getObjectByName('bondsL').add(obj);
            break;
        case 'solventsAR':
            Scene.getObjectByName('solventi').getObjectByName('solvents').add(obj);
            break;
        case 'bond_HBONDAR':
            Scene.getObjectByName('HBOND').getObjectByName('bond_HBOND').add(obj);
            break;
        case 'bond_VDWAR':
            Scene.getObjectByName('VDW').getObjectByName('bond_VDW').add(obj);
            break;
        case 'bond_SSBONDAR':
            Scene.getObjectByName('SSBOND').getObjectByName('bond_SSBOND').add(obj);
            break;
        case 'bond_IONICAR':
            Scene.getObjectByName('IONIC').getObjectByName('bond_IONIC').add(obj);
            break;
        case 'bond_GENERICAR':
            Scene.getObjectByName('GENERIC').getObjectByName('bond_GENERIC').add(obj);
            break;
        case 'bond_PIPISTACKAR':
            Scene.getObjectByName('PIPISTACK').getObjectByName('bond_PIPISTACK').add(obj);
            break;
        case 'bond_PICATIONAR':
            Scene.getObjectByName('PICATION').getObjectByName('bond_PICATION').add(obj);
            break;
        default:
            console.log("Error, can't find Scene");
    }
}

export function calcola_Distanza(atom1, atom2) {
    var CordX = Math.pow(atom2.pos.x - atom1.pos.x, 2);
    var CordY = Math.pow(atom2.pos.y - atom1.pos.y, 2);
    var CordZ = Math.pow(atom2.pos.z - atom1.pos.z, 2);
    var dist = Math.pow(CordX + CordY + CordZ, 1 / 2);
    return dist;
}

export function collegamentoBuono(atom) {
    if (atom == '' || isNaN(atom)) return 'error';
    else if (AlsoConnect.includes(atom)) return 'error';
    else if (Atoms[atom]) return 'atom';
    else if (Ligands[atom]) return 'ligand';
    else return 'error';
}

export function findClosest(atomName, point) {
    var distance = Number.MAX_SAFE_INTEGER,
        min;
    Atoms.forEach((Atom) => {
        if (Atom.elem != atomName) return;
        var atomDistance = Atom.pos.distanceTo(point);
        if (distance > atomDistance) {
            min = Atom;
            distance = atomDistance;
        }
    });
    return min;
}

export function findClosestLigand(atomName, point) {
    var distance = Number.MAX_SAFE_INTEGER,
        min;
    Ligands.forEach((Atom) => {
        if (Atom.elem != atomName) return;
        var atomDistance = Atom.pos.distanceTo(point);
        if (distance > atomDistance) {
            min = Atom;
            distance = atomDistance;
        }
    });
    return min;
}

export function showToast(x, nonCovParsed, type) {
    if (x) {
        if (type == 'atom') {
            toast.className = 'show';
            let nonCovString;
            if (nonCovParsed && x.nonCovBonds.length > 0) {
                nonCovString = '<br> Non-covalent bonds: ' + x.nonCovBonds[0] + '<br> Degree: ' + x.nonCovBonds.length;
            } else nonCovString = '';
            toast.innerHTML = 'Atom name : ' + x.name + '<br>Res name : ' + x.resName + '<br>Chain id : ' + x.chainId + '<br>Res seq : ' + x.resSeq + nonCovString;
            /*toast.innerHTML = x.resName+":"+x.name+", "+x.chainId+", "+ x.resSeq+ " - " + nonCovString;*/
        } else {
            //bond
            toast.className = 'show';
            toast.innerHTML = 'Bond type : ' + x.interaction + '<br>Distance : ' + Math.round(x.distance * 100) / 100 + ' Å' + '<br>Energy :  ' + x.energy + ' kj/mol';
            if (x.angle != -999.9) toast.innerHTML = toast.innerHTML.concat('<br>Angle : ' + Math.round(x.angle * 10) / 10 + '°');
            if (x.node1) toast.innerHTML = toast.innerHTML.concat('<br>Atom1 : ' + x.node1.name);
            //else mass center?
            if (x.node2) toast.innerHTML = toast.innerHTML.concat('<br>Atom2 : ' + x.node2.name);
            //else mass center?
        }

        //take mouse or touch position
        if (mouseUserData.clientX > window.innerWidth - toast.clientWidth) toast.style.left = mouseUserData.clientX - toast.clientWidth + 'px';
        else toast.style.left = mouseUserData.clientX + 'px';
        if (mouseUserData.clientY > window.innerHeight - toast.clientHeight) toast.style.top = mouseUserData.clientY - toast.clientHeight + 'px';
        else toast.style.top = mouseUserData.clientY + 'px';
    }
}

export function showToastVR(x, container, nonCovParsed, type) {
    if (x) {
        var text;

        if (type == 'atom') {
            let nonCovString;
            if (nonCovParsed && x.nonCovBonds.length > 0) {
                nonCovString = '<br> Non-covalent bonds: ' + x.nonCovBonds[0] + '<br> Degree: ' + x.nonCovBonds.length;
            } else nonCovString = '';
            text = 'Atom name : ' + x.name + ' \nRes name : ' + x.resName + '\nChain id : ' + x.chainId + '\nRes seq : ' + x.resSeq + nonCovString;
        } else {
            //bond

            text = 'Bond type : ' + x.interaction + '\nDistance : ' + Math.round(x.distance * 100) / 100 + ' Å' + '\nEnergy :  ' + x.energy + ' kj/mol';
            if (x.angle != -999.9) text = text.concat('\nAngle : ' + Math.round(x.angle * 10) / 10 + '°');
            if (x.node1) text = text.concat('\nAtom1 : ' + x.node1.elem);
            //else scrivo che è un centro di massa?
            if (x.node2) text = text.concat('\nAtom2 : ' + x.node2.elem);
            //else scrivo che è un centro di massa?
        }

        const textBlock = new ThreeMeshUI.Text({
            content: text,
        });

        textBlock.set({
            fontColor: new THREE.Color(0xd2ffbd),
            fontSize: 0.06,
        });

        container.add(textBlock);
        container.visible = true;
    }
}

export function compareSheetHelix(a, b) {
    if (a.startChainId < b.startChainId) return -1;
    else if (a.startChainId > b.startChainId) return 1;
    else if (a.start < b.start) return -1;
    else if (a.start > b.start) return 1;
    else return 0;
}

export function checkDuplicates(a, b, array) {
    var duplicate = true;
    for (var i = 0; i < b; i++) {
        if (array[i].startChainId == a.startChainId && array[i].endChainId == a.endChainId && array[i].start == a.start) {
            duplicate = false;
            break;
        }
    }
    return duplicate;
}

THREE.Object3D.prototype.getObjectByUserDataProperty = function (name, value) {
    if (this.userData[name] === value) return this;

    for (var i = 0, l = this.children.length; i < l; i++) {
        var child = this.children[i];
        var object = child.getObjectByUserDataProperty(name, value);

        if (object !== undefined) {
            return object;
        }
    }

    return undefined;
};

THREE.Object3D.prototype.getObjectsByUserDataProperty = function (name, value) {
    let objects = [];
    if (this.userData[name] === value) return this;

    for (var i = 0, l = this.children.length; i < l; i++) {
        var child = this.children[i];
        var object = child.getObjectByUserDataProperty(name, value);

        if (object !== undefined) {
            objects.push(object);
        }
    }

    return objects;
};
