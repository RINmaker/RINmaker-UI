import * as CORE from './Core.js';
import * as CONSTANTS from './Constants.js';
import { prepareForVR, moveSlider, getPointInBetween, prepareForAR, centerGeometry, putInPivotAndCenter, mod, generateRainbow, normalize, euclideanDistance, getCenterPoint } from './Functions.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';
import { BufferGeometryUtils } from './libs/BufferGeometryUtils.js';

//exportable variable (to set the position of the XR camera)
export let appo2;

export function renderizza() {
    CORE.Scene.remove(CORE.Scene.getObjectByName('atomi1'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('atomi2'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('collegamenti'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('scenaSecondary'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('scenaWireframe'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('scenaSesSurface'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('scenaSasSurface'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('scenaVdwSurface'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('scenaMsSurface'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('ligands1'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('ligands2'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('ligandbonds'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('atomi1VR'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('atomi2VR'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('ligands1VR'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('ligands2VR'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('solventi'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('solventiVR'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('HBOND'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('VDW'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('SBOND'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('IONIC'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('GENERIC'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('PIPISTACK'));
    CORE.Scene.remove(CORE.Scene.getObjectByName('PICATION'));

    //bonds are not rendered right away
    CORE.setScene('HBOND');
    CORE.HBONDScene.name = 'HBOND';
    CORE.setScene('VDW');
    CORE.VDWScene.name = 'VDW';
    CORE.setScene('SBOND');
    CORE.SBONDScene.name = 'SBOND';
    CORE.setScene('IONIC');
    CORE.IONICScene.name = 'IONIC';
    CORE.setScene('PIPISTACK');
    CORE.PIPISTACKScene.name = 'PIPISTACK';
    CORE.setScene('PICATION');
    CORE.PICATIONScene.name = 'PICATION';
    CORE.setScene('GENERIC');
    CORE.GENERICScene.name = 'GENERIC';

    //surfaces are not rendered right away
    CORE.setScene('scenaVdwSurface');
    CORE.VDWSurfaceScene.name = 'scenaVdwSurface';
    CORE.setScene('scenaSesSurface');
    CORE.SESSurfaceScene.name = 'scenaSesSurface';
    CORE.setScene('scenaSasSurface');
    CORE.SASSurfaceScene.name = 'scenaSasSurface';
    CORE.setScene('scenaMsSurface');
    CORE.MSSurfaceScene.name = 'scenaMsSurface';

    CORE.setScene('atomi1');
    CORE.AtomScene.name = 'atomi1';
    CORE.setScene('atomi2');
    CORE.SmallAtomScene.name = 'atomi2';

    /*CORE.setScene("atomi1VR");
    CORE.ScenaAtomi1VR.name = "atomi1VR";
    CORE.setScene("atomi2VR");
    CORE.ScenaAtomi2VR.name = "atomi2VR";*/

    /*CORE.setScene("scenaWireframe");
    CORE.WireframeScene.name = "scenaWireframe";
    CORE.setScene("collegamenti");
    CORE.AtomBondsScene.name = "collegamenti";*/

    CORE.cleanArrays();

    //fog calculation
    var c = CORE.maxY - CORE.minY;
    CORE.setC(c);
    var cos = 2 - Math.cos((CORE.FOV * Math.PI) / 180) * 2;
    var distance = Math.sqrt((c / cos) * (c / cos) - c * c) * 1.05;
    CORE.setDistance(distance);

    renderHetatms();
    renderLigandBonds();
    //renderAllAtoms();
    //renderBonds();
    //renderWireFrame();
    renderSecondary();

    CORE.Scene.add(CORE.SecondaryStructureScene);
    CORE.selectables.push(CORE.Scene.getObjectByName('secondary'));

    //addScene();

    //orbit control and camera position
    var appo = CORE.median.clone();
    CORE.controls.target.set(CORE.median.x, CORE.median.y, CORE.median.z);
    var dist = distance / appo.length();
    appo2 = appo.clone().multiplyScalar(dist * 1.8);
    CORE.camera.lookAt(appo);
    CORE.camera.position.set(appo2.x, appo2.y, appo2.z);
    CORE.controls.update();
    CORE.renderer.render(CORE.Scene, CORE.camera);
}

//TODO finish this
//set Checkboxes
/*function readURLparams(){
    //visualization types:
    if ( CORE.URLviztype.includes(1) ){  //sphere
        $('#Check_atoms').attr("checked",true);
        $('#mobilecheck_atoms').attr("checked",true);
    }
    if ( CORE.URLviztype.includes(2) ){ //ball and rod
        $('#Check_sticks').attr("checked",true);
        $('#mobilecheck_rod').attr("checked",true);
    }
    if ( CORE.URLviztype.includes(3) ){ //secondary
        $('#Check_Secondary').attr("checked",true);
        $('#mobilecheck_sec').attr("checked",true);
    }
    if ( CORE.URLviztype.includes(4) ){ //wireframe
        $('#Check_wireframe').attr("checked",true);
        $('#mobilecheck_wireframe').attr("checked",true);
    }
    //color
    switch ( CORE.URLcolor ){
        case 1://elemtn
            $("#elemspan").addClass("activeSpan");
            $("#mobileelemspan").addClass("activeSpan");
            colorBy("element");
            break;
        case 2://residue
            $("#residuespan").addClass("activeSpan");
            $("#mobileresspan").addClass("activeSpan");
            colorBy("residue");
            break;
        case 3://secondary
            $("#secspan").addClass("activeSpan");
            $("#mobilesecspan").addClass("activeSpan");
            colorBy("secondary");
            break;
        case 4: //chain
            $("#chainspan").addClass("activeSpan");
            $("#mobilechainspan").addClass("activeSpan");
            colorBy("chain");
            break;
        case 5://bfactor
            $("#bfactorspan").addClass("activeSpan");
            $("#mobilebfactorspan").addClass("activeSpan");
            colorBy("BFactor");
            break;
        case 6://hydrofobicity
            $("#hydrospan").addClass("activeSpan");
            $("#mobilehydrospan").addClass("activeSpan");
            colorBy("hydrofobicity");
            break;
        case 7://spectrum
            $("#spectrumspan").addClass("activeSpan");
            $("#mobilespectrumspan").addClass("activeSpan");
            colorBy("spectrum");
            break;
        case 8://chain spectrum
            $("#chainspectrumspan").addClass("activeSpan");
            $("#mobilechainspectspan").addClass("activeSpan");
            colorBy("chainspectrum");
            break;
        case 9://bond
            $("#bondspan").addClass("activeSpan");
            $("#mobilenoncovbondsspan").addClass("activeSpan");
            colorBy("noncov");
            break;
    }
    
    //ligands
    if ( CORE.URLligands.includes(1) ){
        $('#Check_ligands').attr("checked",true);
        $('#mobilecheck_ligandsphere').attr("checked",true);
    }
    if ( CORE.URLligands.includes(2) ){
        $('#Check_ligands_sticks').attr("checked",true);
        $('#mobilecheck_ligandrod').attr("checked",true);
    }
    //solvents 
    if ( CORE.URLsolvents == 1 ){
        $('#Check_solvent').attr("checked",true);
        $('#mobilecheck_water').attr("checked",true);
    }
    if ( CORE.URLparsbonds == 1 ){
        //colora gli xml bond in base a quello che c'è in
        //URLcolorbonds
        if ( CORE.URLcolorbonds == 1){ //type
            $("#Check_noncovtypecolor").addClass("activeSpan");
            $("#mobilecheck_noncovtypecolor").addClass("activeSpan");
            colorBy("covtype");
        }else{//distance
            $("#Check_noncovdistancecolor").addClass("activeSpan");
            $("#mobilecheck_noncovdistancecolor").addClass("activeSpan");
            colorBy("covdistance");
        }
        
        parseXmlBonds();
        
        if ( CORE.URLbonds.includes(1) ){
            $('#Check_hbond').attr("checked",true);
            $('#mobilecheck_hbond').attr("checked",true);
        }
        if ( CORE.URLbonds.includes(2) ){
            $('#Check_vdw').attr("checked",true);
            $('#mobilecheck_vdw').attr("checked",true);
        }
        if ( CORE.URLbonds.includes(3) ){
            $('#Check_sbond').attr("checked",true);
            $('#mobilecheck_sbond').attr("checked",true);
        }
        if ( CORE.URLbonds.includes(4) ){
            $('#Check_ionic').attr("checked",true);
            $('#mobilecheck_ionic').attr("checked",true);
        }
        if ( CORE.URLbonds.includes(5) ){
            $('#Check_pipistack').attr("checked",true);
            $('#mobilecheck_pipistack').attr("checked",true);
        }
        if ( CORE.URLatombonds == 1 ){
            //launch function?
            $('#Check_noncov_atoms').trigger("click");
            $('#mobilecheck_noncov_atoms').attr("checked",true);
        }
        
    }
    
}*/

export function renderHetatms() {
    CORE.setScene('ligands1');
    CORE.LigandsScene.name = 'ligands1';
    CORE.setScene('ligands2');
    CORE.SmallLigandsScene.name = 'ligands2';

    /*CORE.setScene("ligands1VR");
    CORE.ScenaLigands1VR.name = "ligands1VR";
    CORE.setScene("ligands2VR");
    CORE.ScenaLigands2VR.name = "ligands2VR";*/

    CORE.setScene('solventi');
    CORE.ScenaSolvents.name = 'solventi';
    /*CORE.setScene("solventiVR");
    CORE.ScenaSolventsVR.name = "solventiVR";*/

    //LIGANDS
    if (CORE.Ligands.length) {
        //CREATE ARRAYS FOR GEOMETRIES

        var SingleGeometry3 = [],
            SingleGeometry4 = [];
        var SingleGeometry3VR = [],
            SingleGeometry4VR = [];

        //CREATE GEOMETRIES

        createAtomGeomtry(CORE.Ligands, 'ligands', false, CORE.LigandsPool1, CORE.LigandsPool2, SingleGeometry3, SingleGeometry4);
        //createAtomGeomtry(CORE.Ligands, 'ligands', true, CORE.LigandsPool1, CORE.LigandsPool2, SingleGeometry3VR, SingleGeometry4VR);

        //CREATE GROUPs

        var group1L = new THREE.Group();
        var group2L = new THREE.Group();
        //var group1LVR = new THREE.Group();
        //var group2LVR = new THREE.Group();

        //group1LVR.name = "atomsLVR";
        //group2LVR.name = "smallatomsLVR";
        group1L.name = 'atomsL';
        group2L.name = 'smallatomsL';

        //CREATE MESH

        createAtomMesh(SingleGeometry3, 'atomsL', group1L, 'ligand');
        createAtomMesh(SingleGeometry4, 'smallatomsL', group2L, 'ligand');
        //createAtomMesh(SingleGeometry3VR, "atomsLVR", group1LVR, "ligand");
        //createAtomMesh(SingleGeometry4VR, "smallatomsLVR", group2LVR, "ligand");

        //CREATE MESH FOR AR

        createARMesh(group1L, 'atomsL', 'atoms');
        createARMesh(group2L, 'smallatomsL', 'atoms');

        //CORE.ScenaLigands1VR.add(group1LVR);
        CORE.LigandsScene.add(group1L);
        //CORE.ScenaLigands2VR.add(group2LVR);
        CORE.SmallLigandsScene.add(group2L);

        CORE.setLigandsPresent(true);

        CORE.mobileCheckboxLigands.removeAttribute('disabled');
        CORE.CheckboxLigands.removeAttribute('disabled');
        CORE.mobileCheckboxLigandsStick.removeAttribute('disabled');
        CORE.CheckboxLigandsStick.removeAttribute('disabled');
    }

    //SOLVENTS
    if (CORE.Solvents.length) {
        //CREATE ARRAYS FOR GEOMETRIES

        var SingleGeometry5 = []; //, SingleGeometry5VR = [];

        //CREATE GEOMETRIES

        createAtomGeomtry(CORE.Solvents, 'solvents', false, CORE.SolventsPool, undefined, SingleGeometry5, undefined);
        //createAtomGeomtry(CORE.Solvents, 'solvents', true, CORE.SolventsPool, undefined, SingleGeometry5VR, undefined);

        //CREATE GROUPs

        var group1S = new THREE.Group();
        //var group1SVR = new THREE.Group();

        group1S.name = 'solvents';
        //group1SVR.name = "solventsVR";

        //CREATE MESH

        createAtomMesh(SingleGeometry5, 'solvents', group1S, 'solvent');
        //createAtomMesh(SingleGeometry5VR, "solventsVR", group1SVR, "solvent");

        //CREATE MESH FOR AR
        createARMesh(group1S, 'solvents', 'atoms');

        CORE.ScenaSolvents.add(group1S);
        //CORE.ScenaSolventsVR.add(group1SVR);

        CORE.setSolventPresent(true);

        CORE.mobileCheckboxSolvent.removeAttribute('disabled');
        CORE.CheckboxSolvent.removeAttribute('disabled');
    }

    console.log('Drawn ligands: ' + Object.keys(CORE.Ligands).length);
    console.log('Drawn solvents: ' + CORE.Solvents.length);
}

export function renderAllAtoms() {
    //ATOMS

    //SET SCENES
    CORE.setScene('atomi1');
    CORE.AtomScene.name = 'atomi1';
    CORE.setScene('atomi2');
    CORE.SmallAtomScene.name = 'atomi2';
    /*CORE.setScene("atomi1VR");
    CORE.ScenaAtomi1VR.name = "atomi1VR";
    CORE.setScene("atomi2VR");
    CORE.ScenaAtomi2VR.name = "atomi2VR";*/

    //CREATE ARRAY FOR GEOMETRIES
    var SingleGeometry = [],
        SingleGeometry2 = [];
    //var SingleGeometryVR = [], SingleGeometry2VR = [];

    //CREATE ATOMS GEOMETRIES
    if (CORE.Atoms.length) {
        createAtomGeomtry(CORE.Atoms, 'atoms', false, CORE.AtomPool1, CORE.AtomPool2, SingleGeometry, SingleGeometry2);
        //createAtomGeomtry(CORE.Atoms, 'atoms', true, CORE.AtomPool1, CORE.AtomPool2, SingleGeometryVR, SingleGeometry2VR);

        //CREATE GROUPS

        var group1 = new THREE.Group();
        var group2 = new THREE.Group();
        //var group1VR = new THREE.Group();
        //var group2VR = new THREE.Group();

        //group1VR.name = "atomsVR";
        //group2VR.name = "smallatomsVR";

        group1.name = 'atoms';
        group2.name = 'smallatoms';

        //CREATE MESH

        createAtomMesh(SingleGeometry, 'atoms', group1, 'atom');
        createAtomMesh(SingleGeometry2, 'smallatoms', group2, 'atom');
        //createAtomMesh(SingleGeometryVR, "atomsVR", group1VR, "atom");
        //createAtomMesh(SingleGeometry2VR, "smallatomsVR", group2VR, "atom");

        //CREATE MESH FOR AR

        createARMesh(group1, 'atoms', 'atoms');
        createARMesh(group2, 'smallatoms', 'atoms');

        //ADD SCENES

        //CORE.ScenaAtomi1VR.add(group1VR);
        CORE.AtomScene.add(group1);
        //CORE.ScenaAtomi2VR.add(group2VR);
        CORE.SmallAtomScene.add(group2);
    }

    console.log('Drawn atoms: ' + Object.keys(CORE.Atoms).length);
}

function createAtomGeomtry(atoms, type, vr, pool1, pool2, SingleGeometry, SingleGeometry2) {
    //type = ligands , atom, solvents. Vr = true,false

    var valScale = CORE.ATOM_NUM / CORE.CPK_NUM;

    Object.keys(atoms).forEach((serial) => {
        if (atoms[serial] != 'TER') {
            let geometry;
            if (vr) geometry = new THREE.SphereBufferGeometry((CONSTANTS.radiusAlvarez[atoms[serial].elem] || 1.5) * CORE.CPK_NUM, CORE.VR_SEGMENTS, CORE.VR_SEGMENTS);
            else geometry = new THREE.SphereBufferGeometry((CONSTANTS.radiusAlvarez[atoms[serial].elem] || 1.5) * CORE.CPK_NUM, CORE.SPHERE_SEGMENTS, CORE.SPHERE_SEGMENTS);

            let positionHelper = new THREE.Object3D();
            positionHelper.position.set(atoms[serial].pos.x, atoms[serial].pos.y, atoms[serial].pos.z);
            positionHelper.updateWorldMatrix(true, false);

            geometry.applyMatrix4(positionHelper.matrixWorld);
            geometry.userData = {};
            geometry.userData.atom = atoms[serial];

            SingleGeometry.push(geometry);

            //////////////////////////////////////////////////////////////
            //BALL AND STICKS ATOMS/LIGANDS
            //////////////////////////////////////////////////////////////
            if (type == 'atoms' || type == 'ligands') {
                if (vr)
                    geometry = new THREE.SphereBufferGeometry((CONSTANTS.radiusAlvarez[atoms[serial].elem] || 1.5) * CORE.CPK_NUM, CORE.SMALLSPHERE_SEGMENTS, CORE.SMALLSPHERE_SEGMENTS).scale(
                        valScale,
                        valScale,
                        valScale
                    );
                else
                    geometry = new THREE.SphereBufferGeometry((CONSTANTS.radiusAlvarez[atoms[serial].elem] || 1.5) * CORE.CPK_NUM, CORE.SMALLSPHERE_SEGMENTS, CORE.SMALLSPHERE_SEGMENTS).scale(
                        valScale,
                        valScale,
                        valScale
                    );

                geometry.applyMatrix4(positionHelper.matrixWorld);
                geometry.userData = {};
                geometry.userData.atom = atoms[serial];

                SingleGeometry2.push(geometry);
            }
        }
    });
}

function createAtomMesh(SingleGeometry, name, group, type) {
    let mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(SingleGeometry, false);
    var material = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
    let count = SingleGeometry[0].attributes.position.count * SingleGeometry.length;
    let colors = new Float32Array(3 * count);
    let k = 0;
    let faceArray = [];

    let positions = mergedGeometry.attributes.position.array;
    mergedGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    mergedGeometry.userData.atoms = [];
    mergedGeometry.userData.geos = [];
    mergedGeometry.userData.faceArray = [];
    mergedGeometry.computeBoundingSphere();

    for (var i in SingleGeometry) {
        let geo = SingleGeometry[i];
        let c = geo.attributes.position.count;
        let color = new THREE.Color(geo.userData.atom.color);
        mergedGeometry.userData.atoms.push(geo.userData.atom);
        mergedGeometry.userData.geos.push(geo);

        if (name == 'smallatoms') {
            CORE.atomStickArrays[geo.userData.atom.serial.toString()] = {};
            CORE.atomStickArrays[geo.userData.atom.serial.toString()].atoms = [];
        }
        if (name == 'smallatomsL') {
            CORE.atomStickArraysL[geo.userData.atom.serial.toString()] = {};
            CORE.atomStickArraysL[geo.userData.atom.serial.toString()].atoms = [];
        }

        faceArray[geo.userData.atom.serial.toString()] = [];

        for (var j = 0; j < c * 3; j += 3) {
            colors[k + j] = color.r;
            colors[k + j + 1] = color.g;
            colors[k + j + 2] = color.b;

            faceArray[geo.userData.atom.serial.toString()][j] = k + j;
            faceArray[geo.userData.atom.serial.toString()][j + 1] = k + j + 1;
            faceArray[geo.userData.atom.serial.toString()][j + 2] = k + j + 2;

            if (name == 'smallatoms') CORE.atomStickArrays[geo.userData.atom.serial.toString()].atoms.push(k + j, k + j + 1, k + j + 2);
            if (name == 'smallatomsL') {
                CORE.atomStickArraysL[geo.userData.atom.serial.toString()].atoms.push(k + j, k + j + 1, k + j + 2);
            }
        }
        k += c * 3;
    }

    let mesh = new THREE.Mesh(mergedGeometry, material);

    mesh.geometry.userData.faceArray = faceArray;
    mesh.geometry.attributes.color.needsUpdate = true;
    mesh.userData.originalParent = group;
    mesh.userData.type = name;
    mesh.userData.count = SingleGeometry[0].attributes.position.count;
    mesh.userData.numMesh = SingleGeometry.length;

    group.add(mesh);
}

export function renderAtomBonds() {
    CORE.setScene('collegamenti');
    CORE.AtomBondsScene.name = 'collegamenti';

    var SingleGeometry = [];

    createAtomBondsGeometry(CORE.AtomBonds, SingleGeometry, CORE.LINK_NUM);

    if (SingleGeometry.length > 0) {
        var group3 = new THREE.Group();
        group3.name = 'bonds';

        createBondsMesh(SingleGeometry, group3, 'bonds');
        createARMesh(group3, 'bonds', 'atoms');

        CORE.AtomBondsScene.add(group3);
    }

    console.log('Drawn atom bonds: ' + CORE.AtomBonds.length);
}

function renderLigandBonds() {
    CORE.setScene('ligandbonds');
    CORE.LigandBondsScene.name = 'ligandbonds';

    if (CORE.LigandBonds.length > 0) {
        var SingleGeometry = [];
        createAtomBondsGeometry(CORE.LigandBonds, SingleGeometry, CORE.LINK_NUM);
        if (SingleGeometry.length > 0) {
            var group3L = new THREE.Group();
            group3L.name = 'bondsL';

            createBondsMesh(SingleGeometry, group3L, 'bondsL');
            createARMesh(group3L, 'bondsL', 'atoms');

            CORE.LigandBondsScene.add(group3L);
        }
    }

    console.log('Drawn ligand bonds: ' + CORE.LigandBonds.length);
}

function createAtomBondsGeometry(bonds, SingleGeometry, radius) {
    var HALF_PI = Math.PI * 0.5;

    bonds.forEach((Coll) => {
        if (Coll.atom1 /*start*/ == undefined || Coll.atom2 /*end*/ == undefined || Coll.atom1.pos == undefined || Coll.atom2.pos == undefined) {
            console.log('Malformed bond.');
            return;
        }

        let distanza = Coll.atom1.pos.distanceTo(Coll.atom2.pos);
        let pointC = getPointInBetween(Coll.atom1.pos, Coll.atom2.pos);

        let divideScalar2a = Coll.atom1.pos.clone().add(pointC).divideScalar(2);
        let divideScalar2b = Coll.atom2.pos.clone().add(pointC).divideScalar(2);

        let cylinder1 = new THREE.CylinderBufferGeometry(radius, radius, distanza / 2, CORE.CYLINDER_SEGMENTS);
        let cylinder2 = new THREE.CylinderBufferGeometry(radius, radius, distanza / 2, CORE.CYLINDER_SEGMENTS);

        let orientation1 = new THREE.Matrix4(); //a new orientation matrix to offset pivot
        let offsetRotation1 = new THREE.Matrix4(); //a matrix to fix pivot rotation
        let orientation2 = new THREE.Matrix4();
        let offsetRotation2 = new THREE.Matrix4();

        orientation1.lookAt(Coll.atom1.pos, pointC, new THREE.Vector3(0, 1, 0)); //look at destination
        orientation2.lookAt(pointC, Coll.atom2.pos, new THREE.Vector3(0, 1, 0));

        offsetRotation1.makeRotationX(HALF_PI); //rotate 90 degs on X
        orientation1.multiply(offsetRotation1); //combine orientation with rotation transformations
        offsetRotation2.makeRotationX(HALF_PI);
        orientation2.multiply(offsetRotation2);

        orientation1.setPosition(divideScalar2a.x, divideScalar2a.y, divideScalar2a.z);
        orientation2.setPosition(divideScalar2b.x, divideScalar2b.y, divideScalar2b.z);

        cylinder1.applyMatrix4(orientation1);
        cylinder2.applyMatrix4(orientation2);

        cylinder1.userData = {};
        cylinder2.userData = {};

        cylinder1.userData.atom = Coll.atom1;
        cylinder2.userData.atom = Coll.atom2;

        SingleGeometry.push(cylinder1);
        SingleGeometry.push(cylinder2);
    });
}

function createBondsMesh(SingleGeometry, group, name) {
    if (SingleGeometry.length > 0) {
        let mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(SingleGeometry, false);
        var material = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
        let count = SingleGeometry[0].attributes.position.count * SingleGeometry.length;
        let colors = new Float32Array(3 * count);
        let k = 0;
        let faceArray = [];

        mergedGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        mergedGeometry.userData.atoms = [];
        mergedGeometry.userData.geos = [];
        mergedGeometry.computeBoundingSphere();

        for (var i in SingleGeometry) {
            let geo = SingleGeometry[i];
            let atom = geo.userData.atom;
            let c = geo.attributes.position.count;
            let color = new THREE.Color(atom.color);
            mergedGeometry.userData.atoms.push(atom);
            mergedGeometry.userData.geos.push(geo);

            if (name == 'bondsL') {
                if (!CORE.atomStickArraysL[atom.serial]) {
                    CORE.atomStickArraysL[atom.serial] = {}; //some bonds connect atoms to ligands
                }
                if (!CORE.atomStickArraysL[atom.serial].bonds) {
                    CORE.atomStickArraysL[atom.serial].bonds = [];
                }
            } else if (name == 'bonds') {
                if (!CORE.atomStickArrays[atom.serial].bonds) {
                    CORE.atomStickArrays[atom.serial].bonds = [];
                }
            } else {
                //wireframe
                if (!faceArray[atom.serial.toString()]) {
                    faceArray[atom.serial.toString()] = [];
                }
            }

            for (var j = 0; j < c * 3; j += 3) {
                colors[k + j] = color.r;
                colors[k + j + 1] = color.g;
                colors[k + j + 2] = color.b;

                if (name == 'bondsL') {
                    CORE.atomStickArraysL[atom.serial].bonds.push(k + j, k + j + 1, k + j + 2);
                } else if (name == 'bonds') {
                    CORE.atomStickArrays[atom.serial].bonds.push(k + j, k + j + 1, k + j + 2);
                } else {
                    faceArray[atom.serial.toString()].push(k + j, k + j + 1, k + j + 2);
                }
            }
            k += c * 3;
        }

        let mesh = new THREE.Mesh(mergedGeometry, material);

        mesh.geometry.attributes.color.needsUpdate = true;
        if (name == 'wireframe') {
            mesh.geometry.userData.faceArray = faceArray;
        }
        mesh.userData.originalParent = group;
        mesh.userData.type = name;
        mesh.userData.count = SingleGeometry[0].attributes.position.count;
        mesh.userData.numMesh = SingleGeometry.length;

        group.add(mesh);
    }
}

function createLineGeometry(bonds, SingleGeometry) {
    bonds.forEach((Coll) => {
        if (Coll.atom1 /*start*/ == undefined || Coll.atom2 /*end*/ == undefined || Coll.atom1.pos == undefined || Coll.atom2.pos == undefined) {
            console.log('Malformed bond.');
            return;
        }

        let pointC = getPointInBetween(Coll.atom1.pos, Coll.atom2.pos);

        let line1 = new THREE.BufferGeometry().setFromPoints([Coll.atom1.pos, pointC]);
        let line2 = new THREE.BufferGeometry().setFromPoints([Coll.atom2.pos, pointC]);

        line1.userData = {};
        line2.userData = {};

        line1.userData.atom = Coll.atom1;
        line2.userData.atom = Coll.atom2;

        SingleGeometry.push(line1);
        SingleGeometry.push(line2);
    });
}

function createLineMesh(SingleGeometry, group, name) {
    if (SingleGeometry.length > 0) {
        let mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(SingleGeometry, false);
        var material = new THREE.LineBasicMaterial({ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
        let count = SingleGeometry[0].attributes.position.count * SingleGeometry.length;
        let colors = new Float32Array(3 * count);
        let k = 0;
        let faceArray = [];
        let positions = mergedGeometry.attributes.position.array;

        mergedGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        mergedGeometry.userData.atoms = [];
        mergedGeometry.userData.geos = [];
        mergedGeometry.computeBoundingSphere();

        for (var i in SingleGeometry) {
            let geo = SingleGeometry[i];
            let atom = geo.userData.atom;
            let c = geo.attributes.position.count;
            let color = new THREE.Color(atom.color);
            mergedGeometry.userData.atoms.push(atom);
            mergedGeometry.userData.geos.push(geo);

            if (!faceArray[atom.serial.toString()]) faceArray[atom.serial.toString()] = [];

            for (var j = 0; j < c * 3; j += 3) {
                colors[k + j] = color.r;
                colors[k + j + 1] = color.g;
                colors[k + j + 2] = color.b;

                faceArray[atom.serial.toString()].push(k + j, k + j + 1, k + j + 2);
            }
            k += c * 3;
        }

        let mesh = new THREE.LineSegments(mergedGeometry, material);

        mesh.geometry.attributes.color.needsUpdate = true;
        if (name == 'wireframe') mesh.geometry.userData.faceArray = faceArray;
        mesh.userData.originalParent = group;
        mesh.userData.type = name;
        mesh.userData.count = SingleGeometry[0].attributes.position.count;
        mesh.userData.numMesh = SingleGeometry.length;

        group.add(mesh);
    }
}

export function renderWireFrame() {
    CORE.setScene('scenaWireframe');
    CORE.WireframeScene.name = 'scenaWireframe';

    var SingleGeometry = [];

    createLineGeometry(CORE.AtomBonds, SingleGeometry);

    if (SingleGeometry.length > 0) {
        var group = new THREE.Group();
        group.name = 'wireframe';
        createLineMesh(SingleGeometry, group, 'wireframe');
        createARMesh(group, 'wireframe', 'line');

        CORE.WireframeScene.add(group);
    }
}

//renders secondary structures: helixes, sheets, loops and nucleic acid strands and polygons
function renderSecondary() {
    CORE.setScene('scenaSecondary');
    CORE.SecondaryStructureScene.name = 'scenaSecondary';

    var GroupVector = new THREE.Group(),
        secondary = new THREE.Group();
    secondary.name = 'secondary';
    var SingleGeometry = [];
    // for index, helix index, sheet index
    var i = 0,
        j = 0,
        k = 0;
    var max = 0,
        prec = -5;

    ///////////////////////////////////////////////////////////////////////////
    //OBTAINING HELIX, SHEET, AND LOOP CORDINATES
    ///////////////////////////////////////////////////////////////////////////

    //questo va solo se Helix e Sheet sono ordinati sul campo Res seq e Chain ID
    while (i < CORE.Backbone.length) {
        var currentAtom = null,
            currentLoops = [],
            currentSheets = [],
            currentHelixes = [];

        if (CORE.Backbone[i] == 'TER') {
            i++;
            continue;
        }

        let colorsHelix = [];
        let colorsSheet = [];
        let colorsLoop = [];

        let first = i;
        let seq = CORE.Backbone[i].resSeq;
        let chainId = CORE.Backbone[i].chainId;
        let Vector = [],
            where;
        max = max > i ? max : i;

        if (CORE.Helix[j] && seq == CORE.Helix[j].start && chainId == CORE.Helix[j].startChainId) {
            for (; CORE.Backbone[i].resSeq <= CORE.Helix[j].end; i++) {
                Vector.push(CORE.Backbone[i].pos.clone());
                colorsHelix.push(CORE.Backbone[i].color);
                currentHelixes.push(CORE.Backbone[i]);
                CORE.Helixes.push(CORE.Backbone[i]);
            }
            currentAtom = CORE.Backbone[i - 1];
            j++;
            i--;
            where = 'helix';
        } else if (CORE.Sheet[k] && seq == CORE.Sheet[k].start && chainId == CORE.Sheet[k].startChainId) {
            for (; CORE.Backbone[i].resSeq <= CORE.Sheet[k].end; i++) {
                Vector.push(CORE.Backbone[i].pos.clone());
                colorsSheet.push(CORE.Backbone[i].color);
                currentSheets.push(CORE.Backbone[i]);
                CORE.Sheets.push(CORE.Backbone[i]);
            }
            currentAtom = CORE.Backbone[i - 1];
            k++;
            i--;
            where = 'sheet';
        } else {
            for (
                ;
                (CORE.Sheet[k] == undefined || !(CORE.Backbone[i].resSeq == CORE.Sheet[k].start + 1 && CORE.Backbone[i].chainId == CORE.Sheet[k].startChainId)) &&
                (CORE.Helix[j] == undefined || !(CORE.Backbone[i].resSeq == CORE.Helix[j].start + 1 && CORE.Backbone[i].chainId == CORE.Helix[j].startChainId));
                i++
            ) {
                if (CORE.Backbone[i] != 'TER') {
                    if ((CORE.Backbone[i + 1] && CORE.Backbone[i + 1] != 'TER' && euclideanDistance(CORE.Backbone[i].pos, CORE.Backbone[i + 1].pos) < 4) || CORE.Backbone[i + 1] == 'TER') {
                        //this number ensures that no loop are drawn between far atoms

                        Vector.push(CORE.Backbone[i].pos.clone());
                        colorsLoop.push(CORE.Backbone[i].color);
                        currentLoops.push(CORE.Backbone[i]);
                    } else {
                        i = i + 2; //credo!!
                        break;
                    }
                    //CORE.Loops.push(CORE.Backbone[i]);
                    //this is wrong because some atoms are both in Loops and Sheets: typically starting and ending atoms of ribbons
                } else {
                    i = i + 2;
                    break;
                }
            }
            currentAtom = CORE.Backbone[i - 2];
            i--;
            where = 'loop';
        }

        if (Vector.length < 2) {
            //if per meccanismo anti loop, questo potrebbe succedere quando la struttura secondaria
            //ha inizio o fine in un etereoatomo che in questo programma non sono presi in considerazione
            if (prec == i) i = max + 1;
            else prec = i;
            continue;
        }

        ///////////////////////////////////////////////////////////////////////////
        //DRAW HELIX, SHEET AND LOOP
        ///////////////////////////////////////////////////////////////////////////
        var curve = new THREE.CatmullRomCurve3(Vector, false, 'chordal', 0.1);
        var pointsCount = Vector.length * 7;
        var pointsCount1 = pointsCount + 1;
        let startHead = Math.floor(pointsCount / Vector.length);
        let endHead = pointsCount - startHead;

        switch (where) {
            case 'loop':
                drawLoop();
                break;
            case 'sheet':
                drawSheet();
                break;
            case 'helix':
                drawHelix();
                break;
        }
        //  NEW VERSION -> NOT WORKING
        ////////////////////////////////////////////////////////////////////////////
        /*    let Vector = [];
            var curve;
            var pointsCount;
            var pointsCount1;
            let startHead;
            let endHead;
        
        
            let colorsHelix = [], colorsSheet = [], colorsLoop = [];
            let currentLoops = [], currentSheets = [], currentHelixes = [];
            let chainId, first;
        
            for ( let h in CORE.Helix ){
                CORE.Helix[h].positions.forEach( (p) => Vector.push( p.clone() ));
                curve = new THREE.CatmullRomCurve3(Vector, false, "chordal", 0.1);
                pointsCount = Vector.length*7;
                pointsCount1 = pointsCount+1;
                startHead =  Math.floor(pointsCount/Vector.length);
                endHead = pointsCount-startHead;
                
                colorsHelix = CORE.Helix[h].colors;
                currentHelixes = CORE.Helix[h].atoms;
                chainId = CORE.Helix[h].startChainId;
                
                drawHelix();
                Vector = [];
            }
        
            for ( let h in CORE.Sheet ){
                CORE.Sheet[h].positions.forEach( (p) => Vector.push( p.clone() ));
                curve = new THREE.CatmullRomCurve3(Vector, false, "chordal", 0.1);
                pointsCount = Vector.length*7;
                pointsCount1 = pointsCount+1;
                startHead =  Math.floor(pointsCount/Vector.length);
                endHead = pointsCount-startHead;
                
                colorsSheet = CORE.Sheet[h].colors;
                currentSheets = CORE.Sheet[h].atoms;
                chainId = CORE.Sheet[h].startChainId;
                first = 0;
                
                drawSheet();
                Vector = [];
            }
        
            
        
            for ( let h in CORE.Loop ){
                CORE.Loop[h].positions.forEach( (p) => Vector.push( p.clone() ));
                curve = new THREE.CatmullRomCurve3(Vector, false, "chordal", 0.1);
                pointsCount = Vector.length*7;
                pointsCount1 = pointsCount+1;
                startHead =  Math.floor(pointsCount/Vector.length);
                endHead = pointsCount-startHead;
                
                colorsLoop = CORE.Loop[h].colors;
                currentLoops = CORE.Loop[h].atoms;
                chainId = CORE.Loop[h].startChainId;
                
                drawLoop();
                Vector = [];
            }*/
        ///////////////////////////////////////////////////////////////////////

        function drawLoop() {
            //end caps for the tube--> not working
            /*var material1 = new THREE.MeshPhongMaterial({ color: colorsLoop[0] });
            var material2 = new THREE.MeshPhongMaterial({ color: colorsLoop[colorsLoop.length - 1]});
            material1.side = THREE.DoubleSide;
            material2.side = THREE.DoubleSide;
            
            var startcapgeom = new THREE.SphereBufferGeometry( 0.2, 16, 16 );
            var circlestart = new THREE.Mesh( startcapgeom, material1 );
            circlestart.position.copy( curve.getPoint(0) );           
            var endcapgeom = new THREE.SphereBufferGeometry( 0.2, 16, 16 );
            var circleend = new THREE.Mesh( endcapgeom, material2 );
            circleend.position.copy( curve.getPoint(1) );*/

            var mesh = drawSmoothTubeBufferGeomtry(curve.getPoints(colorsLoop.length), colorsLoop, currentLoops);
            //var mesh = drawSmoothTube(curve.getPoints(colorsLoop.length), colorsLoop, currentLoops );

            mesh.userData.originalParent = secondary;
            mesh.userData.type = 'loops';
            mesh.userData.chainId = currentAtom.chainId;
            //mesh.userData.chainId = chainId;
            mesh.userData.backbone = currentLoops;
            mesh.geometry.userData.backbone = currentLoops;

            //mesh.userData.count = mesh.geometry.attributes.color.count;
            //mesh.userData.numMesh = 1;

            secondary.add(mesh);
            //secondary.add(circlestart);
            //secondary.add(circleend);
        }

        function drawSheet() {
            pointsCount = Vector.length * 17;
            pointsCount1 = pointsCount + 1;

            startHead /= 1.0;
            endHead = pointsCount - startHead;
            let endHeadPlus = endHead + startHead / 2;

            let SeconVector = [];
            Vector.forEach((p) => SeconVector.push(p.clone()));

            let firstRight = first,
                reverse = 0.6; //width of sheet
            Vector.forEach(planeSheet);

            (firstRight = first), (reverse = -reverse);
            SeconVector.forEach(planeSheet);

            function planeSheet(p, index) {
                let oxyRight = CORE.Backbone[firstRight].chainId.toString() + CORE.Backbone[firstRight++].resSeq.toString();
                //new version -> not working
                //let oxyRight = 	currentSheets[ firstRight ].chainId.toString() + currentSheets[ firstRight++ ].resSeq.toString() ;

                let appo = CORE.Oxigen[oxyRight].clone().add(p.clone().multiplyScalar(-1));

                if (index % 2 == 0) p.add(appo.multiplyScalar(reverse));
                else p.add(appo.multiplyScalar(-reverse));
            }

            curve = new THREE.CatmullRomCurve3(Vector, false, 'chordal');
            let curve2 = new THREE.CatmullRomCurve3(SeconVector, false, 'chordal');

            let pts = curve.getPoints(pointsCount);
            let pts2 = curve2.getPoints(pointsCount);

            //////////////////////////////////////////////////////////////////////////////
            //DRAW ARROW OF THE SHEET
            ///////////////////////////////////////////////////////////////////////////////
            for (var l = Math.floor(endHead) + 1; l < pts.length; l++)
                if (l > endHead && l < endHeadPlus) {
                    let vect = pts2[l].clone().add(pts[l].clone().multiplyScalar(-1));
                    vect.multiplyScalar(-0.45);
                    pts[l].add(vect.clone().multiplyScalar((endHeadPlus - l) / (startHead / 2)));
                    vect.multiplyScalar(-1);
                    pts2[l].add(vect.clone().multiplyScalar((endHeadPlus - l) / (startHead / 2)));
                } else if (l > endHeadPlus) {
                    let vect = pts2[l].clone().add(pts[l].clone().multiplyScalar(-1));
                    vect.multiplyScalar(0.5);
                    pts[l].add(vect.clone().multiplyScalar((l - endHeadPlus) / (startHead / 2)));
                    vect.multiplyScalar(-1);
                    pts2[l].add(vect.clone().multiplyScalar((l - endHeadPlus) / (startHead / 2)));
                }

            pts = pts.concat(pts2);

            var p1 = pts.slice(0, pts2.length);

            var temp1 = new THREE.CatmullRomCurve3(p1, false, 'chordal', 0.1);
            var temp2 = new THREE.CatmullRomCurve3(pts2, false, 'chordal', 0.1);
            var points1 = temp1.getPoints(colorsSheet.length);
            var points2 = temp2.getPoints(colorsSheet.length);

            var mesh = drawStripBufferGeomtry(p1, pts2, colorsSheet, currentSheets, 0.2);

            mesh.userData.originalParent = secondary;
            mesh.userData.type = 'sheet';
            mesh.userData.chainId = currentAtom.chainId;
            mesh.userData.backbone = currentSheets;
            mesh.userData.count = mesh.geometry.attributes.color.count;
            mesh.userData.numMesh = 1;
            mesh.geometry.userData.backbone = currentSheets;

            secondary.add(mesh);
        }

        function drawHelix() {
            var direction = Vector[Vector.length - 1].clone().add(Vector[0].clone().multiplyScalar(-1));
            direction.divideScalar(Vector.length * 1.25);

            let pts = curve.getPoints(pointsCount);
            let pts2 = curve.getPoints(pointsCount);

            pts2.forEach(planeHelix);
            direction.multiplyScalar(-1);
            pts.forEach(planeHelix);

            function planeHelix(p, index, arr) {
                if (index < startHead - 1) p.add(direction.clone().multiplyScalar((index + 1) / startHead));
                else if (index > endHead) p.add(direction.clone().multiplyScalar((arr.length - index) / startHead));
                else p.add(direction);
            }

            pts = pts.concat(pts2);

            var p1 = pts.slice(0, pts2.length);

            //questo serve per ottenere solo un numero limitato di punti da
            //passare a drawStrip. Non posso avere più punti di
            //colorsHelix.length altrimenti si colora male
            var temp1 = new THREE.CatmullRomCurve3(p1, false, 'chordal', 0.1);
            var temp2 = new THREE.CatmullRomCurve3(pts2, false, 'chordal', 0.1);

            var mesh = drawStripBufferGeomtry(p1, pts2, colorsHelix, currentHelixes, 0.2);

            mesh.userData.originalParent = secondary;
            mesh.userData.type = 'helix';
            mesh.userData.chainId = currentAtom.chainId;
            mesh.userData.backbone = currentHelixes;
            mesh.geometry.userData.backbone = currentHelixes;
            mesh.userData.numMesh = 1;

            secondary.add(mesh);
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    // DRAWS DNA and RNA MESHS
    ///////////////////////////////////////////////////////////////////////////
    drawNucleicAcidStrand(CORE.RNABackbone);
    drawNucleicAcidStrand(CORE.DNABackbone);
    let geos1 = drawNucleicAcidBaseStickGeometry(CORE.RNAatoms);
    let geos2 = drawNucleicAcidBaseStickGeometry(CORE.DNAatoms);
    if (geos1.length > 0) drawNucleicAcidBaseStickMesh(geos1, 'RNA');
    if (geos2.length > 0) drawNucleicAcidBaseStickMesh(geos2, 'DNA');
    if (CORE.RNAatoms.length > 0) drawNucleicAcidBasePolygon(CORE.RNAatoms, 'RNA');
    if (CORE.DNAatoms.length > 0) drawNucleicAcidBasePolygon(CORE.DNAatoms, 'DNA');

    function drawNucleicAcidStrand(backbone) {
        let lastChainID, currentChainID;
        let pts = [],
            colorsRNA = [];
        let num = 2;
        let currBackbone = [];

        if (backbone.length > 0) {
            currentChainID = backbone[0].chainId;

            for (var i = 0; i < backbone.length; i++) {
                var currAtom = backbone[i];
                lastChainID = currentChainID;
                currentChainID = backbone[i].chainId;

                if (currentChainID != lastChainID || i == backbone.length - 1) {
                    if (i == backbone.length - 1) {
                        //last atom of backbone
                        pts.push(currAtom.pos.clone());
                        colorsRNA.push(currAtom.color);
                        currBackbone.push(currAtom);
                    }

                    var curve = new THREE.CatmullRomCurve3(pts, false, 'chordal', 0.1);
                    var pointsCount = pts.length * 7;
                    let startHead = Math.floor(pointsCount / pts.length);
                    let endHead = pointsCount - startHead;

                    var direction = pts[pts.length - 1].clone().add(pts[0].clone().multiplyScalar(-1));

                    //direction.divideScalar(pts.length * 1.15);
                    direction.divideScalar(20);

                    let pts1 = curve.getPoints(pointsCount);
                    let pts2 = curve.getPoints(pointsCount);

                    pts2.forEach(planeHelix);

                    direction.multiplyScalar(-1);
                    pts1.forEach(planeHelix);

                    function planeHelix(p, index, arr) {
                        if (index < startHead - 1) p.add(direction.clone().multiplyScalar((index + 1) / startHead));
                        else if (index > endHead) p.add(direction.clone().multiplyScalar((arr.length - index) / startHead));
                        else p.add(direction);
                    }

                    let mesh = drawStripBufferGeomtry(pts1, pts2, colorsRNA, currBackbone, 0.3);
                    mesh.userData.originalParent = secondary;
                    mesh.userData.type = 'nucleicAcid';
                    mesh.userData.chainId = currentChainID;
                    mesh.userData.backbone = currBackbone;
                    mesh.geometry.userData.backbone = currBackbone;

                    secondary.add(mesh);
                    colorsRNA = [];
                    pts = [];
                    currBackbone = [];
                }
                currBackbone.push(currAtom);
                pts.push(currAtom.pos.clone());
                colorsRNA.push(currAtom.color);
            }
        }
    }

    //creates TubesGeometries which connects nucleic acid strand to nucleotide bases of DNA and RNA
    function drawNucleicAcidBaseStickGeometry(atoms) {
        var start = null,
            end = null;
        var geometries = [];
        let atom;
        let HALF_PI = Math.PI * 0.5;
        var lastChainId, currChainId;

        for (var i in atoms) {
            // 03' link to N1 (C,U,T) or N9(A,G)
            if (start != null && end != null) {
                let distanza = start.pos.distanceTo(end.pos);
                let pointC = getPointInBetween(start.pos, end.pos);
                let divideScalar2a = start.pos.clone().add(pointC).divideScalar(2);
                let divideScalar2b = end.pos.clone().add(pointC).divideScalar(2);

                let cylinder1 = new THREE.CylinderBufferGeometry(CORE.LINK_NUM, CORE.LINK_NUM, distanza / 2, CORE.CYLINDER_SEGMENTS);
                let cylinder2 = new THREE.CylinderBufferGeometry(CORE.LINK_NUM, CORE.LINK_NUM, distanza / 2, CORE.CYLINDER_SEGMENTS);

                let orientation1 = new THREE.Matrix4();
                let offsetRotation1 = new THREE.Matrix4();
                let orientation2 = new THREE.Matrix4();
                let offsetRotation2 = new THREE.Matrix4();

                orientation1.lookAt(start.pos, pointC, new THREE.Vector3(0, 1, 0));
                orientation2.lookAt(pointC, end.pos, new THREE.Vector3(0, 1, 0));

                offsetRotation1.makeRotationX(HALF_PI);
                orientation1.multiply(offsetRotation1);
                offsetRotation2.makeRotationX(HALF_PI);
                orientation2.multiply(offsetRotation2);

                orientation1.setPosition(divideScalar2a.x, divideScalar2a.y, divideScalar2a.z);
                orientation2.setPosition(divideScalar2b.x, divideScalar2b.y, divideScalar2b.z);

                cylinder1.applyMatrix4(orientation1);
                cylinder2.applyMatrix4(orientation2);

                cylinder1.userData = {};
                cylinder2.userData = {};

                cylinder1.userData.atom = start;
                cylinder2.userData.atom = end;

                cylinder1.deleteAttribute('uv');
                cylinder2.deleteAttribute('uv');

                geometries.push(cylinder1);
                geometries.push(cylinder2);

                start = null;
                end = null;
            }

            atom = atoms[i];

            currChainId = atom.chainId;
            //sometimes, 03' and N9 are missing
            if (currChainId != lastChainId) {
                start = null;
                end = null;
            }
            lastChainId = currChainId;

            if (atom.name == "O3'") start = atom;
            if (atom.resName == 'A' || atom.resName == 'G' || atom.resName == 'DA' || atom.resName == 'DG') {
                if (atom.name == 'N1') end = atom; //  N1(AG), N3 or N9(CTU)
            } else if (atom.name == 'N3' || atom.name == 'N9') {
                end = atom;
            }
        }

        return geometries;
    }

    function drawNucleicAcidBaseStickMesh(geometries, type) {
        let mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
        //var material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, vertexColors : THREE.VertexColors });
        var material = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
        let count = geometries[0].attributes.position.count * geometries.length;
        let colors = new Float32Array(3 * count);
        let k = 0,
            nucleicIndex = geometries[0].userData.atom.resSeq + '' + geometries[0].userData.atom.chainId;
        CORE.nucleicArrays[nucleicIndex].stick = [];
        let currRes,
            prevRes = geometries[0].userData.atom.resSeq;
        let faceArray = [];
        let positions = mergedGeometry.attributes.position.array;

        mergedGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        mergedGeometry.userData.atoms = [];
        mergedGeometry.userData.geos = [];
        mergedGeometry.computeBoundingSphere();

        for (var i in geometries) {
            let geo = geometries[i];
            let atom = geo.userData.atom;
            let c = geo.attributes.position.count;
            let color = new THREE.Color(atom.color);
            mergedGeometry.userData.atoms.push(atom);
            mergedGeometry.userData.geos.push(geo);
            currRes = atom.resSeq;
            if (currRes != prevRes) {
                nucleicIndex = geometries[i].userData.atom.resSeq + '' + geometries[i].userData.atom.chainId;
                console.log(nucleicIndex + ' ' + i);
                if (CORE.nucleicArrays[nucleicIndex] == undefined) console.log('found!');
                CORE.nucleicArrays[nucleicIndex].stick = [];
            }

            for (var j = 0; j < c * 3; j += 3) {
                colors[k + j] = color.r;
                colors[k + j + 1] = color.g;
                colors[k + j + 2] = color.b;

                CORE.nucleicArrays[nucleicIndex].stick.push(k + j, k + j + 1, k + j + 2);
            }
            k += c * 3;
            prevRes = currRes;
        }
        let mesh = new THREE.Mesh(mergedGeometry, material);

        mesh.geometry.attributes.color.needsUpdate = true;
        mesh.geometry.userData.faceArray = faceArray;
        mesh.userData.originalParent = secondary;
        mesh.userData.type = 'basestick' + type;
        mesh.userData.count = geometries[0].attributes.position.count;
        mesh.userData.numMesh = geometries.length;

        secondary.add(mesh);
    }

    function drawNucleicAcidBasePolygon(atoms, type) {
        //DNA and RNA atoms

        var currNucleotides;
        var temp = [],
            nucleotideAtoms = [];
        var parsingOrderAG = ['N9', 'C8', 'N7', 'C5', 'C6', 'N1', 'C2', 'N3', 'C4'];
        var parsingOrderCTU = ['N1', 'C2', 'N3', 'C4', 'C5', 'C6'];

        var drawOrderAG = ['N9', 'C8', 'N7', 'C5', 'C6', 'N1', 'C2', 'N3', 'C4'];
        var drawOrderCTU = ['N1', 'C6', 'C5', 'C4', 'N3', 'C2'];
        var p = 0;
        var geometries = [];

        //nucleotides A,G:
        //N9,C8,N7,C5,C4 primo pentagono a dx
        //N3,C4,C5,C6,N1,C2 primo esagono a sx

        //nucleotides C,U,T:
        //N1,C6,C5,C4,N3,C2 esagono

        //N1(AG), N3(CTU)
        for (var i in atoms) {
            //sometimes O3' and N9 atoms are missing
            if (CORE.nucleicArrays[atoms[i].resSeq + '' + atoms[i].chainId]) {
                if ((atoms[i].resName == 'A' || atoms[i].resName == 'G' || atoms[i].resName == 'DA' || atoms[i].resName == 'DG') && atoms[i].name == parsingOrderAG[p]) {
                    temp.push(atoms[i]);
                    p++;

                    if (p == parsingOrderAG.length) {
                        //order atoms counterclockwise
                        for (let j = 0; j < drawOrderAG.length; j++) {
                            let index = temp.findIndex((k) => k.name == drawOrderAG[j]);
                            nucleotideAtoms[j] = temp[index];
                        }

                        let geo = createPolygonGeometry(nucleotideAtoms, true, 0.2);
                        geometries.push(geo);
                        temp = [];
                        nucleotideAtoms = [];
                        p = 0;
                    }
                } else if (
                    (atoms[i].resName == 'C' || atoms[i].resName == 'T' || atoms[i].resName == 'U' || atoms[i].resName == 'DC' || atoms[i].resName == 'DT' || atoms[i].resName == 'DU') &&
                    atoms[i].name == parsingOrderCTU[p]
                ) {
                    temp.push(atoms[i]);
                    p++;

                    if (p == parsingOrderCTU.length) {
                        //order atoms counterclockwise
                        for (let j = 0; j < drawOrderCTU.length; j++) {
                            let index = temp.findIndex((k) => k.name == drawOrderCTU[j]);
                            nucleotideAtoms[j] = temp[index];
                        }

                        let geo = createPolygonGeometry(nucleotideAtoms, false, 0.3);
                        geometries.push(geo);
                        temp = [];
                        nucleotideAtoms = [];
                        p = 0;
                    }
                }
            }
        }
        //create unique mesh from all geometries
        createPolygonMesh(geometries, type);
    }

    //creates polygon which represents nucleotides bases of DNA and RNA
    function createPolygonGeometry(atoms, flag, thickness) {
        var positions = [];
        var colors = [];
        var index = [];

        //TODO residue color or elem color?
        let color = new THREE.Color(CONSTANTS.color[atoms[0].elem]);

        let newpos;
        for (var i in atoms) {
            positions.push(atoms[i].pos.x);
            positions.push(atoms[i].pos.y);
            positions.push(atoms[i].pos.z);

            //create new points for thickness
            var toNext = atoms[mod(i + 1, atoms.length)].pos.clone().sub(atoms[i].pos);
            var toSide = atoms[mod(i - 1, atoms.length)].pos.clone().sub(atoms[i].pos);
            var axis = toSide.cross(toNext).normalize().multiplyScalar(thickness);
            if ((i == 3 || i == 8) && (atoms[i].resName == 'A' || atoms[i].resName == 'G' || atoms[i].resName == 'DA' || atoms[i].resName == 'DG')) {
                axis = new THREE.Vector3(-axis.x, -axis.y, -axis.z);
            }

            newpos = atoms[i].pos.clone().add(axis);

            positions.push(newpos.x);
            positions.push(newpos.y);
            positions.push(newpos.z);
        }
        let center1, center2, center1bis, center2bis;
        let center1pos, center2pos, center1bispos, center2bispos;

        if (!flag) {
            center1 = getPointInBetween(atoms[0].pos, atoms[3].pos);
            center1bis = getPointInBetween(new THREE.Vector3(positions[3], positions[4], positions[5]), new THREE.Vector3(positions[21], positions[22], positions[23]));

            positions.push(center1.x);
            positions.push(center1.y);
            positions.push(center1.z);
            center1pos = (positions.length - 1 * 3) / 3;

            positions.push(center1bis.x);
            positions.push(center1bis.y);
            positions.push(center1bis.z);
            center1bispos = (positions.length - 1 * 3) / 3;
        } else {
            let tmp = getPointInBetween(atoms[0].pos, atoms[8].pos);
            center1 = getPointInBetween(atoms[2].pos, tmp);
            center2 = getPointInBetween(atoms[4].pos, atoms[7].pos);

            tmp = getPointInBetween(new THREE.Vector3(positions[3], positions[4], positions[5]), new THREE.Vector3(positions[45], positions[46], positions[47]));
            center1bis = getPointInBetween(new THREE.Vector3(positions[9], positions[10], positions[11]), tmp);
            center2bis = getPointInBetween(new THREE.Vector3(positions[27], positions[28], positions[29]), new THREE.Vector3(positions[42], positions[43], positions[44]));

            positions.push(center1.x);
            positions.push(center1.y);
            positions.push(center1.z);
            center1pos = (positions.length - 1 * 3) / 3;

            positions.push(center2.x);
            positions.push(center2.y);
            positions.push(center2.z);
            center2pos = (positions.length - 1 * 3) / 3;

            positions.push(center1bis.x);
            positions.push(center1bis.y);
            positions.push(center1bis.z);
            center1bispos = (positions.length - 1 * 3) / 3;

            positions.push(center2bis.x);
            positions.push(center2bis.y);
            positions.push(center2bis.z);
            center2bispos = (positions.length - 1 * 3) / 3;
        }

        if (flag) {
            //double polygon AG

            // bottom hexagon faces
            for (let k = 0; k < 6; k += 2) {
                index.push(k);
                index.push(k + 2);
                index.push(center1pos);

                colors.push(color.r);
                colors.push(color.g);
                colors.push(color.b);
            }

            index.push(6);
            index.push(16);
            index.push(center1pos);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            index.push(16);
            index.push(0);
            index.push(center1pos);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            for (let k = 6; k < 16; k += 2) {
                index.push(k);
                index.push(k + 2);
                index.push(center2pos);

                colors.push(color.r);
                colors.push(color.g);
                colors.push(color.b);
            }

            index.push(16);
            index.push(6);
            index.push(center2pos);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            //border faces

            for (let k = 0; k < 14; k += 2) {
                index.push(k);
                index.push(k + 3);
                index.push(k + 1);

                colors.push(color.r);
                colors.push(color.g);
                colors.push(color.b);

                index.push(k);
                index.push(k + 2);
                index.push(k + 3);

                colors.push(color.r);
                colors.push(color.g);
                colors.push(color.b);
            }
            index.push(17);
            index.push(16);
            index.push(1);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            index.push(1);
            index.push(16);
            index.push(0);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            //top hexagon faces
            for (let k = 1; k < 7; k += 2) {
                index.push(k);
                index.push(k + 2);
                index.push(center1bispos);

                colors.push(color.r);
                colors.push(color.g);
                colors.push(color.b);
            }

            index.push(7);
            index.push(17);
            index.push(center1bispos);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            index.push(17);
            index.push(1);
            index.push(center1bispos);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            for (let k = 7; k < 17; k += 2) {
                index.push(k);
                index.push(k + 2);
                index.push(center2bispos);

                colors.push(color.r);
                colors.push(color.g);
                colors.push(color.b);
            }

            index.push(17);
            index.push(7);
            index.push(center2bispos);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);
        } else {
            //single polygon CTU

            // bottom hexagon faces
            for (let k = 0; k < 10; k += 2) {
                index.push(k);
                index.push(k + 2);
                index.push(center1pos);

                colors.push(color.r);
                colors.push(color.g);
                colors.push(color.b);
            }
            index.push(10);
            index.push(0);
            index.push(center1pos);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            //border faces
            for (let k = 0; k < 10; k += 2) {
                index.push(k);
                index.push(k + 3);
                index.push(k + 1);

                colors.push(color.r);
                colors.push(color.g);
                colors.push(color.b);

                index.push(k);
                index.push(k + 2);
                index.push(k + 3);

                colors.push(color.r);
                colors.push(color.g);
                colors.push(color.b);
            }
            index.push(10);
            index.push(11);
            index.push(1);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            index.push(10);
            index.push(1);
            index.push(0);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            //top hexagon faces
            for (let k = 1; k < 11; k += 2) {
                index.push(k);
                index.push(k + 2);
                index.push(center1bispos);

                colors.push(color.r);
                colors.push(color.g);
                colors.push(color.b);
            }
            index.push(11);
            index.push(1);
            index.push(center1bispos);

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);
        }

        var geo = new THREE.BufferGeometry();
        let poss = new Float32Array(positions);
        let cols = new Float32Array(colors);
        let idxs = new Uint32Array(index);

        geo.setAttribute('position', new THREE.BufferAttribute(poss, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
        geo.setIndex(new THREE.BufferAttribute(idxs, 1));
        geo.computeBoundingSphere();
        geo.computeVertexNormals();
        geo.attributes.color.needsUpdate = true;
        geo.index.needsUpdate = true;
        geo.attributes.position.needsUpdate = true;

        geo.userData.color = color;
        geo.userData.nucleotide = atoms[0].resName;
        geo.userData.atom = atoms[0];
        geo.userData.count = positions.length / 3;

        return geo;
    }

    function createPolygonMesh(geometries, type) {
        let mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
        var material = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });

        let count = geometries[0].attributes.color.count * geometries.length;
        let colors = new Float32Array(3 * count);
        let k = 0,
            nucleicIndex = geometries[0].userData.atom.resSeq + '' + geometries[0].userData.atom.chainId;
        //let faceArray = [];
        let positions = mergedGeometry.attributes.position.array;

        mergedGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        mergedGeometry.userData.atoms = [];
        mergedGeometry.userData.geos = [];
        //mergedGeometry.userData.faceArray = [];
        mergedGeometry.computeBoundingSphere();

        for (var i in geometries) {
            let geo = geometries[i];
            let c = geo.attributes.position.count;
            let color = geo.userData.color;

            //mergedGeometry.userData.atoms[i] = [];
            mergedGeometry.userData.atoms[i] = geo.userData.atom;
            mergedGeometry.userData.geos.push(geo);
            nucleicIndex = geometries[i].userData.atom.resSeq + '' + geometries[i].userData.atom.chainId;
            CORE.nucleicArrays[nucleicIndex].polygon = [];
            //faceArray[atom.serial - 1] = [];

            for (var j = 0; j < c * 3; j += 3) {
                colors[k + j] = color.r;
                colors[k + j + 1] = color.g;
                colors[k + j + 2] = color.b;

                CORE.nucleicArrays[nucleicIndex].polygon.push(k + j, k + j + 1, k + j + 2);
            }
            k += c * 3;
        }

        let mesh = new THREE.Mesh(mergedGeometry, material);

        mesh.geometry.attributes.color.needsUpdate = true;
        //mesh.geometry.userData.faceArray = faceArray;
        mesh.userData.originalParent = secondary;
        mesh.userData.type = 'basesPolygon' + type;
        mesh.userData.numMesh = geometries.length;

        secondary.add(mesh);
    }
    //create a unique mesh for all the seconadary structures for AR
    if (secondary.children.length > 0) createARMesh(secondary, 'secondary', 'secondary');

    CORE.SecondaryStructureScene.add(secondary);

    console.log('Drawn secondary structure');
    console.log('Drawn helix: ' + j + '/' + CORE.Helix.length);
    console.log('Drawn sheets: ' + k + '/' + CORE.Sheet.length);
}

//creates tubes which represents non covalent bonds
export function renderNonCovBonds() {
    CORE.setScene('HBOND');
    CORE.HBONDScene.name = 'HBOND';
    CORE.setScene('VDW');
    CORE.VDWScene.name = 'VDW';
    CORE.setScene('SBOND');
    CORE.SBONDScene.name = 'SBOND';
    CORE.setScene('IONIC');
    CORE.IONICScene.name = 'IONIC';
    CORE.setScene('PIPISTACK');
    CORE.PIPISTACKScene.name = 'PIPISTACK';
    CORE.setScene('PICATION');
    CORE.PICATIONScene.name = 'PICATION';
    CORE.setScene('GENERIC');
    CORE.GENERICScene.name = 'GENERIC';

    var geometries = [];

    //BONDS GEOMETRIES
    for (let edge in CORE.edges) {
        var pos1 = CORE.edges[edge].coord1;
        var pos2 = CORE.edges[edge].coord2;
        var atom1 = CORE.edges[edge].node1;
        var atom2 = CORE.edges[edge].node2;

        if (pos1 == undefined || pos2 == undefined) {
            console.log('Error while creating non-covalent bond. This bond will not be dysplayed');
        } else {
            var distance = CORE.edges[edge].distance;
            var bondType = CORE.edges[edge].interaction;
            var energy = CORE.edges[edge].energy;
            var angle = CORE.edges[edge].angle;
            var serial = CORE.edges[edge].serial;
            var color = CORE.edges[edge].color;

            let points = [pos1, pos2];
            let pos = getPointInBetween(pos1, pos2);
            var curve = new THREE.CatmullRomCurve3(points);
            curve.userData = CORE.edges[edge];

            if (geometries[bondType] == undefined) geometries[bondType] = [];
            geometries[bondType].push(curve);
            //geometries are curves
        }
    }

    //BONDS MESHES
    for (var type in geometries) {
        var group = new THREE.Group();
        group.name = 'bond_' + type;
        group.userData.isBond = true;
        let geos = [];

        for (var i in geometries[type]) {
            var colortype = CONSTANTS.nonCovalentBonds[type];
            if (colortype == undefined) console.log('undefined color?? This cannot happen!');

            var geometry = new THREE.TubeBufferGeometry(geometries[type][i], 2, 0.05, CORE.TUBE_SEGMENTS, false);

            let count = geometry.attributes.position.count;
            let color = new THREE.Color(colortype);
            let colors = new Float32Array(3 * count);
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.userData = geometries[type][i].userData;

            for (var l = 0; l < count * 3; l += 3) {
                colors[l] = color.r;
                colors[l + 1] = color.g;
                colors[l + 2] = color.b;
            }
            geos.push(geometry);
        }

        let mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geos, false);
        //var material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, vertexColors : THREE.VertexColors });
        var material = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
        let count = geos[0].attributes.position.count * geos.length;
        let colors = new Float32Array(3 * count);
        let k = 0;
        let positions = mergedGeometry.attributes.position.array;
        let faceArray = [];

        mergedGeometry.userData.faceArray = [];
        mergedGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        mergedGeometry.computeBoundingSphere();

        for (var i in geos) {
            let geo = geos[i];
            let c = geo.attributes.position.count;
            let color = new THREE.Color(geo.userData.color);
            faceArray[geo.userData.serial.toString()] = [];

            for (var j = 0; j < c * 3; j += 3) {
                colors[k + j] = color.r;
                colors[k + j + 1] = color.g;
                colors[k + j + 2] = color.b;

                faceArray[geo.userData.serial.toString()][j] = k + j;
                faceArray[geo.userData.serial.toString()][j + 1] = k + j + 1;
                faceArray[geo.userData.serial.toString()][j + 2] = k + j + 2;
            }
            k += c * 3;
        }

        let mesh = new THREE.Mesh(mergedGeometry, material);

        mesh.geometry.userData.faceArray = faceArray;
        mesh.geometry.attributes.color.needsUpdate = true;
        mesh.userData.originalParent = group;
        mesh.userData.type = 'bond_' + type;
        mesh.userData.count = geos[0].attributes.position.count;
        mesh.userData.numMesh = geos.length;

        group.add(mesh);

        createARMesh(group, 'bond_' + type, 'line');

        switch (type) {
            case 'HBOND':
                CORE.HBONDScene.add(group);
                CORE.CheckboxHBOND.disabled = false;
                CORE.mobileCheckboxHBOND.disabled = false;
                break;
            case 'VDW':
                CORE.VDWScene.add(group);
                CORE.CheckboxVDW.disabled = false;
                CORE.mobileCheckboxVDW.disabled = false;
                break;
            case 'SSBOND':
                CORE.SBONDScene.add(group);
                CORE.CheckboxSBOND.disabled = false;
                CORE.mobileCheckboxSBOND.disabled = false;
                break;
            case 'IONIC':
                CORE.IONICScene.add(group);
                CORE.CheckboxIONIC.disabled = false;
                CORE.mobileCheckboxIONIC.disabled = false;
                break;
            case 'GENERIC':
                CORE.GENERICScene.add(group);
                CORE.CheckboxGENERIC.disabled = false;
                CORE.mobileCheckboxGENERIC.disabled = false;
                break;
            case 'PIPISTACK':
                CORE.PIPISTACKScene.add(group);
                CORE.CheckboxPIPISTACK.disabled = false;
                CORE.mobileCheckboxPIPISTACK.disabled = false;

                break;
            case 'PICATION':
                CORE.PICATIONScene.add(group);
                CORE.CheckboxPICATION.disabled = false;
                CORE.mobileCheckboxPICATION.disabled = false;
                break;
        }
    }
    console.log('drawn non-covalent bonds: ' + CORE.edges.length);

    //enable bonds colouring
    $('#bondspan').removeClass('disabled');
    $('#mobilenoncovbondsspan').removeClass('disabled');
}

//create protein without atoms non involved in non covalent bonds
export function createNonCovProtein(scenes) {
    //Scenes: smallatoms, atoms, atomsL, smallatomsL, bonds, bondsL and wireframe
    scenes.forEach((scene) => {
        if (scene.children.length > 0) {
            let len = scene.children[0].children.length;

            //if bonds are loaded during an AR session some meshes may be in the pivot
            //and then not in their scenes
            let missingARscene = false;

            if (!scene.children[0].getObjectByName('AR')) {
                len++;
                missingARscene = true;
            }

            for (var l = 0; l < len; l++) {
                let geos = [];
                let mesh;
                if (l == len - 1 && missingARscene) {
                    mesh = CORE.pivot.getObjectByUserDataProperty('type', scene.children[0].children[l - 1].userData.type + 'AR');
                } else {
                    mesh = scene.children[0].children[l];
                }

                for (let i = 0; i < mesh.geometry.userData.atoms.length; i++) {
                    if (mesh.geometry.userData.atoms[i].nonCovBonds.length > 0) {
                        geos.push(mesh.geometry.userData.geos[i]);
                    }
                }

                if (geos.length > 0) {
                    let mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geos, false);
                    var material = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
                    let count = geos[0].attributes.position.count * geos.length;
                    let colors = new Float32Array(3 * count);
                    let k = 0;
                    let faceArray = [];

                    mergedGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                    mergedGeometry.userData.atoms = [];
                    mergedGeometry.userData.geos = geos;
                    mergedGeometry.userData.faceArray = [];
                    mergedGeometry.computeBoundingSphere();

                    for (let i in geos) {
                        let geo = geos[i];
                        let c = geo.attributes.position.count;
                        let color = new THREE.Color(geo.userData.atom.color);
                        mergedGeometry.userData.atoms.push(geo.userData.atom);

                        if (!faceArray[geo.userData.atom.serial.toString()]) faceArray[geo.userData.atom.serial.toString()] = [];

                        if (mesh.userData.type == 'smallatoms') {
                            CORE.atomStickArraysCOV[geo.userData.atom.serial.toString()] = {};
                            CORE.atomStickArraysCOV[geo.userData.atom.serial.toString()].atoms = [];
                        } else if (mesh.userData.type == 'smallatomsL') {
                            CORE.atomStickArraysLCOV[geo.userData.atom.serial.toString()] = {};
                            CORE.atomStickArraysLCOV[geo.userData.atom.serial.toString()].atoms = [];
                        } else if (mesh.userData.type == 'bonds') {
                            if (!CORE.atomStickArraysCOV[geo.userData.atom.serial.toString()].bonds) CORE.atomStickArraysCOV[geo.userData.atom.serial.toString()].bonds = [];
                        } else if (mesh.userData.type == 'bondsL') {
                            //devo aggiungere questo if perchè ci sono dei collegamenti condivisi con gli atomi tra i legami coi ligandi
                            //che sono i legami che partono da un atomo e arrivano ad un ligando.
                            //in questo caso succede che il legame viene riconosciuto qui come ligando anche se ligando non è
                            if (CORE.atomStickArraysLCOV[geo.userData.atom.serial.toString()] && !CORE.atomStickArraysLCOV[geo.userData.atom.serial.toString()].bonds)
                                CORE.atomStickArraysLCOV[geo.userData.atom.serial.toString()].bonds = [];
                        }

                        for (var j = 0; j < c * 3; j += 3) {
                            colors[k + j] = color.r;
                            colors[k + j + 1] = color.g;
                            colors[k + j + 2] = color.b;
                            faceArray[geo.userData.atom.serial.toString()].push(k + j, k + j + 1, k + j + 2);

                            if (mesh.userData.type == 'smallatoms') {
                                CORE.atomStickArraysCOV[geo.userData.atom.serial.toString()].atoms.push(k + j, k + j + 1, k + j + 2);
                            } else if (mesh.userData.type == 'smallatomsL') {
                                CORE.atomStickArraysLCOV[geo.userData.atom.serial.toString()].atoms.push(k + j, k + j + 1, k + j + 2);
                            } else if (mesh.userData.type == 'bonds') {
                                CORE.atomStickArraysCOV[geo.userData.atom.serial.toString()].bonds.push(k + j, k + j + 1, k + j + 2);
                            } else if (mesh.userData.type == 'bondsL' && CORE.atomStickArraysLCOV[geo.userData.atom.serial.toString()]) {
                                CORE.atomStickArraysLCOV[geo.userData.atom.serial.toString()].bonds.push(k + j, k + j + 1, k + j + 2);
                            }
                        }
                        k += c * 3;
                    }
                    let newmesh = new THREE.Mesh(mergedGeometry, material);

                    newmesh.geometry.userData.faceArray = faceArray;
                    newmesh.geometry.attributes.color.needsUpdate = true;
                    newmesh.userData.originalParent = scene.children[0];
                    newmesh.userData.count = geos[0].attributes.position.count;
                    newmesh.userData.numMesh = geos.length;
                    newmesh.layers.set(1);
                    newmesh.visible = false;

                    if (mesh.name == 'AR') {
                        newmesh.name = 'COVAR';
                        newmesh.userData.type = scene.children[0].name + '_COVAR';
                        let valscale = 0.2 / (CORE.Atoms.length / CORE.distance);
                        if (valscale < 0.02) valscale = 0.02;
                        newmesh.scale.set(valscale, valscale, valscale);
                    } else {
                        newmesh.name = 'COV';
                        newmesh.userData.type = scene.children[0].name + '_COV';
                    }
                    scene.children[0].add(newmesh);
                }
            }
        }
    });
}

//mesh for AR session, they are scaled and their geometries are merged in order to easily use TransformControls. They are not visible in inline and vr session.
function createARMesh(group, type, meshType) {
    var combinedGeo, mat, newMesh;

    try {
        if (meshType == 'atoms' || meshType == 'line') {
            //clone mesh
            newMesh = new THREE.Mesh(group.children[0].geometry.clone(), group.children[0].material.clone()); //every group has only 1 child
            newMesh.userData.count = group.children[0].userData.count;
            newMesh.userData.numMesh = group.children[0].userData.numMesh;
        } else {
            //secondary

            let array = [];
            for (let i in group.children) {
                array.push(group.children[i].geometry);
            }
            let mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(array, false);
            newMesh = new THREE.Mesh(
                mergedGeometry,
                new THREE./*MeshPhongMaterial*/ MeshLambertMaterial({
                    side: THREE.DoubleSide,
                    vertexColors: THREE.FaceColors,
                })
            );

            //newMesh.userData.count =  group.children[0].userData.count;
            //newMesh.userData.numMesh = group.children[0].userData.numMesh;
        }

        newMesh.userData.type = type + 'AR';
        newMesh.userData.originalParent = group;
        newMesh.name = 'AR';

        //scale mesh for AR
        let valscale = 0.2 / (CORE.Atoms.length / CORE.distance);
        if (valscale < 0.02) valscale = 0.02;

        newMesh.scale.set(valscale, valscale, valscale);
        newMesh.layers.set(1); //change layers to avoid raycasting in inline session

        group.add(newMesh);
    } catch (e) {
        alert(e);
    }
}

// from GLmol drawStrip
// div = 5

// @authors
// lukasturcani https://github.com/lukasturcani,
// bankgithub https://github.com/bankgithub
function drawStripBufferGeomtry(p1, p2, colorsArray, helixes, thickness) {
    var faceArray = [];
    var flag = false;

    p1 = subdivide(p1, 5);
    p2 = subdivide(p2, 5);

    //Index for colors, since points are a lot more than colors,
    //this is needed to retrieve color from array of colors
    var colorIndex = Math.round(p1.length / colorsArray.length); //math.round
    var k = 0,
        faceIndex = -1,
        nucleicIndex = helixes[0].resSeq + '' + helixes[0].chainId;
    var serial = helixes[0].serial;
    faceArray[serial.toString()] = [];

    if (helixes[0].nucleic) {
        //helix is a nucleic acid backbone
        flag = true;
        if (!CORE.nucleicArrays[nucleicIndex]) CORE.nucleicArrays[nucleicIndex] = {};
    }

    var color = new THREE.Color(colorsArray[0]);

    var positions = [],
        index = [],
        colors = [];

    var axis, p1v, p2v, a1v, a2v;
    var lim = p1.length;
    var idxP = 0,
        idx = 0;

    for (var i = 0; i < lim; i++) {
        if ((i - 1) % colorIndex == 0) {
            color = new THREE.Color(colorsArray[k]);
            k++;
            faceIndex++; //cambia atomo C nella backbone
            serial = helixes[faceIndex].serial;
            if (!faceArray[serial.toString()]) faceArray[serial.toString()] = [];
            nucleicIndex = helixes[faceIndex].resSeq + '' + helixes[faceIndex].chainId;
        }

        p1v = p1[i];

        positions.push(p1v.x);
        positions.push(p1v.y);
        positions.push(p1v.z);

        colors.push(color.r);
        colors.push(color.g);
        colors.push(color.b);

        faceArray[serial.toString()].push(colors.length - 3);
        faceArray[serial.toString()].push(colors.length - 2);
        faceArray[serial.toString()].push(colors.length - 1);

        positions.push(p1v.x);
        positions.push(p1v.y);
        positions.push(p1v.z);

        colors.push(color.r);
        colors.push(color.g);
        colors.push(color.b);

        faceArray[serial.toString()].push(colors.length - 3);
        faceArray[serial.toString()].push(colors.length - 2);
        faceArray[serial.toString()].push(colors.length - 1);

        p2v = p2[i];

        positions.push(p2v.x);
        positions.push(p2v.y);
        positions.push(p2v.z);

        colors.push(color.r);
        colors.push(color.g);
        colors.push(color.b);

        faceArray[serial.toString()].push(colors.length - 3);
        faceArray[serial.toString()].push(colors.length - 2);
        faceArray[serial.toString()].push(colors.length - 1);

        positions.push(p2v.x);
        positions.push(p2v.y);
        positions.push(p2v.z);

        colors.push(color.r);
        colors.push(color.g);
        colors.push(color.b);

        faceArray[serial.toString()].push(colors.length - 3);
        faceArray[serial.toString()].push(colors.length - 2);
        faceArray[serial.toString()].push(colors.length - 1);

        if (i < lim - 1) {
            var toNext = p1[i + 1].clone().sub(p1[i]);
            var toSide = p2[i].clone().sub(p1[i]);
            axis = toSide.cross(toNext).normalize().multiplyScalar(thickness);
        }

        a1v = p1[i].clone().add(axis);

        positions.push(a1v.x);
        positions.push(a1v.y);
        positions.push(a1v.z);

        colors.push(color.r);
        colors.push(color.g);
        colors.push(color.b);

        faceArray[serial.toString()].push(colors.length - 3);
        faceArray[serial.toString()].push(colors.length - 2);
        faceArray[serial.toString()].push(colors.length - 1);

        positions.push(a1v.x);
        positions.push(a1v.y);
        positions.push(a1v.z);

        colors.push(color.r);
        colors.push(color.g);
        colors.push(color.b);

        faceArray[serial.toString()].push(colors.length - 3);
        faceArray[serial.toString()].push(colors.length - 2);
        faceArray[serial.toString()].push(colors.length - 1);

        a2v = p2[i].clone().add(axis);

        positions.push(a2v.x);
        positions.push(a2v.y);
        positions.push(a2v.z);

        colors.push(color.r);
        colors.push(color.g);
        colors.push(color.b);

        faceArray[serial.toString()].push(colors.length - 3);
        faceArray[serial.toString()].push(colors.length - 2);
        faceArray[serial.toString()].push(colors.length - 1);

        positions.push(a2v.x);
        positions.push(a2v.y);
        positions.push(a2v.z);

        colors.push(color.r);
        colors.push(color.g);
        colors.push(color.b);

        faceArray[serial.toString()].push(colors.length - 3);
        faceArray[serial.toString()].push(colors.length - 2);
        faceArray[serial.toString()].push(colors.length - 1);

        idxP += 24;

        if ((i - 1) % colorIndex == 0) {
            if (flag) {
                if (!CORE.nucleicArrays[nucleicIndex]) CORE.nucleicArrays[nucleicIndex] = {};
                CORE.nucleicArrays[nucleicIndex].backbone = faceArray[serial];
            }
        }
    }

    var faces = [
        [0, 2, -6, -8],
        [-4, -2, 6, 4],
        [7, 3, -5, -1],
        [-3, -7, 1, 5],
    ];

    lim = p1.length;

    for (var i = 1; i < lim; i++) {
        var offset = 8 * i,
            color;

        for (var j = 0; j < 4; j++) {
            //var f = new THREE.Face3(offset + faces[j][0], offset + faces[j][1], offset + faces[j][2], undefined, color);

            //fs.push(f);
            //faceArray[faceIndex].push(f);
            index[idx] = offset + faces[j][0];
            index[idx + 1] = offset + faces[j][1];
            index[idx + 2] = offset + faces[j][2];

            idx += 3;

            //var f = new THREE.Face3(offset + faces[j][0], offset + faces[j][2], offset + faces[j][3], undefined, color);

            //fs.push(f);
            //faceArray[faceIndex].push(f);
            index[idx] = offset + faces[j][0];
            index[idx + 1] = offset + faces[j][2];
            index[idx + 2] = offset + faces[j][3];

            idx += 3;
        }
    }

    var vsize = positions.length / 3 - 8;

    // Cap
    for (var i = 0; i < 4; i++) {
        //vs.push(vs[i * 2]);

        positions.push(positions[i * 2 * 3]);
        positions.push(positions[i * 2 * 3 + 1]);
        positions.push(positions[i * 2 * 3 + 2]);

        //vs.push(vs[vsize + i * 2])
        idxP += 3;

        positions.push(positions[vsize * 3 + i * 2 * 3]);
        positions.push(positions[vsize * 3 + i * 2 * 3 + 1]);
        positions.push(positions[vsize * 3 + i * 2 * 3 + 2]);

        idxP += 3;
        if (i % 2 == 0) {
            colors.push(colors[0]);
            colors.push(colors[1]);
            colors.push(colors[2]);

            faceArray[serial.toString()].push(colors.length - 3);
            faceArray[serial.toString()].push(colors.length - 2);
            faceArray[serial.toString()].push(colors.length - 1);

            colors.push(colors[0]);
            colors.push(colors[1]);
            colors.push(colors[2]);

            faceArray[serial.toString()].push(colors.length - 3);
            faceArray[serial.toString()].push(colors.length - 2);
            faceArray[serial.toString()].push(colors.length - 1);
        } else {
            colors.push(colors[colors.length - 3 * 3]);
            colors.push(colors[colors.length - 3 * 3 + 1]);
            colors.push(colors[colors.length - 3 * 3 + 2]);

            faceArray[serial.toString()].push(colors.length - 3);
            faceArray[serial.toString()].push(colors.length - 2);
            faceArray[serial.toString()].push(colors.length - 1);

            colors.push(colors[colors.length - 3 * 3]);
            colors.push(colors[colors.length - 3 * 3 + 1]);
            colors.push(colors[colors.length - 3 * 3 + 2]);

            faceArray[serial.toString()].push(colors.length - 3);
            faceArray[serial.toString()].push(colors.length - 2);
            faceArray[serial.toString()].push(colors.length - 1);
        }
    }

    vsize += 8;

    var verts1 = [vsize, vsize + 2, vsize + 6, vsize + 4];
    var verts2 = [vsize + 1, vsize + 5, vsize + 7, vsize + 3];

    //fs.push(new THREE.Face3(verts1[0], verts1[1], verts1[2], undefined, fs[0].color));
    index[idx] = verts1[0];
    index[idx + 1] = verts1[1];
    index[idx + 2] = verts1[2];

    /*faceArray[serial].push(idx);
    faceArray[serial].push(idx+1);
    faceArray[serial].push(idx+2);
    
    colors[idx] = colors[0];
    colors[idx+1] = colors[1];
    colors[idx+2] = colors[2];*/

    idx += 3;

    //fs.push(new THREE.Face3(verts1[0], verts1[2], verts1[3], undefined, fs[0].color));
    index[idx] = verts1[0];
    index[idx + 1] = verts1[2];
    index[idx + 2] = verts1[3];

    /*faceArray[serial].push(idx);
    faceArray[serial].push(idx+1);
    faceArray[serial].push(idx+2);
    
    colors[idx] = colors[0];
    colors[idx+1] = colors[1];
    colors[idx+2] = colors[2];*/

    idx += 3;

    //fs.push(new THREE.Face3(verts2[0], verts2[1], verts2[2], undefined, fs[fs.length - 3].color));
    index[idx] = verts2[0];
    index[idx + 1] = verts2[1];
    index[idx + 2] = verts2[2];

    /*faceArray[serial].push(idx);
    faceArray[serial].push(idx+1);
    faceArray[serial].push(idx+2);
    
    colors[idx] = colors[colors.length - 3*3 ];
    colors[idx+1] = colors[colors.length - 3*3 + 1];
    colors[idx+2] = colors[colors.length - 3*3 + 2];*/

    idx += 3;

    //fs.push(new THREE.Face3(verts2[0], verts2[2], verts2[3], undefined, fs[fs.length - 3].color));
    index[idx] = verts2[0];
    index[idx + 1] = verts2[2];
    index[idx + 2] = verts2[3];

    /*faceArray[serial].push(idx);
    faceArray[serial].push(idx+1);
    faceArray[serial].push(idx+2);
    
    colors[idx] = colors[colors.length - 3*3 ];
    colors[idx+1] = colors[colors.length - 3*3 + 1];
    colors[idx+2] = colors[colors.length - 3*3 + 2];*/

    idx += 3;
    //FACE4 IS DEPRECATED!
    //fs.push(new THREE.Face4(vsize, vsize + 2, vsize + 6, vsize + 4, undefined, fs[0].color));
    //fs.push(new THREE.Face4(vsize + 1, vsize + 5, vsize + 7, vsize + 3, undefined, fs[fs.length - 3].color));
    //use 4 Face3 instead of 2 Face4

    //fs.push( new THREE.Face3( vsize, vsize + 2, vsize + 6, undefined, fs[0].color));
    index[idx] = vsize;
    index[idx + 1] = vsize + 2;
    index[idx + 2] = vsize + 6;

    /*faceArray[serial].push(idx);
    faceArray[serial].push(idx+1);
    faceArray[serial].push(idx+2);
    
    colors[idx] = colors[0];
    colors[idx+1] = colors[1];
    colors[idx+2] = colors[2];*/

    idx += 3;
    //fs.push( new THREE.Face3( vsize, vsize + 6, vsize + 4, undefined, fs[0].color));
    index[idx] = vsize;
    index[idx + 1] = vsize + 6;
    index[idx + 2] = vsize + 4;

    /*faceArray[serial].push(idx);
    faceArray[serial].push(idx+1);
    faceArray[serial].push(idx+2);
    
    colors[idx] = colors[0];
    colors[idx+1] = colors[1];
    colors[idx+2] = colors[2];*/

    idx += 3;

    //fs.push( new THREE.Face3( vsize + 1, vsize + 5, vsize + 7, undefined, fs[fs.length - 3].color ));
    index[idx] = vsize + 1;
    index[idx + 1] = vsize + 5;
    index[idx + 2] = vsize + 7;

    /*faceArray[serial].push(idx);
    faceArray[serial].push(idx+1);
    faceArray[serial].push(idx+2);
    
    colors[idx] = colors[colors.length - 3*3];
    colors[idx+1] = colors[colors.length - 3*3 + 1];
    colors[idx+2] = colors[colors.length - 3*3 + 2];*/

    idx += 3;
    //fs.push( new THREE.Face3( vsize + 1, vsize + 7, vsize + 3, undefined, fs[fs.length - 3].color ));

    index[idx] = vsize + 1;
    index[idx + 1] = vsize + 7;
    index[idx + 2] = vsize + 3;

    /*faceArray[serial].push(idx);
    faceArray[serial].push(idx+1);
    faceArray[serial].push(idx+2);
    
    colors[idx] = colors[colors.length - 3*3 ];
    colors[idx+1] = colors[colors.length - 3*3 + 1];
    colors[idx+2] = colors[colors.length - 3*3 + 2];*/

    var geo = new THREE.BufferGeometry();
    let poss = new Float32Array(positions);
    let cols = new Float32Array(colors);
    let idxs = new Uint32Array(index);

    geo.setAttribute('position', new THREE.BufferAttribute(poss, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    geo.setIndex(new THREE.BufferAttribute(idxs, 1));
    geo.computeBoundingSphere();
    geo.computeFaceNormals();
    geo.computeVertexNormals();
    geo.attributes.color.needsUpdate = true;
    geo.index.needsUpdate = true;
    geo.attributes.position.needsUpdate = true;
    geo.userData.faceArray = faceArray;

    //var material = new THREE.MeshPhongMaterial({ vertexColors : THREE.VertexColors, side : THREE.DoubleSide});
    var material = new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors, side: THREE.DoubleSide });
    var mesh = new THREE.Mesh(geo, material);

    return mesh;
}

// from GLmol drawSmoothTube

// @authors
// lukasturcani https://github.com/lukasturcani,
// bankgithub https://github.com/bankgithub

function drawSmoothTubeBufferGeomtry(_points, _colors, loops) {
    var circleDiv = 16,
        axisDiv = 16;
    var points = subdivide(_points, 32);
    var prevAxis1 = new THREE.Vector3(),
        prevAxis2;
    var colorIndex = Math.round(points.length / _colors.length);
    var k = 0;
    var faceIndex = -1;
    var faceArray = [];
    var serial = loops[0].serial;
    faceArray[serial.toString()] = [];

    var positions = [];
    var index = [];
    var colors = [];
    var color;

    for (var i = 0, lim = points.length; i < lim; i++) {
        var delta, axis1, axis2;

        if (i < lim - 1) {
            delta = new THREE.Vector3().subVectors(points[i], points[i + 1]);
            //0.2 is the tube radius
            axis1 = new THREE.Vector3(0, -delta.z, delta.y).normalize().multiplyScalar(0.2);
            axis2 = new THREE.Vector3().crossVectors(delta, axis1).normalize().multiplyScalar(0.2);
            //      var dir = 1, offset = 0;
            if (prevAxis1.dot(axis1) < 0) {
                axis1.negate();
                axis2.negate();
                //dir = -1;offset = 2 * Math.PI / axisDiv;
            }
            prevAxis1 = axis1;
            prevAxis2 = axis2;
        } else {
            axis1 = prevAxis1;
            axis2 = prevAxis2;
        }

        for (var j = 0; j < circleDiv; j++) {
            var angle = ((2 * Math.PI) / circleDiv) * j;
            //* dir  + offset;
            var c = Math.cos(angle),
                s = Math.sin(angle);
            //geo.vertices.push(new THREE.Vector3(points[i].x + c * axis1.x + s * axis2.x, points[i].y + c * axis1.y + s * axis2.y, points[i].z + c * axis1.z + s * axis2.z));

            positions.push(points[i].x + c * axis1.x + s * axis2.x); //x
            positions.push(points[i].y + c * axis1.y + s * axis2.y); //y
            positions.push(points[i].z + c * axis1.z + s * axis2.z); //z
        }
    }

    var offset = 0;

    for (var i = 0, lim = points.length - 1; i < lim; i++) {
        //var c = new THREE.Color(colors[Math.round((i - 1) / axisDiv)]);
        if (i % colorIndex == 0) {
            color = new THREE.Color(_colors[k]);
            k++;
            faceIndex++; //cambia atomo CA nella backbone
            serial = loops[faceIndex].serial;
            faceArray[serial.toString()] = [];
        }

        var reg = 0;

        //var r1 = new THREE.Vector3().subVectors(geo.vertices[offset], geo.vertices[offset + circleDiv]).lengthSq();
        var v1 = new THREE.Vector3(positions[offset * 3], positions[offset * 3 + 1], positions[offset * 3 + 2]);
        var v2 = new THREE.Vector3(positions[(offset + circleDiv) * 3], positions[(offset + circleDiv) * 3 + 1], positions[(offset + circleDiv) * 3 + 2]);

        var r1 = new THREE.Vector3().subVectors(v1, v2).lengthSq();

        v1 = new THREE.Vector3(positions[offset * 3], positions[offset * 3 + 1], positions[offset * 3 + 2]);
        v2 = new THREE.Vector3(positions[(offset + circleDiv) * 3 + 3], positions[(offset + circleDiv) * 3 + 3 + 1], positions[(offset + circleDiv) * 3 + 3 + 2]);

        //var r2 = new THREE.Vector3().subVectors(geo.vertices[offset], geo.vertices[offset + circleDiv + 1]).lengthSq();
        var r2 = new THREE.Vector3().subVectors(v1, v2).lengthSq();

        if (r1 > r2) {
            r1 = r2;
            reg = 1;
        }

        for (var j = 0; j < circleDiv; j++) {
            //var f = new THREE.Face3(offset + j, offset + (j + reg) % circleDiv + circleDiv, offset + (j + 1) % circleDiv);
            //geo.faces.push(f);

            index.push(offset + j);
            index.push(offset + ((j + reg) % circleDiv) + circleDiv);
            index.push(offset + ((j + 1) % circleDiv));

            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);

            faceArray[serial.toString()].push(colors.length - 3);
            faceArray[serial.toString()].push(colors.length - 2);
            faceArray[serial.toString()].push(colors.length - 1);

            //var f = new THREE.Face3(offset + (j + 1) % circleDiv, offset + (j + reg) % circleDiv + circleDiv, offset + (j + reg + 1) % circleDiv + circleDiv);
            //geo.faces.push(f);

            index.push(offset + ((j + 1) % circleDiv));
            index.push(offset + ((j + reg) % circleDiv) + circleDiv);
            index.push(offset + ((j + reg + 1) % circleDiv) + circleDiv);

            //removed these lines beacuse of a wrong interpretation of colors
            //i don't know why it seems there are much colors than indexes
            /*colors.push( color.r );
            colors.push( color.g );
            colors.push( color.b );
            
            faceArray[serial].push(colors.length - 3);
            faceArray[serial].push(colors.length - 2);
            faceArray[serial].push(colors.length - 1);*/

            //geo.faces[geo.faces.length - 2].color = c;
            //geo.faces[geo.faces.length - 1].color = c;
        }
        //color last segment of loop
        offset = offset + circleDiv;
        colors.push(color.r);
        colors.push(color.g);
        colors.push(color.b);

        faceArray[serial.toString()].push(colors.length - 3);
        faceArray[serial.toString()].push(colors.length - 2);
        faceArray[serial.toString()].push(colors.length - 1);
    }

    var geo = new THREE.BufferGeometry();
    let poss = new Float32Array(positions);
    let cols = new Float32Array(colors);
    let idxs = new Uint32Array(index);

    geo.setAttribute('position', new THREE.BufferAttribute(poss, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    geo.setIndex(new THREE.BufferAttribute(idxs, 1));

    geo.computeBoundingSphere();
    geo.computeVertexNormals();
    geo.attributes.color.needsUpdate = true;
    geo.index.needsUpdate = true;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.normal.needsUpdate = true;
    geo.userData.faceArray = faceArray;

    var material = new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors, side: THREE.DoubleSide });
    var mesh = new THREE.Mesh(geo, material);

    return mesh;
}

// @authors

// lukasturcani https://github.com/lukasturcani,
// bankgithub https://github.com/bankgithub
//div = 5 for inline session, 2 for VR-->
function subdivide(_points, DIV) {
    // points as Vector3
    var ret = [];
    var points;
    var i, j;
    points = new Array(); // Smoothing test
    points.push(_points[0]);
    var lim = _points.length - 1;
    for (i = 1; i < lim; i++) {
        var p1 = _points[i],
            p2 = _points[i + 1];
        if (p1.smoothen) points.push(new THREE.Vector3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2));
        else points.push(p1);
    }
    points.push(_points[_points.length - 1]);

    var size = points.length;
    for (i = -1; i <= size - 3; i++) {
        var p0 = points[i == -1 ? 0 : i];
        var p1 = points[i + 1],
            p2 = points[i + 2];
        var p3 = points[i == size - 3 ? size - 1 : i + 3];
        var v0 = new THREE.Vector3().subVectors(p2, p0).multiplyScalar(0.5);
        var v1 = new THREE.Vector3().subVectors(p3, p1).multiplyScalar(0.5);
        for (j = 0; j < DIV; j++) {
            var t = (1.0 / DIV) * j;
            var x = p1.x + t * v0.x + t * t * (-3 * p1.x + 3 * p2.x - 2 * v0.x - v1.x) + t * t * t * (2 * p1.x - 2 * p2.x + v0.x + v1.x);
            var y = p1.y + t * v0.y + t * t * (-3 * p1.y + 3 * p2.y - 2 * v0.y - v1.y) + t * t * t * (2 * p1.y - 2 * p2.y + v0.y + v1.y);
            var z = p1.z + t * v0.z + t * t * (-3 * p1.z + 3 * p2.z - 2 * v0.z - v1.z) + t * t * t * (2 * p1.z - 2 * p2.z + v0.z + v1.z);
            ret.push(new THREE.Vector3(x, y, z));
        }
    }
    ret.push(points[points.length - 1]);
    return ret;
}

//type 1: VDW 3: SAS 4: MS 2: SES
export function drawSurface(type, name) {
    var group = new THREE.Group();

    group.name = name;
    group.type = type;

    //wireframe true-> renderizza anche la superficie come wireframe
    //generateMesh(group, CORE.Atoms, type, true, wireframeLinewidth)

    //TODO metti un controllo per evitare di ricaricare mesh già calcolate

    generateMesh(group, CORE.Atoms, type, true, 2);
    createARMesh(group, name, 'surface');

    switch (type) {
        case 1:
            CORE.VDWSurfaceScene.add(group);
            CORE.VDWswitch.disabled = false;
            break;
        case 2:
            CORE.SESSurfaceScene.add(group);
            CORE.SESswitch.disabled = false;
            break;
        case 3:
            CORE.SASSurfaceScene.add(group);
            CORE.SASswitch.disabled = false;
            break;
        case 4:
            CORE.MSSurfaceScene.add(group);
            CORE.Mswitch.disabled = false;
            break;
    }
}

export function colorBy(type) {
    $.LoadingOverlay('show', {
        image: '',
        fontawesome: 'fas fa-dna fa-pulse',
    });

    setTimeout(function () {
        switch (type) {
            case 'residue':
                for (var i in CORE.Atoms) {
                    let atom = CORE.Atoms[i];
                    if (atom != 'TER') {
                        if (atom.nucleic) atom.color = CONSTANTS.nucleic[atom.resName];
                        else atom.color = CONSTANTS.aminoacids[atom.resName];
                    }
                }

                for (var i in CORE.Ligands) {
                    let ligand = CORE.Ligands[i];
                    ligand.color = CONSTANTS.aminoacids['OTHER']; //ligands amino acids are not included in the 20 considered for atoms
                }
                for (var i in CORE.Solvents) {
                    let solvent = CORE.Solvents[i];
                    solvent.color = CONSTANTS.aminoacids['OTHER']; //solvents amino acids are not included in the 20 considered for atoms
                }
                break;
            case 'element':
                for (var i in CORE.Atoms) {
                    let atom = CORE.Atoms[i];
                    if (atom != 'TER') atom.color = CONSTANTS.color[atom.elem];
                }

                for (var i in CORE.Ligands) {
                    let ligand = CORE.Ligands[i];
                    ligand.color = CONSTANTS.color[ligand.elem];
                }

                for (var i in CORE.Solvents) {
                    let solvent = CORE.Solvents[i];
                    solvent.color = CONSTANTS.color[solvent.elem];
                }
                break;
            case 'chain':
                for (var i in CORE.Atoms) {
                    let atom = CORE.Atoms[i];
                    if (atom != 'TER') atom.color = CONSTANTS.chainAtom[atom.chainId];
                }

                for (var i in CORE.Ligands) {
                    let ligand = CORE.Ligands[i];
                    ligand.color = CONSTANTS.chainHETATM[ligand.chainId];
                }

                for (var i in CORE.Solvents) {
                    let solvent = CORE.Solvents[i];
                    solvent.color = CONSTANTS.chainHETATM[solvent.chainId];
                }

                break;
            case 'secondary':
                //LOOPS
                if (!CORE.Loops.length) {
                    let loops0 = CORE.Atoms.filter((x) => !CORE.Sheets.includes(x));
                    CORE.setLoops(loops0.filter((x) => !CORE.Helixes.includes(x)));
                }

                for (var i in CORE.Sheets) {
                    if (CORE.Sheets[i] != 'TER') CORE.Sheets[i].color = CONSTANTS.sec['strand'];
                }
                for (var i in CORE.Helixes) {
                    if (CORE.Helixes[i] != 'TER') CORE.Helixes[i].color = CONSTANTS.sec['helix'];
                }
                for (var i in CORE.Loops) {
                    if (CORE.Loops[i] != 'TER') CORE.Loops[i].color = CONSTANTS.sec['loops'];
                }

                for (var i in CORE.Ligands) {
                    let ligand = CORE.Ligands[i];
                    ligand.color = CONSTANTS.aminoacids['OTHER'];
                }
                for (var i in CORE.Solvents) {
                    let solvent = CORE.Solvents[i];
                    solvent.color = CONSTANTS.aminoacids['OTHER'];
                }

                break;
            case 'BFactor': //FIXED
                //'fixedTemperature': the factor is referred to an absolute scale of 0 to 100.
                //'relativeTemperature': the color is relative to the lowest and highest B factor values within the file

                for (var i in CORE.Atoms) {
                    let atom = CORE.Atoms[i];
                    if (atom != 'TER') atom.color = CONSTANTS.BFactor[Math.round(atom.bFactor)];
                }

                for (var i in CORE.Ligands) {
                    let ligand = CORE.Ligands[i];
                    ligand.color = CONSTANTS.BFactor[Math.round(ligand.bFactor)];
                }

                for (var i in CORE.Solvents) {
                    let solvent = CORE.Solvents[i];
                    solvent.color = CONSTANTS.BFactor[Math.round(solvent.bFactor)];
                }
                break;

            case 'hydrofobicity':
                for (var i in CORE.Atoms) {
                    let atom = CORE.Atoms[i];
                    if (atom != 'TER') atom.color = CONSTANTS.hydrofobicity[atom.resName];
                }

                //DNA and RNA does not have an Hydrofobicity scale

                for (var i in CORE.DNAatoms) {
                    let atom = CORE.DNAatoms[i];
                    if (atom != 'TER') atom.color = CONSTANTS.aminoacids['OTHER'];
                }
                for (var i in CORE.RNAatoms) {
                    let atom = CORE.RNAatoms[i];
                    if (atom != 'TER') atom.color = CONSTANTS.aminoacids['OTHER'];
                }

                //don't have hydrofobicity of ligands and solvents
                for (var i in CORE.Ligands) {
                    let ligand = CORE.Ligands[i];
                    ligand.color = CONSTANTS.aminoacids['OTHER'];
                }

                for (var i in CORE.Solvents) {
                    let solvent = CORE.Solvents[i];
                    solvent.color = CONSTANTS.aminoacids['OTHER'];
                }
                break;

            case 'chainspectrum':
                for (var i in CORE.chains) {
                    //create a rainbow for every chain
                    let rainbow = generateRainbow(CORE.chains[i].counter);

                    for (var k in CORE.chains[i].atoms) {
                        CORE.chains[i].atoms[k].color = rainbow[k];
                    }
                }
                break;

            case 'spectrum':
                var rainbow = generateRainbow(CORE.Atoms.length);
                let j = 0;
                for (var i in CORE.Atoms) {
                    let atom = CORE.Atoms[i];
                    if (atom != 'TER') {
                        atom.color = rainbow[j];
                        j++;
                    }
                }
                break;

            case 'noncov':
                //change color of atoms involved in non-covalent bonds. Rememeber that some bonds start inside mass centers and can have only one atom

                for (var i in CORE.Atoms) {
                    let atom = CORE.Atoms[i];
                    if (atom != 'TER') {
                        if (atom.nonCovBonds.length > 0) {
                            atom.color = CONSTANTS.nonCovalentBonds[atom.nonCovBonds[0]];
                        } else {
                            atom.color = CONSTANTS.nonCovalentBonds['NOBOND'];
                        }
                    }
                }

                for (var i in CORE.Ligands) {
                    let atom = CORE.Ligands[i];
                    if (atom != 'TER') {
                        if (atom.nonCovBonds.length > 0) {
                            atom.color = CONSTANTS.nonCovalentBonds[atom.nonCovBonds[0]];
                        } else {
                            atom.color = CONSTANTS.nonCovalentBonds['NOBOND'];
                        }
                    }
                }

                for (var i in CORE.Solvents) {
                    CORE.Solvents[i].color = CONSTANTS.nonCovalentBonds['NOBOND'];
                }
                break;

            case 'covdistance':
                for (var i in CORE.edges) {
                    let edge = CORE.edges[i];
                    let distance = edge.distance,
                        normdistance;
                    if (edge.interaction == 'VDW') {
                        //remove from distance radius of the 2 atoms involved in that interaction
                        let atom1 = edge.node1;
                        let atom2 = edge.node2;

                        let r1 = CONSTANTS.radiusAlvarez[atom1.elem];
                        let r2 = CONSTANTS.radiusAlvarez[atom2.elem];

                        distance = distance - r1 - r2;
                        normdistance = normalize(distance, CONSTANTS.nonCovDistances[edge.interaction], 0);
                        let final = Math.round(normdistance * 10) / 10;

                        edge.color = CONSTANTS.VDWdistanceColors[final];
                    } else if (edge.interaction == 'SSBOND' || edge.interaction == 'PIPISTACK') {
                        //distance here is fixed, there's no upper and lower bound
                        normdistance = 1;
                        edge.color = CONSTANTS.nonCovalentBonds[edge.interaction];
                    } else {
                        normdistance = normalize(distance, CONSTANTS.nonCovDistances[edge.interaction], 0);
                        let final = Math.round(normdistance * 10) / 10;
                        if (edge.interaction == 'IONIC') edge.color = CONSTANTS.IONICdistanceColors[final];
                        //HBOND
                        else edge.color = CONSTANTS.HBONDdistanceColors[final];
                    }
                }
                break;
            case 'covtype': //OK
                for (var i in CORE.edges) {
                    let edge = CORE.edges[i];
                    edge.color = CONSTANTS.nonCovalentBonds[edge.interaction];
                }
                break;
        }
        let atomscenes = [CORE.AtomScene, CORE.SmallAtomScene, CORE.ScenaAtomi1VR, CORE.ScenaAtomi2VR, CORE.AtomBondsScene, CORE.WireframeScene];
        let ligandscenes = [CORE.LigandBondsScene, CORE.LigandsScene, CORE.ScenaLigands1VR, CORE.SmallLigandsScene, CORE.ScenaLigands2VR];
        let solventsscenes = [CORE.ScenaSolvents, CORE.ScenaSolventsVR];
        let secondaryscenes = [CORE.SecondaryStructureScene];
        let surfacescenes = [CORE.VDWSurfaceScene, CORE.SASSurfaceScene, CORE.SESSurfaceScene, CORE.MSSurfaceScene];

        if (type == 'covtype' || type == 'covdistance') {
            let bondscenes = [CORE.HBONDScene, CORE.VDWScene, CORE.SBONDScene, CORE.IONICScene, CORE.GENERICScene, CORE.PIPISTACKScene, CORE.PIPISTACKScene];
            changeMeshColor(bondscenes, CORE.edges, 'bonds');
        }

        changeMeshColor(atomscenes, CORE.Atoms, 'atoms');
        changeMeshColor(secondaryscenes, undefined, 'secondary');
        changeMeshColor(surfacescenes, undefined, 'surface');

        //chaneg color of meshes inside pivot AR
        for (let i in CORE.pivot.children) {
            if (CORE.pivot.children[i].userData.type == 'secondaryAR') {
                colorCustomMergedBufferGeometry(CORE.pivot, i);
            } else colorBufferGeometry(CORE.pivot, i);
        }

        if (CORE.ligandsPresent) changeMeshColor(ligandscenes, CORE.Ligands, 'atoms');
        if (CORE.solventPresent) changeMeshColor(solventsscenes, CORE.Solvents, 'atoms');
    }, 300);

    $.LoadingOverlay('hide');

    if (CORE.sessionMode == 'immersive-vr') moveSlider($('#atomslider'), 1, undefined, $('#rangevalue1'));
    else if (CORE.sessionMode == 'inline') moveSlider($('#atomslider'), 1, undefined, $('#rangevalue1'));
    else moveSlider($('#atomslider'), 1, undefined, $('#rangevalue1'));

    console.log('Coloured by ' + type);
}

function changeMeshColor(scenes, array, meshType) {
    for (let i = 0; i < scenes.length; i++) {
        if (scenes[i]) {
            let temp = scenes[i].children[0];
            if (temp) {
                for (let j = 0; j < temp.children.length; j++) {
                    if (meshType == 'secondary') {
                        if (
                            temp.children[j].userData.type == 'basestickDNA' ||
                            temp.children[j].userData.type == 'basestickRNA' ||
                            temp.children[j].userData.type == 'basesPolygonRNA' ||
                            temp.children[j].userData.type == 'basesPolygonDNA'
                        ) {
                            colorBufferGeometry(temp, j);
                        } else if (temp.children[j].userData.type == 'secondaryAR') {
                            colorCustomMergedBufferGeometry(temp, j);
                        } else {
                            colorCustomBufferGeometry(temp, j);
                        }
                    } else if (meshType == 'surface') {
                        colorSurfaceGeomtry(temp);
                    } else {
                        colorBufferGeometry(temp, j);
                    }
                    temp.children[j].geometry.attributes.color.needsUpdate = true;
                }
            }
        }
    }
}

function colorCustomMergedBufferGeometry(temp, j) {
    let colors = temp.children[j].geometry.attributes.color.array;
    let offset = 0;

    for (let i in temp.children[j].geometry.userData.mergedUserData) {
        //face array[i] corresponds to backbone[i]
        let backbone = temp.children[j].geometry.userData.mergedUserData[i].backbone;
        let faceArray = temp.children[j].geometry.userData.mergedUserData[i].faceArray;
        let sum = 0;

        if (backbone) {
            //change color of ribbons and nucleic acid backbone
            for (let atom in backbone) {
                let fs = faceArray[backbone[atom].serial];
                let color = new THREE.Color(backbone[atom].color);

                for (var f = 0; f < fs.length - 3; f += 3) {
                    colors[offset + fs[f]] = color.r;
                    colors[offset + fs[f + 1]] = color.g;
                    colors[offset + fs[f + 2]] = color.b;
                }

                sum += fs.length;
            }
            offset += sum;
        } else {
            //change color of stick and polygons of nucleic acids
            let atoms = temp.children[j].geometry.userData.mergedUserData[i].atoms;
            let geos = temp.children[j].geometry.userData.mergedUserData[i].geos;
            for (let g in geos) {
                let count = geos[g].attributes.position.count; //color o position? o index??
                let color = new THREE.Color(atoms[g].color);

                for (var f = 0; f < count * 3; f += 3) {
                    colors[offset + f] = color.r;
                    colors[offset + f + 1] = color.g;
                    colors[offset + f + 2] = color.b;
                }
                offset += count * 3;
            }
        }
    }
    temp.children[j].geometry.attributes.color.needsUpdate = true;
}

function colorCustomBufferGeometry(temp, j) {
    let colors = temp.children[j].geometry.attributes.color.array;
    let backbone = temp.children[j].userData.backbone;
    for (let atom in backbone) {
        //faceArray contains idx of colours associated to them
        let faceArray = temp.children[j].geometry.userData.faceArray[backbone[atom].serial];
        let color = new THREE.Color(backbone[atom].color);

        for (var f = 0; f < faceArray.length - 3; f += 3) {
            colors[faceArray[f]] = color.r;
            colors[faceArray[f + 1]] = color.g;
            colors[faceArray[f + 2]] = color.b;
        }
    }
    temp.children[j].geometry.attributes.color.needsUpdate = true;
}

function colorBufferGeometry(temp, j) {
    let m = 0;
    let colors = temp.children[j].geometry.attributes.color.array;
    let count = temp.children[j].userData.count;

    for (var k = 0; k < temp.children[j].userData.numMesh; k++) {
        let color;
        //noncov bond case
        if (temp.children[j].geometry.userData.mergedUserData[k].interaction) color = new THREE.Color(temp.children[j].geometry.userData.mergedUserData[k].color);
        else color = new THREE.Color(temp.children[j].geometry.userData.mergedUserData[k].atom.color);

        if (temp.children[j].geometry.userData.mergedUserData[k].count) count = temp.children[j].geometry.userData.mergedUserData[k].count;

        for (var n = 0; n < count * 3; n += 3) {
            colors[m + n] = color.r;
            colors[m + n + 1] = color.g;
            colors[m + n + 2] = color.b;
        }
        m += count * 3;
    }
    temp.children[j].geometry.attributes.color.needsUpdate = true;
}

function colorSurfaceGeomtry(temp) {
    var geometry = temp.children[0].geometry;
    var colors = geometry.attributes.color.array;
    var atomIds = geometry.userData.atomIds;
    for (var i = 0; i < atomIds.length; i++) {
        let a = CORE.Atoms[atomIds[i]];
        let color = new THREE.Color(a.color);
        colors[i * 3 + 0] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    geometry.attributes.color.needsUpdate = true;
}

//non serve controllare entrambi i checkbox, se uno è checked anche l'altro lo è
/*function clearScene() {
    
    //common scenes
    if (CORE.CheckboxHBOND.checked == true ){
        CORE.Scene.remove(CORE.Scene.getObjectByName( "HBOND" ));
        CORE.selectables.splice( selectables.findIndex(x => x.name === 'bond_HBOND' ) , 1);
    }
    if (CORE.CheckboxVDW.checked == true){
        CORE.Scene.remove(CORE.Scene.getObjectByName( "VDW" ));
        CORE.selectables.splice( selectables.findIndex(x => x.name === 'bond_VDW' ) , 1);
    }
    if (CORE.CheckboxSBOND.checked == true){
        CORE.Scene.remove(CORE.Scene.getObjectByName( "SBOND" ));
        CORE.selectables.splice( selectables.findIndex(x => x.name === 'bond_SBOND' ) , 1);
    }
    if (CORE.CheckboxIONIC.checked == true){
        CORE.Scene.remove(CORE.Scene.getObjectByName( "IONIC" ));
        CORE.selectables.splice( selectables.findIndex(x => x.name === 'bond_IONIC' ) , 1);
    }
    if (CORE.CheckboxPIPISTACK.checked == true){
        CORE.Scene.remove(CORE.Scene.getObjectByName( "PIPISTACK" ));
        CORE.selectables.splice( selectables.findIndex(x => x.name === 'bond_PIPISTACK' ) , 1);
    }
    if (CORE.CheckboxPICATION.checked == true){
        CORE.Scene.remove(CORE.Scene.getObjectByName( "PICATION" ));
        CORE.selectables.splice( selectables.findIndex(x => x.name === 'bond_PICATION' ) , 1);
    }
    if (CORE.CheckboxGENERIC.checked == true){
        CORE.Scene.remove(CORE.Scene.getObjectByName( "GENERIC" ));
        CORE.selectables.splice( selectables.findIndex(x => x.name === 'bond_GENERIC' ) , 1);
    }
    
    //inline scenes
    if ( CORE.sessionMode == "inline" || CORE.sessionMode == "immersive-ar" ) {
        if (CORE.CheckboxAtomi.checked == true) {
            CORE.Scene.remove(CORE.Scene.getObjectByName( "atomi1" ));
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'atoms' ) , 1);
        }
        if (CORE.CheckboxCollegamenti.checked == true) {
            CORE.Scene.remove(CORE.Scene.getObjectByName( "atomi2" ));  
            CORE.Scene.remove(CORE.Scene.getObjectByName( "collegamenti" ));
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'smallatoms' ) , 1);
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'bonds' ) , 1);
        }
        if (CORE.CheckboxSecondary.checked == true){
            CORE.Scene.remove(CORE.Scene.getObjectByName( "scenaSecondary" ));
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'secondary' ) , 1);
        }
        if (CORE.CheckboxLigandsStick.checked == true) {
            CORE.Scene.remove(CORE.Scene.getObjectByName( "ligands2" ));  
            CORE.Scene.remove(CORE.Scene.getObjectByName( "ligandbonds" ));
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'smallatomsL' ) , 1);
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'bondsL' ) , 1);
        } 
        if (CORE.CheckboxLigands.checked == true) {
            CORE.Scene.remove(CORE.Scene.getObjectByName( "ligands1" ));
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'atomsL' ) , 1);
        }
        if (CORE.CheckboxSolvent == true){
            CORE.Scene.remove(CORE.Scene.getObjectByName( "solventi" ));
            selectables.splice( selectables.findIndex(x => x.name === 'solvents' ) , 1);
        }
    //vr scenes
    } else if ( CORE.sessionMode == "immersive-vr") {
        if (CORE.CheckboxAtomi.checked == true){
            CORE.Scene.remove(CORE.Scene.getObjectByName( "atomi1VR" ));
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'atomsVR' ) , 1);
        }
        if (CORE.CheckboxCollegamenti.checked == true) {
            CORE.Scene.remove(CORE.Scene.getObjectByName( "atomi2VR" ));  
            CORE.Scene.remove(CORE.Scene.getObjectByName( "collegamenti" ));
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'smallatomsVR' ) , 1);
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'bonds' ) , 1);
        }
        if (CORE.CheckboxSecondary.checked == true){
            CORE.Scene.remove(CORE.Scene.getObjectByName( "scenaSecondary" ));
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'secondary' ) , 1);
        }
        if (CORE.CheckboxLigandsStick.checked == true) {
            CORE.Scene.remove(CORE.Scene.getObjectByName( "ligands2VR" ));  
            CORE.Scene.remove(CORE.Scene.getObjectByName( "ligandbonds" ));
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'smallatomsLVR' ) , 1);
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'bondsLVR' ) , 1);
        } 
        if (CORE.CheckboxLigands.checked == true){
            CORE.Scene.remove(CORE.Scene.getObjectByName( "ligands1VR" ));
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'atomsLVR' ) , 1);
        }
        if (CORE.CheckboxSolvent == true){
            CORE.Scene.remove(CORE.Scene.getObjectByName( "solventiVR" ));
            CORE.selectables.splice( selectables.findIndex(x => x.name === 'solventsVR' ) , 1);
        }
        
    } else { //immersive-ar scene
        
    }
    
} 
*/

function addScene() {
    //common scenes
    if (CORE.CheckboxHBOND.checked == true) {
        CORE.Scene.add(CORE.HBONDScene);
        CORE.selectables.push(CORE.Scene.getObjectByName('bond_HBOND'));
    }
    if (CORE.CheckboxVDW.checked == true) {
        CORE.Scene.add(CORE.VDWScene);
        CORE.selectables.push(CORE.Scene.getObjectByName('bond_VDW'));
    }
    if (CORE.CheckboxSBOND.checked == true) {
        CORE.Scene.add(CORE.SBONDScene);
        CORE.selectables.push(CORE.Scene.getObjectByName('bond_SBOND'));
    }
    if (CORE.CheckboxIONIC.checked == true) {
        CORE.Scene.add(CORE.IONICScene);
        CORE.selectables.push(CORE.Scene.getObjectByName('bond_IONIC'));
    }
    if (CORE.CheckboxPIPISTACK.checked == true) {
        CORE.Scene.add(CORE.PIPISTACKScene);
        CORE.selectables.push(CORE.Scene.getObjectByName('bond_PIPISTACK'));
    }
    if (CORE.CheckboxPICATION.checked == true) {
        CORE.Scene.add(CORE.PICATIONScene);
        CORE.selectables.push(CORE.Scene.getObjectByName('bond_PICATION'));
    }
    if (CORE.CheckboxGENERIC.checked == true) {
        CORE.Scene.add(CORE.GENERICScene);
        CORE.selectables.push(CORE.Scene.getObjectByName('bond_GENERIC'));
    }
    if (CORE.CheckVDWSurface.checked == true) {
        CORE.Scene.add(CORE.VDWSurfaceScene);
        CORE.selectables.push(CORE.Scene.getObjectByName('vdwsurface'));
    }

    if (CORE.CheckSasSurface.checked == true) {
        CORE.Scene.add(CORE.SASSurfaceScene);
        CORE.selectables.push(CORE.Scene.getObjectByName('sassurface'));
    }
    if (CORE.CheckSesSurface.checked == true) {
        CORE.Scene.add(CORE.SESSurfaceScene);
        CORE.selectables.push(CORE.Scene.getObjectByName('sessurface'));
    }
    if (CORE.CheckMsSurface.checked == true) {
        CORE.Scene.add(CORE.MSSurfaceScene);
        CORE.selectables.push(CORE.Scene.getObjectByName('mssurface'));
    }

    if (CORE.sessionMode == 'immersive-vr') {
        if (CORE.CheckboxAtomi.checked == true) {
            CORE.Scene.add(CORE.ScenaAtomi1VR);
            prepareForVR(CORE.Scene.getObjectByName('atomsVR'), false);
        }
        if (CORE.CheckboxCollegamenti.checked == true) {
            CORE.Scene.add(CORE.ScenaAtomi2VR);
            CORE.Scene.add(CORE.AtomBondsScene);
            prepareForVR(CORE.Scene.getObjectByName('smallatomsVR'), false);
            prepareForVR(CORE.Scene.getObjectByName('bonds'), false);
        }
        if (CORE.CheckboxSecondary.checked == true) {
            CORE.Scene.add(CORE.SecondaryStructureScene);
            prepareForVR(CORE.Scene.getObjectByName('secondary'), false);
        }
        if (CORE.CheckboxWireframe.checked == true) {
            CORE.Scene.add(CORE.WireframeScene);
            prepareForVR(CORE.Scene.getObjectByName('wireframe'), false);
        }
        if (CORE.CheckboxLigands.checked == true) {
            CORE.Scene.add(CORE.ScenaLigands1VR);
            prepareForVR(CORE.Scene.getObjectByName('atomsLVR'), false);
        }

        if (CORE.CheckboxLigandsStick.checked == true) {
            CORE.Scene.add(CORE.ScenaLigands2VR);
            if (CORE.LigandBondsScene.children.length) {
                CORE.Scene.add(LigandBondsScene);
                prepareForVR(CORE.Scene.getObjectByName('bondsLVR'), false);
            }
            prepareForVR(CORE.Scene.getObjectByName('smallatomsLVR'), false);
        }
        if (CORE.CheckboxSolvent.checked == true) {
            CORE.Scene.add(CORE.ScenaSolventsVR);
            prepareForVR(CORE.Scene.getObjectByName('solventsVR'), false);
        }
    } else if (CORE.sessionMode == 'inline') {
        if (CORE.CheckboxAtomi.checked == true) {
            CORE.Scene.add(CORE.AtomScene);
            CORE.selectables.push(CORE.Scene.getObjectByName('atoms'));
        }

        if (CORE.CheckboxCollegamenti.checked == true) {
            CORE.Scene.add(CORE.AtomBondsScene);
            CORE.Scene.add(CORE.SmallAtomScene);
            CORE.selectables.push(CORE.Scene.getObjectByName('smallatoms'));
            CORE.selectables.push(CORE.Scene.getObjectByName('bonds'));
        }
        if (CORE.CheckboxSecondary.checked == true) {
            CORE.Scene.add(CORE.SecondaryStructureScene);
            CORE.selectables.push(CORE.Scene.getObjectByName('secondary'));
        }

        if (CORE.CheckboxWireframe.checked == true) {
            CORE.Scene.add(CORE.WireframeScene);
            CORE.selectables.push(CORE.Scene.getObjectByName('wireframe'));
        }

        if (CORE.CheckboxLigands.checked == true) {
            CORE.Scene.add(CORE.LigandsScene);
            CORE.selectables.push(CORE.Scene.getObjectByName('atomsL'));
        }

        if (CORE.CheckboxLigandsStick.checked == true) {
            CORE.Scene.add(CORE.SmallLigandsScene);
            CORE.selectables.push(CORE.Scene.getObjectByName('smallatomsL'));
            if (CORE.LigandBondsScene.children.length) {
                CORE.Scene.add(CORE.LigandBondsScene);
                CORE.selectables.push(CORE.Scene.getObjectByName('bondsL'));
            }
        }
        if (CORE.CheckboxSolvent.checked == true) {
            CORE.Scene.add(CORE.ScenaSolvents);
            CORE.selectables.push(CORE.Scene.getObjectByName('solvents'));
        }
    } else {
        //CORE.sessionMode == "immersive-ar"
        if (CORE.CheckboxAtomi.checked == true) {
            CORE.Scene.add(CORE.AtomScene);
            prepareForAR(CORE.Scene.getObjectByName('atoms'), false);
        }

        if (CORE.CheckboxCollegamenti.checked == true) {
            CORE.Scene.add(CORE.AtomBondsScene);
            CORE.Scene.add(CORE.SmallAtomScene);
            prepareForAR(CORE.Scene.getObjectByName('smallatoms'));
            prepareForAR(CORE.Scene.getObjectByName('bonds'));
        }
        if (CORE.CheckboxSecondary.checked == true) {
            CORE.Scene.add(CORE.SecondaryStructureScene);
            prepareForAR(CORE.Scene.getObjectByName('secondary'));
        }

        if (CORE.CheckboxWireframe.checked == true) {
            CORE.Scene.add(CORE.WireframeScene);
            prepareForAR(CORE.Scene.getObjectByName('wireframe'));
        }

        if (CORE.CheckboxLigands.checked == true) {
            CORE.Scene.add(CORE.LigandsScene);
            let atoms = CORE.Scene.getObjectByName('atomsL');
            if (atoms) prepareForAR(atoms);
        }

        if (CORE.CheckboxLigandsStick.checked == true) {
            CORE.Scene.add(CORE.SmallLigandsScene);
            let atoms = CORE.Scene.getObjectByName('smallatomsL');
            if (atoms) prepareForAR(atoms);
            CORE.Scene.add(CORE.LigandBondsScene);
            let bonds = CORE.Scene.getObjectByName('bondsL');
            if (bonds) prepareForAR(bonds);
        }
    }
    if (CORE.CheckboxSolvent.checked == true) {
        CORE.Scene.add(CORE.ScenaSolvents);
        let atoms = CORE.Scene.getObjectByName('solvents');
        if (atoms) prepareForAR(atoms);
    }
}
