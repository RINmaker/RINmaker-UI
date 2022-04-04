import { VRButton } from './VRButton.js';
import { ARButton } from './ARButton.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { colorBy, createNonCovProtein, drawSurface, renderAllAtoms, renderAtomBonds, renderWireFrame } from './Rendering.js';
import * as COLOR from './Constants.js';
import * as FUNCTIONS from './Functions.js';
import { XRControllers } from './XRControllers.js';
import { parseXmlBonds, parsePDB } from './Parsing.js';
import { BoxLineGeometry } from './libs/BoxLineGeometry.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';

////////////////////////////////////////////////////////////////////////
//GLOBAL VARIBALES
////////////////////////////////////////////////////////////////////////

//data structures for atoms/bonds/secondary structures
export let AtomBonds = [],
    Oxigen = [],
    Helix = [],
    Sheet = [],
    Loops = [],
    Backbone = [],
    OrderedBackbone = [],
    Solvents = [],
    nonBonded = [],
    LigandBonds = [],
    Loop = [],
    Sheets = [],
    Helixes = [],
    Atoms = {},
    Ligands = {},
    RNAatoms = [],
    DNAatoms = [],
    DNABackbone = [],
    RNABackbone = [],
    residueSequence = [];
export let resCount = 1;

//RIN resulting from Giulio's script and result text
var xml;
var result;

//used for non-covalent bonds
export let edges = [],
    nodes = [];

//object array containing in each position the id of the chain, its initial, its length and its atoms
export let chains = [];

export let AlsoConnect = [];
export let AtomPool1 = [];
export let AtomPool2 = [];
export let LigandsPool1 = [];
export let LigandsPool2 = [];
export let SolventsPool = [];

export let median = new THREE.Vector3();

export let mouse = new THREE.Vector2();
var mouse2 = new THREE.Vector2();
export let mouseUserData = {};

var raycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 0.5;

export let indexArray = [];
export let LindexArray = []; //array of atom serials indexed by chainId,resSeq,resName
//nucleic acid mapping faceArray: every position is an object, indexed by chainId and resSeqNum, containing the 3 faceArray (nitrogenous base, sugar and phosphate group) of the nucleotide
export let nucleicArrays = [];
//array of atoms and stick, used in raycaster. Position x contains atom with serial x and its connected sticks
export let atomStickArrays = [],
    atomStickArraysL = [],
    atomStickArraysCOV = [],
    atomStickArraysLCOV = [];
var intersectedMesh;
var lastColor1,
    lastColor2,
    lastColor2bis,
    lastColor3,
    lastFaces1 = [],
    lastFaces2 = [],
    lastFaces3 = [],
    lastMesh1,
    lastMesh2,
    lastMesh3;

//constants
export let SPHERE_SEGMENTS = 16;
export let SMALLSPHERE_SEGMENTS = 16;
export let CYLINDER_SEGMENTS = 10;
export let TUBE_SEGMENTS = 10;
export let VR_SEGMENTS = 7;
export let TOLERANCE = 0.45;
export let ATOM_NUM = 0.22,
    CPK_NUM = 1.0,
    LINK_NUM = 0.15;
export let WIREFRAME_NUM = 0.05;
export let FOV = 45;
//Scenes
export let AtomScene = new THREE.Scene();
export let SmallAtomScene = new THREE.Scene();
export let AtomBondsScene = new THREE.Scene();
export let SecondaryStructureScene = new THREE.Scene();
export let LigandsScene = new THREE.Scene();
export let ScenaSolvents = new THREE.Scene();
export let SmallLigandsScene = new THREE.Scene();
export let LigandBondsScene = new THREE.Scene();
export let WireframeScene = new THREE.Scene();
export let VDWSurfaceScene = new THREE.Scene();
export let SASSurfaceScene = new THREE.Scene();
export let SESSurfaceScene = new THREE.Scene();
export let MSSurfaceScene = new THREE.Scene();
//scenes for VR
/*export let ScenaAtomi1VR = new THREE.Scene();
export let ScenaAtomi2VR = new THREE.Scene();
export let ScenaLigands1VR = new THREE.Scene();
export let ScenaLigands2VR = new THREE.Scene();
export let ScenaSolventsVR = new THREE.Scene();
*/
//scenes for non-covalent bonds
export let HBONDScene = new THREE.Scene();
export let VDWScene = new THREE.Scene();
export let SBONDScene = new THREE.Scene();
export let IONICScene = new THREE.Scene();
export let GENERICScene = new THREE.Scene();
export let PIPISTACKScene = new THREE.Scene();
export let PICATIONScene = new THREE.Scene();

//parsing variables
export let pdbname = '1cbs.pdb',
    pdbinfo,
    pdbcontent,
    bondloaded = false,
    pdbloaded = false,
    nonCovAtomsLoaded = false;

//main scene
export let Scene = new THREE.Scene();
Scene.background = new THREE.Color( '#ffffff' );

export let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });

export let camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 500);
export let controls,
    ARcontrols,
    pointerLockControls,
    distance,
    ter = 0,
    drawRibbon = true,
    c,
    minY,
    maxY,
    minX,
    maxX,
    minZ,
    maxZ;

//checkbox and buttons
export let CheckboxAtomi,
    CheckboxCollegamenti,
    CheckboxSecondary,
    CheckboxWireframe,
    CheckboxFog,
    CheckboxLigands,
    CheckboxLigandsStick,
    CheckboxSolvent,
    toast,
    CheckboxResidueColor,
    CheckBoxElemColor,
    CheckBoxSecColor,
    CheckboxChainColor,
    CheckboxNonCovColor,
    CheckBfactorColor,
    CheckHydroColor,
    CheckSpectrumColor,
    CheckChainSpectrumColor,
    CheckboxHBOND,
    CheckboxVDW,
    CheckboxSBOND,
    CheckboxIONIC,
    CheckboxPIPISTACK,
    CheckboxPICATION,
    CheckboxGENERIC,
    CheckNonCovAtoms,
    CheckNonCovTypeColor,
    CheckNonCovDistanceColor,
    CheckVDWSurface,
    CheckSasSurface,
    CheckSesSurface,
    CheckMsSurface,
    //CheckRIN,
    VDWswitch,
    SASswitch,
    SESswitch,
    Mswitch;

//mobile checkbox and buttons
export let mobileCheckboxAtoms,
    mobileCheckboxBonds,
    mobileCheckboxWireframe,
    mobileCheckboxSecondary,
    mobileCheckboxLigands,
    mobileCheckboxLigandsStick,
    mobileCheckboxSolvent,
    mobileCheckboxResidueColor,
    mobileCheckBoxElemColor,
    mobileCheckBoxSecColor,
    mobileCheckboxChainColor,
    mobileCheckboxNonCovColor,
    mobileCheckBfactorColor,
    mobileCheckHydroColor,
    mobileCheckSpectrumColor,
    mobileCheckChainSpectrumColor,
    mobileCheckboxHBOND,
    mobileCheckboxVDW,
    mobileCheckboxSBOND,
    mobileCheckboxIONIC,
    mobileCheckboxPIPISTACK,
    mobileCheckboxPICATION,
    mobileCheckboxGENERIC,
    mobileCheckNonCovAtoms,
    mobileCheckNonCovTypeColor,
    mobileCheckNonCovDistanceColor,
    mobileCheckVDWSurface,
    mobileCheckSasSurface,
    mobileCheckSesSurface,
    mobileCheckMsSurface;

export let ligandsPresent = false,
    solventPresent = false;
//last color selected in checkbox
var lastCheckColor, mobilelastCheckColor;

//VR variables
var VRbutton, ARbutton;
export let controller1, controller2;
export let selectables = [];
export let sessionMode = 'inline'; //type of xr session

//AR variables
var XRsession;
export let reticle; //reticle used to place protein in AR
export let pivot; //pivot used to rotate proteins in AR
export let proteinPlaced = false;
var hitTestSource = null,
    hitTestSourceRequested = false;
export let refBoundingBox = null;
var touchStart, toucheEnd;

//////////////////////////////////////////////////////
///FOR ASSIGNING VALUE TO EXPORTED VARIABLES
//////////////////////////////////////////////////////
export function setARControls(newvalue) {
    ARcontrols = newvalue;
}
export function setController1(newvalue) {
    controller1 = newvalue;
}
export function setController2(newvalue) {
    controller2 = newvalue;
}
export function setScene(scena) {
    switch (scena) {
        case 'atomi1':
            AtomScene = new THREE.Scene();
            break;
        case 'atomi2':
            SmallAtomScene = new THREE.Scene();
            break;
        case 'scenaSecondary':
            SecondaryStructureScene = new THREE.Scene();
            break;
        case 'collegamenti':
            AtomBondsScene = new THREE.Scene();
            break;
        case 'scenaWireframe':
            WireframeScene = new THREE.Scene();
            break;
        case 'ligands1':
            LigandsScene = new THREE.Scene();
            break;
        case 'ligands2':
            SmallLigandsScene = new THREE.Scene();
            break;
        case 'ligandbonds':
            LigandBondsScene = new THREE.Scene();
            break;
        case 'solventi':
            ScenaSolvents = new THREE.Scene();
            break;
        case 'atomi2VR':
            ScenaAtomi2VR = new THREE.Scene();
            break;
        case 'atomi1VR':
            ScenaAtomi1VR = new THREE.Scene();
            break;
        case 'ligands1VR':
            ScenaLigands1VR = new THREE.Scene();
            break;
        case 'ligands2VR':
            ScenaLigands2VR = new THREE.Scene();
            break;
        case 'solventiVR':
            ScenaSolventsVR = new THREE.Scene();
            break;
        case 'scenaVdwSurface':
            VDWSurfaceScene = new THREE.Scene();
            break;
        case 'scenaSasSurface':
            SASSurfaceScene = new THREE.Scene();
            break;
        case 'scenaSesSurface':
            SESSurfaceScene = new THREE.Scene();
            break;
        case 'scenaMsSurface':
            MSSurfaceScene = new THREE.Scene();
            break;
        case 'HBOND':
            HBONDScene = new THREE.Scene();
            break;
        case 'VDW':
            VDWScene = new THREE.Scene();
            break;
        case 'SBOND':
            SBONDScene = new THREE.Scene();
            break;
        case 'IONIC':
            IONICScene = new THREE.Scene();
            break;
        case 'GENERIC':
            GENERICScene = new THREE.Scene();
            break;
        case 'PIPISTACK':
            PIPISTACKScene = new THREE.Scene();
            break;
        case 'PICATION':
            PICATIONScene = new THREE.Scene();
            break;
        default:
            console.log('Error while creating new scene.');
            break;
    }
}
export function setC(newvalue) {
    c = newvalue;
}
export function setProteinPlaced(newvalue) {
    proteinPlaced = newvalue;
}
export function setDistance(newvalue) {
    distance = newvalue;
}
export function setSessionMode(newvalue) {
    sessionMode = newvalue;
}
export function setSolventPresent(newvalue) {
    solventPresent = newvalue;
}
export function setLigandsPresent(newvalue) {
    ligandsPresent = newvalue;
}
export function setLoop(newvalue) {
    Loop = newvalue;
}
export function setLoops(newvalue) {
    Loops = newvalue;
}
export function setSheets(newvalue) {
    Sheets = newvalue;
}
export function setHelixes(newvalue) {
    Helixes = newvalue;
}
export function setSheet(newvalue) {
    Sheet = newvalue;
}
export function setRefBoundingBox(newvalue) {
    refBoundingBox = newvalue;
}
export function setMinY(newvalue) {
    minY = newvalue;
}
export function setMinX(newvalue) {
    minX = newvalue;
}
export function setMinZ(newvalue) {
    minZ = newvalue;
}
export function setMaxX(newvalue) {
    maxX = newvalue;
}
export function setMaxY(newvalue) {
    maxY = newvalue;
}
export function setMaxZ(newvalue) {
    maxZ = newvalue;
}
export function increaseResCount() {
    resCount++;
}
export function setDisegnaRibbon(value) {
    drawRibbon = value;
}
export function setPDBinfo(value) {
    pdbinfo = value;
}
export function cleanArrays() {
    selectables = [];
    AtomPool1 = [];
    AtomPool2 = [];
    LigandsPool1 = [];
    LigandsPool2 = [];
    SolventsPool = [];
    edges = [];
    nodes = [];
    //nodesRIN = [];
    //linksRIN = [];
    //$('#rinbutton').attr('disabled', 'disabled');
    selectables = [];
    Scene.remove(pivot);
    pivot = new THREE.Object3D();
    pivot.name = 'pivotAR';
    Scene.add(pivot);
    refBoundingBox = null;
    nucleicArrays = [];
    atomStickArrays = [];
    atomStickArraysCOV = [];
    atomStickArraysL = [];
    atomStickArraysLCOV = [];
    lastColor1 = null;
    lastColor2 = null;
    lastColor2bis = null;
    lastColor3 = null;
    lastMesh1 = null;
    lastMesh2 = null;
    lastMesh3 = null;
    lastFaces1 = [];
    lastFaces2 = [];
    lastFaces3 = [];
}
function cleanPDBparseArrays() {
    xml = '';
    result = '';
    Atoms = [];
    residueSequence = [];
    Backbone = [];
    AtomBonds = [];
    AlsoConnect = [];
    Helix = [];
    Sheet = [];
    Loop = [];
    Helixes = [];
    Sheets = [];
    Loops = [];
    Ligands = [];
    LigandBonds = [];
    Solvents = [];
    indexArray = [];
    LindexArray = [];
    Oxigen = [];
    RNAatoms = [];
    DNAatoms = [];
    DNABackbone = [];
    RNABackbone = [];
    chains = [];
    median = new THREE.Vector3();
    ter = 0;
    resCount = 1;
    drawRibbon = true;
    bondloaded = false;
    pdbloaded = false;
    nonCovAtomsLoaded = false;
    ligandsPresent = false;
    solventPresent = false;

    CheckNonCovAtoms.disabled = true;
    CheckNonCovTypeColor.disabled = true;
    CheckNonCovDistanceColor.disabled = true;
    CheckboxHBOND.disabled = true;
    CheckboxVDW.disabled = true;
    CheckboxSBOND.disabled = true;
    CheckboxIONIC.disabled = true;
    CheckboxGENERIC.disabled = true;
    CheckboxPIPISTACK.disabled = true;
    CheckboxPICATION.disabled = true;

    mobileCheckNonCovAtoms.disabled = true;
    mobileCheckNonCovTypeColor.disabled = true;
    mobileCheckNonCovDistanceColor.disabled = true;
    mobileCheckboxHBOND.disabled = true;
    mobileCheckboxVDW.disabled = true;
    mobileCheckboxSBOND.disabled = true;
    mobileCheckboxIONIC.disabled = true;
    mobileCheckboxGENERIC.disabled = true;
    mobileCheckboxPIPISTACK.disabled = true;
    mobileCheckboxPICATION.disabled = true;

    CheckboxAtomi.checked = false;
    CheckboxCollegamenti.checked = false;
    CheckboxWireframe.checked = false;

    mobileCheckboxAtoms.check = false;
    mobileCheckboxBonds.check = false;
    mobileCheckboxWireframe.check = false;

    //CheckRIN.disabled = true;

    CheckVDWSurface.checked = false;
    CheckMsSurface.checked = false;
    CheckSasSurface.checked = false;
    CheckSesSurface.checked = false;
    mobileCheckVDWSurface.checked = false;
    mobileCheckMsSurface.checked = false;
    mobileCheckSesSurface.checked = false;
    mobileCheckSasSurface.checked = false;
    VDWswitch.checked = false;
    SASswitch.checked = false;
    SESswitch.checked = false;
    Mswitch.checked = false;
    VDWswitch.disabled = true;
    SASswitch.disabled = true;
    SESswitch.disabled = true;
    Mswitch.disabled = true;

    if (CheckNonCovAtoms.checked) {
        CheckNonCovAtoms.checked = false;
        mobileCheckNonCovAtoms.checked = false;
    }
    if (CheckboxHBOND.checked) {
        CheckboxHBOND.checked = false;
        mobileCheckboxHBOND.checked = false;
    }
    if (CheckboxVDW.checked) {
        CheckboxVDW.checked = false;
        mobileCheckboxVDW.checked = false;
    }
    if (CheckboxVDW.checked) {
        CheckboxVDW.checked = false;
        mobileCheckboxVDW.checked = false;
    }
    if (CheckboxSBOND.checked) {
        CheckboxSBOND.checked = false;
        mobileCheckboxSBOND.checked = false;
    }
    if (CheckboxIONIC.checked) {
        CheckboxIONIC.checked = false;
        mobileCheckboxIONIC.checked = false;
    }
    if (CheckboxGENERIC.checked) {
        CheckboxGENERIC.checked = true;
        mobileCheckboxGENERIC.checked = true;
    }
    if (CheckboxPIPISTACK.checked) {
        CheckboxPIPISTACK.checked = false;
        mobileCheckboxPIPISTACK.checked = false;
    }
    if (CheckboxPICATION.checked) {
        CheckboxPICATION.checked = false;
        mobileCheckboxPICATION.checked = false;
    }

    mobileCheckboxLigands.disabled = true;
    CheckboxLigands.disabled = true;
    mobileCheckboxLigandsStick.disabled = true;
    CheckboxLigandsStick.disabled = true;
    mobileCheckboxSolvent.disabled = true;
    CheckboxSolvent.disabled = true;

    if (CheckboxLigands.checked) {
        CheckboxLigands.checked = false;
        mobileCheckboxLigands.checked = false;
    }
    if (CheckboxLigandsStick.checked) {
        CheckboxLigandsStick.checked = false;
        mobileCheckboxLigandsStick.checked = false;
    }
    if (CheckboxSolvent.checked) {
        CheckboxSolvent.checked = false;
        mobileCheckboxSolvent.checked = false;
    }

    //$('.openrinbutton').addClass('disabled');
    CheckNonCovAtoms.disabled = true;
    CheckNonCovTypeColor.classList.add('disabled');
    CheckNonCovTypeColor.classList.remove('activeSpan');
    CheckNonCovDistanceColor.classList.add('disabled');
    CheckNonCovDistanceColor.classList.remove('activeSpan');
    mobileCheckNonCovAtoms.classList.add('disabled');
    mobileCheckNonCovTypeColor.classList.add('disabled');
    mobileCheckNonCovTypeColor.classList.remove('activeSpan');
    mobileCheckNonCovDistanceColor.classList.add('disabled');
    mobileCheckNonCovDistanceColor.classList.remove('activeSpan');
}

////////////////////////////////////////////////////////////////////////
//Document Ready
////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
    mouse2.x = 9999;

    SecondaryStructureScene.name = 'scenaSecondary';
    AtomBondsScene.name = 'collegamenti';
    SmallAtomScene.name = 'atomi2';
    AtomScene.name = 'atomi1';
    WireframeScene.name = 'scenaWireframe';
    LigandsScene.name = 'ligands1';
    SmallLigandsScene.name = 'ligands2';
    LigandBondsScene.name = 'ligandbonds';
    ScenaSolvents.name = 'solventi';
    VDWSurfaceScene.name = 'scenaVdwSurface';
    SASSurfaceScene.name = 'scenaSasSurface';
    SESSurfaceScene.name = 'scenaSesSurface';
    MSSurfaceScene.name = 'scenaMsSurface';

    //VR SCENES
    /*ScenaAtomi2VR.name = "atomi2VR";
    ScenaAtomi1VR.name = "atomi1VR";
    ScenaLigands1VR.name = "ligands1VR";
    ScenaLigands2VR.name = "ligands2VR";
    ScenaSolventsVR.name = "solventiVR";
    */
    //NON_COVALENT BONDS SCENES
    HBONDScene.name = 'HBOND';
    VDWScene.name = 'VDW';
    SBONDScene.name = 'SBOND';
    IONICScene.name = 'IONIC';
    GENERICScene.name = 'GENERIC';
    PIPISTACKScene.name = 'PIPISTACK';
    PICATIONScene.name = 'PICATION';

    //TOAST POPUP
    toast = document.getElementById('snackbarT');
    //checkboxes
    CheckboxAtomi = document.getElementById('Check_atoms');
    CheckboxCollegamenti = document.getElementById('Check_sticks');
    CheckboxSecondary = document.getElementById('Check_Secondary');
    CheckboxWireframe = document.getElementById('Check_wireframe');
    CheckboxLigands = document.getElementById('Check_ligands');
    CheckboxLigandsStick = document.getElementById('Check_ligands_sticks');
    CheckboxSolvent = document.getElementById('Check_solvent');
    CheckboxResidueColor = document.getElementById('residuespan');
    CheckBoxElemColor = document.getElementById('elemspan');
    CheckBoxSecColor = document.getElementById('secspan');
    CheckboxChainColor = document.getElementById('chainspan');
    CheckboxNonCovColor = document.getElementById('bondspan');
    CheckBfactorColor = document.getElementById('bfactorspan');
    CheckHydroColor = document.getElementById('hydrospan');
    CheckSpectrumColor = document.getElementById('spectrumspan');
    CheckChainSpectrumColor = document.getElementById('chainspectrumspan');

    lastCheckColor = CheckBoxElemColor;

    CheckboxHBOND = document.getElementById('Check_hbond');
    CheckboxVDW = document.getElementById('Check_vdw');
    CheckboxSBOND = document.getElementById('Check_sbond');
    CheckboxIONIC = document.getElementById('Check_ionic');
    CheckboxPIPISTACK = document.getElementById('Check_pipistack');
    CheckboxPICATION = document.getElementById('Check_pication');
    CheckboxGENERIC = document.getElementById('Check_GENERIC');
    CheckNonCovAtoms = document.getElementById('Check_noncov_atoms');
    CheckNonCovDistanceColor = document.getElementById('Check_noncovdistancecolor');
    CheckNonCovTypeColor = document.getElementById('Check_noncovtypecolor');

    CheckVDWSurface = document.getElementById('check_vdw_surface');
    CheckSasSurface = document.getElementById('check_sas_surface');
    CheckSesSurface = document.getElementById('check_ses_surface');
    CheckMsSurface = document.getElementById('check_ms_surface');
    mobileCheckVDWSurface = document.getElementById('mobile_check_vdw_surface');
    mobileCheckSasSurface = document.getElementById('mobile_check_sas_surface');
    mobileCheckSesSurface = document.getElementById('mobile_check_ses_surface');
    mobileCheckMsSurface = document.getElementById('mobile_check_ms_surface');
    VDWswitch = document.getElementById('vdwswitch');
    SASswitch = document.getElementById('sasswitch');
    SESswitch = document.getElementById('sesswitch');
    Mswitch = document.getElementById('mswitch');

    //mobile checkboxes
    mobileCheckboxAtoms = document.getElementById('mobilecheck_atoms');
    mobileCheckboxBonds = document.getElementById('mobilecheck_rod');
    mobileCheckboxSecondary = document.getElementById('mobilecheck_sec');
    mobileCheckboxWireframe = document.getElementById('mobilecheck_wireframe');
    mobileCheckboxLigands = document.getElementById('mobilecheck_ligandsphere');
    mobileCheckboxLigandsStick = document.getElementById('mobilecheck_ligandrod');
    mobileCheckboxSolvent = document.getElementById('mobilecheck_water');

    mobileCheckboxResidueColor = document.getElementById('mobileresspan');
    mobileCheckBoxElemColor = document.getElementById('mobileelemspan');
    mobileCheckBoxSecColor = document.getElementById('mobilesecspan');
    mobileCheckboxChainColor = document.getElementById('mobilechainspan');
    mobileCheckboxNonCovColor = document.getElementById('mobilenoncovbondsspan');
    mobileCheckBfactorColor = document.getElementById('mobilebfactorspan');
    mobileCheckHydroColor = document.getElementById('mobilehydrospan');
    mobileCheckSpectrumColor = document.getElementById('mobilespectrumspan');
    mobileCheckChainSpectrumColor = document.getElementById('mobilechainspectspan');

    mobilelastCheckColor = mobileCheckBoxElemColor;

    mobileCheckboxHBOND = document.getElementById('mobilecheck_hbond');
    mobileCheckboxVDW = document.getElementById('mobilecheck_vdw');
    mobileCheckboxSBOND = document.getElementById('mobilecheck_sbond');
    mobileCheckboxIONIC = document.getElementById('mobilecheck_ionic');
    mobileCheckboxPIPISTACK = document.getElementById('mobilecheck_pipistack');
    mobileCheckboxPICATION = document.getElementById('mobilecheck_pication');
    mobileCheckboxGENERIC = document.getElementById('mobilecheck_GENERIC');
    mobileCheckNonCovAtoms = document.getElementById('mobilecheck_noncov_atoms');
    mobileCheckNonCovDistanceColor = document.getElementById('mobilecheck_noncovdistancecolor');
    mobileCheckNonCovTypeColor = document.getElementById('mobilecheck_noncovtypecolor');

    //CheckRIN = document.getElementById('rinbutton');

    document.getElementById('canvas').appendChild(renderer.domElement);

    /////////////////////////////////////////////////////////////////////
    //RENDERER SETTINGS
    //////////////////////////////////////////////////////////////////////

    renderer.domElement.setAttribute('style', 'touch-action: none;');
    renderer.domElement.setAttribute('style', 'z-index: 0;');
    renderer.domElement.setAttribute('style', 'user-select: none;');
    renderer.domElement.setAttribute('style', '-webkit-user-drag: none;');
    renderer.domElement.setAttribute('style', '-webkit-tap-highlight-color: none;');
    renderer.domElement.setAttribute('style', '-webkit-tap-highlight-color:  rgba(0, 0, 0, 0);');
    renderer.domElement.setAttribute('style', 'position: absolute;');
    renderer.domElement.setAttribute('style', 'cursor: crosshair;');
    renderer.domElement.setAttribute('style', 'width: 100% !important;');
    renderer.domElement.setAttribute('style', 'height: 100% !important;');
    renderer.domElement.setAttribute('style', 'overflow: hidden;');
    renderer.domElement.setAttribute('style', 'box-sizing: border-box;');
    renderer.domElement.setAttribute('style', 'background: none;');

    ////////////////////////////////////////////////////////
    //CALLBACK CHECKBOX
    ////////////////////////////////////////////////////////

    CheckboxAtomi.oninput = (event) => {
        if (AtomScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                renderAllAtoms();
                addSphere(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addSphere(event);
        }
        event.target.checked == true ? (mobileCheckboxAtoms.checked = 'true') : (mobileCheckboxAtoms.checked = 'false');
    };
    mobileCheckboxAtoms.oninput = (event) => {
        if (AtomScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                renderAllAtoms();
                addSphere(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addSphere(event);
        }
        event.target.checked == true ? (CheckboxAtomi.checked = 'true') : (CheckboxAtomi.checked = 'false');
    };

    function addSphere(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                if (sessionMode == 'immersive-vr') {
                    Scene.add(ScenaAtomi1VR);
                    let atoms = Scene.getObjectByName('atomsVR');
                    FUNCTIONS.prepareForVR(atoms, false);
                } else if (sessionMode == 'inline') {
                    Scene.add(AtomScene);
                    selectables.push(Scene.getObjectByName('atoms'));
                } else {
                    //sessionMode == "immersive-ar"
                    Scene.add(AtomScene);
                    let atoms = Scene.getObjectByName('atoms');
                    FUNCTIONS.prepareForAR(atoms);
                }
            } else {
                if (sessionMode == 'immersive-vr') {
                    let obj = Scene.getObjectByName('atomsVR');
                    XRControllers.cleanIntersected(obj);
                    FUNCTIONS.prepareForNONVR(obj, true);
                    Scene.remove(Scene.getObjectByName('atomi1VR'));
                } else if (sessionMode == 'inline') {
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'atoms'),
                        1
                    );
                    Scene.remove(Scene.getObjectByName('atomi1'));
                } else {
                    //sessionMode == "immersive-ar"
                    let atoms;
                    if (CheckNonCovAtoms.checked) {
                        atoms = pivot.getObjectByUserDataProperty('type', 'atoms_COVAR');
                    } else {
                        atoms = pivot.getObjectByUserDataProperty('type', 'atomsAR');
                    }
                    FUNCTIONS.prepareForNonAR(atoms, true);
                    Scene.remove(Scene.getObjectByName('atomi1'));
                }
            }
        }
    }

    CheckboxCollegamenti.oninput = (event) => {
        if (AtomBondsScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                renderAllAtoms();
                renderAtomBonds();
                addBond(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addBond(event);
        }
        event.target.checked == true ? (mobileCheckboxBonds.checked = 'true') : (mobileCheckboxBonds.checked = 'false');
    };

    mobileCheckboxBonds.oninput = (event) => {
        if (AtomBondsScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                renderAllAtoms();
                renderAtomBonds();
                addBond(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addBond(event);
        }
        event.target.checked == true ? (CheckboxCollegamenti.checked = 'true') : (CheckboxCollegamenti.checked = 'false');
    };

    function addBond(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                if (sessionMode == 'immersive-vr') {
                    Scene.add(ScenaAtomi2VR);
                    Scene.add(AtomBondsScene);
                    let bonds = Scene.getObjectByName('bonds');
                    let atoms = Scene.getObjectByName('smallatomsVR');
                    FUNCTIONS.prepareForVR(atoms, false);
                    FUNCTIONS.prepareForVR(bonds, false);
                } else if (sessionMode == 'inline') {
                    Scene.add(AtomBondsScene);
                    Scene.add(SmallAtomScene);
                    selectables.push(Scene.getObjectByName('smallatoms'));
                    selectables.push(Scene.getObjectByName('bonds'));
                } else {
                    //sessionMode == "immersive-ar"
                    Scene.add(AtomBondsScene);
                    Scene.add(SmallAtomScene);
                    let bonds = Scene.getObjectByName('bonds');
                    let atoms = Scene.getObjectByName('smallatoms');
                    FUNCTIONS.prepareForAR(atoms);
                    FUNCTIONS.prepareForAR(bonds);
                }
            } else {
                if (sessionMode == 'immersive-vr') {
                    let obj1 = Scene.getObjectByName('smallatomsVR');
                    let obj2 = Scene.getObjectByName('bonds');
                    XRControllers.cleanIntersected(obj1);
                    XRControllers.cleanIntersected(obj2);
                    FUNCTIONS.prepareForNONVR(obj1, false);
                    FUNCTIONS.prepareForNONVR(obj2, false);
                    Scene.remove(Scene.getObjectByName('atomi2VR'));
                    Scene.remove(Scene.getObjectByName('collegamenti'));
                } else if (sessionMode == 'inline') {
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'bonds'),
                        1
                    );
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'smallatoms'),
                        1
                    );
                    Scene.remove(Scene.getObjectByName('collegamenti'));
                    Scene.remove(Scene.getObjectByName('atomi2'));
                } else {
                    //sessionMode == "immersive-ar"

                    let atoms, bonds;
                    if (CheckNonCovAtoms.checked) {
                        atoms = pivot.getObjectByUserDataProperty('type', 'smallatoms_COVAR');
                        bonds = pivot.getObjectByUserDataProperty('type', 'bonds_COVAR');
                    } else {
                        atoms = pivot.getObjectByUserDataProperty('type', 'smallatomsAR');
                        bonds = pivot.getObjectByUserDataProperty('type', 'bondsAR');
                    }

                    FUNCTIONS.prepareForNonAR(atoms, true);
                    FUNCTIONS.prepareForNonAR(bonds, true);
                    Scene.remove(Scene.getObjectByName('collegamenti'));
                    Scene.remove(Scene.getObjectByName('atomi2'));
                }
            }
        }
    }

    CheckboxSecondary.oninput = (event) => {
        addSecondary(event);
        event.target.checked == true ? (mobileCheckboxSecondary.checked = 'true') : (mobileCheckboxSecondary.checked = 'false');
    };

    mobileCheckboxSecondary.oninput = (event) => {
        addSecondary(event);
        event.target.checked == true ? (CheckboxSecondary.checked = 'true') : (CheckboxSecondary.checked = 'false');
    };

    function addSecondary(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                Scene.add(SecondaryStructureScene);
                let obj = Scene.getObjectByName('secondary');

                if (sessionMode == 'immersive-vr') FUNCTIONS.prepareForVR(obj, false);
                else if (sessionMode == 'inline') {
                    selectables.push(obj);
                } else {
                    //sessionMode == "immersive-ar"
                    FUNCTIONS.prepareForAR(obj);
                }
            } else {
                let obj = Scene.getObjectByName('secondary');
                if (sessionMode == 'immersive-vr') {
                    XRControllers.cleanIntersected(obj);
                    FUNCTIONS.prepareForNONVR(obj); //remove the obj from selectables
                } else if (sessionMode == 'inline')
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'secondary'),
                        1
                    );
                else {
                    //sessionMode == "immersive-ar"
                    let secondary = pivot.getObjectByUserDataProperty('type', 'secondaryAR');
                    FUNCTIONS.prepareForNonAR(secondary, true);
                }
                Scene.remove(Scene.getObjectByName('scenaSecondary'));
            }
        }
    }

    CheckboxWireframe.oninput = (event) => {
        if (WireframeScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                renderWireFrame();
                addWireframe(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addWireframe(event);
        }
        event.target.checked == true ? (mobileCheckboxWireframe.checked = 'true') : (mobileCheckboxWireframe.checked = 'false');
    };

    mobileCheckboxWireframe.oninput = (event) => {
        if (WireframeScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                renderWireFrame();
                addWireframe(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addWireframe(event);
        }
        event.target.checked == true ? (CheckboxWireframe.checked = 'true') : (CheckboxWireframe.checked = 'false');
    };

    function addWireframe(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                Scene.add(WireframeScene);
                let obj = Scene.getObjectByName('wireframe');

                if (sessionMode == 'immersive-vr') FUNCTIONS.prepareForVR(obj, false);
                else if (sessionMode == 'inline') {
                    selectables.push(obj);
                } else {
                    //sessionMode == "immersive-ar"
                    FUNCTIONS.prepareForAR(obj);
                }
            } else {
                let obj = Scene.getObjectByName('wireframe');
                if (sessionMode == 'immersive-vr') {
                    XRControllers.cleanIntersected(obj);
                    FUNCTIONS.prepareForNONVR(obj);
                } else if (sessionMode == 'inline')
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'wireframe'),
                        1
                    );
                else {
                    //sessionMode == "immersive-ar"
                    let secondary = pivot.getObjectByUserDataProperty('type', 'wireframeAR');
                    FUNCTIONS.prepareForNonAR(secondary, true);
                }
                Scene.remove(Scene.getObjectByName('scenaWireframe'));
            }
        }
    }

    CheckboxLigands.oninput = (event) => {
        addLigand(event);
        event.target.checked == true ? (mobileCheckboxLigands.checked = 'true') : (mobileCheckboxLigands.checked = 'false');
    };

    mobileCheckboxLigands.oninput = (event) => {
        addLigand(event);
        event.target.checked == true ? (CheckboxLigands.checked = 'true') : (CheckboxLigands.checked = 'false');
    };

    function addLigand(event) {
        if (pdbloaded && ligandsPresent) {
            if (event.target.checked == true) {
                if (sessionMode == 'immersive-vr') {
                    Scene.add(ScenaLigands1VR);
                    let atoms = Scene.getObjectByName('atomsLVR');
                    if (atoms) FUNCTIONS.prepareForVR(atoms, false);
                } else if (sessionMode == 'inline') {
                    Scene.add(LigandsScene);
                    let atoms = Scene.getObjectByName('atomsL');
                    if (atoms) selectables.push(atoms);
                } else {
                    //sessionMode == "immersive-ar"
                    Scene.add(LigandsScene);
                    let atoms = Scene.getObjectByName('atomsL');
                    if (atoms) FUNCTIONS.prepareForAR(atoms);
                }
            } else {
                if (sessionMode == 'immersive-vr') {
                    let obj = Scene.getObjectByName('atomsLVR');
                    if (obj) {
                        XRControllers.cleanIntersected(obj);
                        FUNCTIONS.prepareForNONVR(obj, true);
                    }
                    Scene.remove(Scene.getObjectByName('ligands1VR'));
                } else if (sessionMode == 'inline') {
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'atomsL'),
                        1
                    );
                    Scene.remove(Scene.getObjectByName('ligands1'));
                } else {
                    //sessionMode == "immersive-ar"
                    //let obj = Scene.getObjectByName( "atomsL" );
                    let atoms;
                    if (CheckNonCovAtoms.checked) atoms = pivot.getObjectByUserDataProperty('type', 'atomsL_COVAR');
                    else {
                        atoms = pivot.getObjectByUserDataProperty('type', 'atomsLAR');
                    }
                    if (atoms) FUNCTIONS.prepareForNonAR(atoms, true);
                    Scene.remove(Scene.getObjectByName('ligands1'));
                }
            }
        }
    }

    CheckboxLigandsStick.oninput = (event) => {
        addLigandStick(event);
        event.target.checked == true ? (mobileCheckboxLigandsStick.checked = 'true') : (mobileCheckboxLigandsStick.checked = 'false');
    };

    mobileCheckboxLigandsStick.oninput = (event) => {
        addLigandStick(event);
        event.target.checked == true ? (CheckboxLigandsStick.checked = 'true') : (CheckboxLigandsStick.checked = 'false');
    };

    function addLigandStick(event) {
        if (pdbloaded && ligandsPresent) {
            if (event.target.checked == true) {
                if (sessionMode == 'immersive-vr') {
                    Scene.add(ScenaLigands2VR);
                    if (LigandBondsScene.children.length) {
                        Scene.add(LigandBondsScene);
                        let bonds = Scene.getObjectByName('bondsLVR');
                        FUNCTIONS.prepareForVR(bonds, false);
                    }
                    let atoms = Scene.getObjectByName('smallatomsLVR');
                    if (atoms) FUNCTIONS.prepareForVR(atoms, false);
                } else if (sessionMode == 'inline') {
                    Scene.add(SmallLigandsScene);
                    if (LigandBondsScene.children.length) {
                        Scene.add(LigandBondsScene);
                        selectables.push(Scene.getObjectByName('bondsL'));
                    }
                    let atoms = Scene.getObjectByName('smallatomsL');
                    if (atoms) selectables.push(atoms);
                } else {
                    //sessionMode == "immersive-ar"
                    Scene.add(SmallLigandsScene);
                    if (LigandBondsScene.children.length) {
                        Scene.add(LigandBondsScene);
                        let bonds = Scene.getObjectByName('bondsL');
                        FUNCTIONS.prepareForAR(bonds);
                    }
                    let atoms = Scene.getObjectByName('smallatomsL');
                    if (atoms) FUNCTIONS.prepareForAR(atoms);
                }
            } else {
                if (sessionMode == 'immersive-vr') {
                    let obj = Scene.getObjectByName('smallatomsLVR');
                    let obj2 = Scene.getObjectByName('bondsL');
                    if (obj2) {
                        XRControllers.cleanIntersected(obj2);
                        FUNCTIONS.prepareForNONVR(obj2, true);
                    }
                    Scene.remove(Scene.getObjectByName('ligandbonds'));

                    if (obj) {
                        XRControllers.cleanIntersected(obj);
                        FUNCTIONS.prepareForNONVR(obj, true);
                    }
                    Scene.remove(Scene.getObjectByName('ligands2VR'));
                } else if (sessionMode == 'inline') {
                    let obj = Scene.getObjectByName('ligandbonds');
                    if (obj) {
                        selectables.splice(
                            selectables.findIndex((x) => x.name === 'bondsL'),
                            1
                        );
                        Scene.remove(obj);
                    }
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'smallatomsL'),
                        1
                    );
                    Scene.remove(Scene.getObjectByName('ligands2'));
                } else {
                    //sessionMode == "immersive-ar"
                    //let atoms = Scene.getObjectByName( "smallatomsL" );
                    let atoms, bonds;
                    if (CheckNonCovAtoms.checked) {
                        atoms = pivot.getObjectByUserDataProperty('type', 'smallatomsL_COVAR');
                        bonds = pivot.getObjectByUserDataProperty('type', 'bondsL_COVAR');
                    } else {
                        atoms = pivot.getObjectByUserDataProperty('type', 'smallatomsLAR');
                        bonds = pivot.getObjectByUserDataProperty('type', 'bondsLAR');
                    }
                    if (bonds) {
                        FUNCTIONS.prepareForNonAR(bonds, true);
                    }
                    Scene.remove(Scene.getObjectByName('ligandbonds'));
                    if (atoms) FUNCTIONS.prepareForNonAR(atoms, true);
                    Scene.remove(Scene.getObjectByName('ligands2'));
                }
            }
        }
    }

    CheckboxSolvent.oninput = (event) => {
        addSolvent(event);
        event.target.checked == true ? (mobileCheckboxSolvent.checked = 'true') : (mobileCheckboxSolvent.checked = 'false');
    };

    mobileCheckboxSolvent.oninput = (event) => {
        addSolvent(event);
        event.target.checked == true ? (CheckboxSolvent.checked = 'true') : (CheckboxSolvent.checked = 'false');
    };

    function addSolvent(event) {
        if (pdbloaded && solventPresent) {
            if (event.target.checked == true) {
                if (sessionMode == 'immersive-vr') {
                    Scene.add(ScenaSolventsVR);
                    let atoms = Scene.getObjectByName('solventsVR');
                    if (atoms) FUNCTIONS.prepareForVR(atoms, false);
                } else if (sessionMode == 'inline') {
                    Scene.add(ScenaSolvents);
                    let atoms = Scene.getObjectByName('solvents');
                    if (atoms) selectables.push(atoms);
                } else {
                    //sessionMode == "immersive-ar"
                    Scene.add(ScenaSolvents);
                    let atoms = Scene.getObjectByName('solvents');
                    if (atoms) FUNCTIONS.prepareForAR(atoms);
                }
            } else {
                if (sessionMode == 'immersive-vr') {
                    let obj = Scene.getObjectByName('solventsVR');
                    if (obj) {
                        XRControllers.cleanIntersected(obj);
                        FUNCTIONS.prepareForNONVR(obj, true);
                    }
                    Scene.remove(Scene.getObjectByName('solventiVR'));
                } else if (sessionMode == 'inline') {
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'solvents'),
                        1
                    );
                    Scene.remove(Scene.getObjectByName('solventi'));
                } else {
                    //sessionMode == "immersive-vr"
                    //let obj = Scene.getObjectByName( "solvents" );

                    let obj = pivot.getObjectByUserDataProperty('type', 'solventsAR');
                    if (obj) FUNCTIONS.prepareForNonAR(obj, true);
                    Scene.remove(Scene.getObjectByName('solventi'));
                }
            }
        }
    }

    CheckVDWSurface.oninput = (event) => {
        if (VDWSurfaceScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                drawSurface(1, 'vdwsurface');
                addVDWSurface(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addVDWSurface(event);
        }
        event.target.checked == true ? (mobileCheckVDWSurface.checked = 'true') : (mobileCheckVDWSurface.checked = 'false');
    };

    mobileCheckVDWSurface.oninput = (event) => {
        if (VDWSurfaceScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                drawSurface(1, 'vdwsurface');
                addVDWSurface(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addVDWSurface(event);
        }
        event.target.checked == true ? (CheckVDWSurface.checked = 'true') : (CheckVDWSurface.checked = 'false');
    };

    function addVDWSurface(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                if (sessionMode == 'immersive-vr') {
                    Scene.add(VDWSurfaceScene);
                    let atoms = Scene.getObjectByName('vdwsurface');
                    if (atoms) FUNCTIONS.prepareForVR(atoms, false);
                } else if (sessionMode == 'inline') {
                    Scene.add(VDWSurfaceScene);
                    let atoms = Scene.getObjectByName('vdwsurface');
                    if (atoms) selectables.push(atoms);
                } else {
                    //sessionMode == "immersive-ar"
                    Scene.add(VDWSurfaceScene);
                    let atoms = Scene.getObjectByName('vdwsurface');
                    if (atoms) FUNCTIONS.prepareForAR(atoms);
                }
            } else {
                if (sessionMode == 'immersive-vr') {
                    let obj = Scene.getObjectByName('vdwsurface');
                    if (obj) {
                        XRControllers.cleanIntersected(obj);
                        FUNCTIONS.prepareForNONVR(obj, true);
                    }
                    Scene.remove(Scene.getObjectByName('scenaVdwSurface'));
                } else if (sessionMode == 'inline') {
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'vdwsurface'),
                        1
                    );
                    Scene.remove(Scene.getObjectByName('scenaVdwSurface'));
                } else {
                    //sessionMode == "immersive-vr"
                    let obj = pivot.getObjectByUserDataProperty('type', 'vdwsurfaceAR');
                    if (obj) FUNCTIONS.prepareForNonAR(obj, true);
                    Scene.remove(Scene.getObjectByName('scenaVdwSurface'));
                }
            }
        }
    }

    CheckSasSurface.oninput = (event) => {
        if (SASSurfaceScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                drawSurface(3, 'sassurface'); //type 1: VDW 3: SAS 4: MS 2: SES
                addSASSurface(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addSASSurface(event);
        }
        event.target.checked == true ? (mobileCheckSasSurface.checked = 'true') : (mobileCheckSasSurface.checked = 'false');
    };

    mobileCheckSasSurface.oninput = (event) => {
        if (SASSurfaceScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                drawSurface(3, 'sassurface'); //type 1: VDW 3: SAS 4: MS 2: SES
                addSASSurface(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addSASSurface(event);
        }
        event.target.checked == true ? (CheckSasSurface.checked = 'true') : (CheckSasSurface.checked = 'false');
    };

    function addSASSurface(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                if (sessionMode == 'immersive-vr') {
                    Scene.add(SASSurfaceScene);
                    let atoms = Scene.getObjectByName('sassurface');
                    if (atoms) FUNCTIONS.prepareForVR(atoms, false);
                } else if (sessionMode == 'inline') {
                    Scene.add(SASSurfaceScene);
                    let atoms = Scene.getObjectByName('sassurface');
                    if (atoms) selectables.push(atoms);
                } else {
                    //sessionMode == "immersive-ar"
                    Scene.add(SASSurfaceScene);
                    let atoms = Scene.getObjectByName('sassurface');
                    if (atoms) FUNCTIONS.prepareForAR(atoms);
                }
            } else {
                if (sessionMode == 'immersive-vr') {
                    let obj = Scene.getObjectByName('sassurface');
                    if (obj) {
                        XRControllers.cleanIntersected(obj);
                        FUNCTIONS.prepareForNONVR(obj, true);
                    }
                    Scene.remove(Scene.getObjectByName('scenaSasSurface'));
                } else if (sessionMode == 'inline') {
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'sassurface'),
                        1
                    );
                    Scene.remove(Scene.getObjectByName('scenaSasSurface'));
                } else {
                    //sessionMode == "immersive-vr"
                    let obj = pivot.getObjectByUserDataProperty('type', 'sassurfaceAR');
                    if (obj) FUNCTIONS.prepareForNonAR(obj, true);
                    Scene.remove(Scene.getObjectByName('scenaSasSurface'));
                }
            }
        }
    }

    CheckSesSurface.oninput = (event) => {
        if (SESSurfaceScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                drawSurface(2, 'sessurface'); //type 1: VDW 3: SAS 4: MS 2: SES
                addSESSurface(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addSESSurface(event);
        }
        event.target.checked == true ? (mobileCheckSesSurface.checked = 'true') : (mobileCheckSesSurface.checked = 'false');
    };

    mobileCheckSesSurface.oninput = (event) => {
        if (SESSurfaceScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                drawSurface(2, 'sessurface'); //type 1: VDW 3: SAS 4: MS 2: SES
                addSESSurface(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addSESSurface(event);
        }
        event.target.checked == true ? (CheckSesSurface.checked = 'true') : (CheckSesSurface.checked = 'false');
    };

    function addSESSurface(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                if (sessionMode == 'immersive-vr') {
                    Scene.add(SESSurfaceScene);
                    let atoms = Scene.getObjectByName('sessurface');
                    if (atoms) FUNCTIONS.prepareForVR(atoms, false);
                } else if (sessionMode == 'inline') {
                    Scene.add(SESSurfaceScene);
                    let atoms = Scene.getObjectByName('sessurface');
                    if (atoms) selectables.push(atoms);
                } else {
                    //sessionMode == "immersive-ar"
                    Scene.add(SESSurfaceScene);
                    let atoms = Scene.getObjectByName('sessurface');
                    if (atoms) FUNCTIONS.prepareForAR(atoms);
                }
            } else {
                if (sessionMode == 'immersive-vr') {
                    let obj = Scene.getObjectByName('sessurface');
                    if (obj) {
                        XRControllers.cleanIntersected(obj);
                        FUNCTIONS.prepareForNONVR(obj, true);
                    }
                    Scene.remove(Scene.getObjectByName('scenaSesSurface'));
                } else if (sessionMode == 'inline') {
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'sessurface'),
                        1
                    );
                    Scene.remove(Scene.getObjectByName('scenaSesSurface'));
                } else {
                    //sessionMode == "immersive-vr"
                    let obj = pivot.getObjectByUserDataProperty('type', 'sessurfaceAR');
                    if (obj) FUNCTIONS.prepareForNonAR(obj, true);
                    Scene.remove(Scene.getObjectByName('scenaSesSurface'));
                }
            }
        }
    }

    CheckMsSurface.oninput = (event) => {
        if (MSSurfaceScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                drawSurface(4, 'mssurface'); //type 1: VDW 3: SAS 4: MS 2: SES
                addMSSurface(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addMSSurface(event);
        }
        event.target.checked == true ? (mobileCheckMsSurface.checked = 'true') : (mobileCheckMsSurface.checked = 'false');
    };

    mobileCheckMsSurface.oninput = (event) => {
        if (MSSurfaceScene.children.length == 0) {
            $.LoadingOverlay('show', {
                image: '',
                fontawesome: 'fas fa-dna fa-pulse',
            });
            setTimeout(function () {
                drawSurface(4, 'mssurface'); //type 1: VDW 3: SAS 4: MS 2: SES
                addMSSurface(event);
                $.LoadingOverlay('hide');
            }, 300);
        } else {
            addMSSurface(event);
        }
        event.target.checked == true ? (CheckMsSurface.checked = 'true') : (CheckMsSurface.checked = 'false');
    };

    function addMSSurface(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                if (sessionMode == 'immersive-vr') {
                    Scene.add(MSSurfaceScene);
                    let atoms = Scene.getObjectByName('mssurface');
                    if (atoms) FUNCTIONS.prepareForVR(atoms, false);
                } else if (sessionMode == 'inline') {
                    Scene.add(MSSurfaceScene);
                    let atoms = Scene.getObjectByName('mssurface');
                    if (atoms) selectables.push(atoms);
                } else {
                    //sessionMode == "immersive-ar"
                    Scene.add(MSSurfaceScene);
                    let atoms = Scene.getObjectByName('mssurface');
                    if (atoms) FUNCTIONS.prepareForAR(atoms);
                }
            } else {
                if (sessionMode == 'immersive-vr') {
                    let obj = Scene.getObjectByName('mssurface');
                    if (obj) {
                        XRControllers.cleanIntersected(obj);
                        FUNCTIONS.prepareForNONVR(obj, true);
                    }
                    Scene.remove(Scene.getObjectByName('scenaMsSurface'));
                } else if (sessionMode == 'inline') {
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'mssurface'),
                        1
                    );
                    Scene.remove(Scene.getObjectByName('scenaMsSurface'));
                } else {
                    //sessionMode == "immersive-vr"
                    let obj = pivot.getObjectByUserDataProperty('type', 'mssurfaceAR');
                    if (obj) FUNCTIONS.prepareForNonAR(obj, true);
                    Scene.remove(Scene.getObjectByName('scenaMsSurface'));
                }
            }
        }
    }

    VDWswitch.oninput = (event) => {
        if (event.target.checked == true) {
            var mesh = VDWSurfaceScene.getObjectByName('', true);
            mesh.material.wireframe = true;
            mesh.material.wireframeLinewidth = 1;
            mesh.geometry.index.needsUpdate = true;
        } else {
            var mesh = VDWSurfaceScene.getObjectByName('', true);
            mesh.material.wireframe = false;
            mesh.geometry.index.needsUpdate = true;
        }
    };
    SASswitch.oninput = (event) => {
        if (event.target.checked == true) {
            var mesh = SASSurfaceScene.getObjectByName('', true);
            mesh.material.wireframe = true;
            mesh.material.wireframeLinewidth = 1;
            mesh.geometry.index.needsUpdate = true;
        } else {
            var mesh = SASSurfaceScene.getObjectByName('', true);
            mesh.material.wireframe = false;
            mesh.geometry.index.needsUpdate = true;
        }
    };
    SESswitch.oninput = (event) => {
        if (event.target.checked == true) {
            var mesh = SESSurfaceScene.getObjectByName('', true);
            mesh.material.wireframe = true;
            mesh.material.wireframeLinewidth = 1;
            mesh.geometry.index.needsUpdate = true;
        } else {
            var mesh = SESSurfaceScene.getObjectByName('', true);
            mesh.material.wireframe = false;
            mesh.geometry.index.needsUpdate = true;
        }
    };
    Mswitch.oninput = (event) => {
        if (event.target.checked == true) {
            var mesh = MSSurfaceScene.getObjectByName('', true);
            mesh.material.wireframe = true;
            mesh.material.wireframeLinewidth = 1;
            mesh.geometry.index.needsUpdate = true;
        } else {
            var mesh = MSSurfaceScene.getObjectByName('', true);
            mesh.material.wireframe = false;
            mesh.geometry.index.needsUpdate = true;
        }
    };

    CheckboxResidueColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        lastCheckColor.classList.remove('activeSpan');
        lastCheckColor = event.target;
        mobileCheckboxResidueColor.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activespan');
        mobilelastCheckColor = mobileCheckboxResidueColor;

        changeColor('residue', event.target);
    };

    mobileCheckboxResidueColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activeSpan');
        mobilelastCheckColor = event.target;
        CheckboxResidueColor.classList.add('activeSpan');
        lastCheckColor.classList.remove('activespan');
        lastCheckColor = CheckboxResidueColor;

        changeColor('residue', event.target);
    };

    CheckBoxElemColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        lastCheckColor.classList.remove('activeSpan');
        lastCheckColor = event.target;
        mobileCheckBoxElemColor.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activespan');
        mobilelastCheckColor = mobileCheckBoxElemColor;

        changeColor('element', event.target);
    };

    mobileCheckBoxElemColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activeSpan');
        mobilelastCheckColor = event.target;
        CheckBoxSecColor.classList.add('activeSpan');
        lastCheckColor.classList.remove('activespan');
        lastCheckColor = CheckBoxElemColor;

        changeColor('element', event.target);
    };

    CheckBoxSecColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        lastCheckColor.classList.remove('activeSpan');
        lastCheckColor = event.target;
        mobileCheckBoxSecColor.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activespan');
        mobilelastCheckColor = mobileCheckBoxElemColor;

        changeColor('secondary', event.target);
    };

    mobileCheckBoxSecColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activeSpan');
        mobilelastCheckColor = event.target;
        CheckBoxSecColor.classList.add('activeSpan');
        lastCheckColor.classList.remove('activespan');
        lastCheckColor = CheckBoxSecColor;

        changeColor('secondary', event.target);
    };

    CheckboxChainColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        lastCheckColor.classList.remove('activeSpan');
        lastCheckColor = event.target;
        mobileCheckboxChainColor.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activespan');
        mobilelastCheckColor = mobileCheckBoxElemColor;

        changeColor('chain', event.target);
    };

    mobileCheckboxChainColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activeSpan');
        mobilelastCheckColor = event.target;
        CheckboxChainColor.classList.add('activeSpan');
        lastCheckColor.classList.remove('activespan');
        lastCheckColor = CheckBoxSecColor;

        changeColor('chain', event.target);
    };

    CheckboxNonCovColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        lastCheckColor.classList.remove('activeSpan');
        lastCheckColor = event.target;
        mobileCheckboxNonCovColor.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activespan');
        mobilelastCheckColor = mobileCheckBoxElemColor;

        changeColor('noncov', event.target);
    };

    mobileCheckboxNonCovColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activeSpan');
        mobilelastCheckColor = event.target;
        CheckboxNonCovColor.classList.add('activeSpan');
        lastCheckColor.classList.remove('activespan');
        lastCheckColor = CheckBoxSecColor;

        changeColor('noncov', event.target);
    };

    CheckBfactorColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        lastCheckColor.classList.remove('activeSpan');
        lastCheckColor = event.target;
        mobileCheckBfactorColor.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activespan');
        mobilelastCheckColor = mobileCheckBoxElemColor;

        changeColor('BFactor', event.target);
    };

    mobileCheckBfactorColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activeSpan');
        mobilelastCheckColor = event.target;
        CheckBfactorColor.classList.add('activeSpan');
        lastCheckColor.classList.remove('activespan');
        lastCheckColor = CheckBoxSecColor;

        changeColor('BFactor', event.target);
    };

    CheckHydroColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        lastCheckColor.classList.remove('activeSpan');
        lastCheckColor = event.target;
        mobileCheckHydroColor.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activespan');
        mobilelastCheckColor = mobileCheckBoxElemColor;

        changeColor('hydrofobicity', event.target);
    };

    mobileCheckHydroColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activeSpan');
        mobilelastCheckColor = event.target;
        CheckHydroColor.classList.add('activeSpan');
        lastCheckColor.classList.remove('activespan');
        lastCheckColor = CheckBoxSecColor;

        changeColor('hydrofobicity', event.target);
    };

    CheckSpectrumColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        lastCheckColor.classList.remove('activeSpan');
        lastCheckColor = event.target;
        mobileCheckSpectrumColor.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activespan');
        mobilelastCheckColor = mobileCheckBoxElemColor;

        changeColor('spectrum', event.target);
    };

    mobileCheckSpectrumColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activeSpan');
        mobilelastCheckColor = event.target;
        CheckSpectrumColor.classList.add('activeSpan');
        lastCheckColor.classList.remove('activespan');
        lastCheckColor = CheckBoxSecColor;

        changeColor('spectrum', event.target);
    };

    CheckChainSpectrumColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        lastCheckColor.classList.remove('activeSpan');
        lastCheckColor = event.target;
        mobileCheckChainSpectrumColor.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activespan');
        mobilelastCheckColor = mobileCheckBoxElemColor;

        changeColor('chainspectrum', event.target);
    };

    mobileCheckChainSpectrumColor.onclick = (event) => {
        event.target.classList.add('activeSpan');
        mobilelastCheckColor.classList.remove('activeSpan');
        mobilelastCheckColor = event.target;
        CheckChainSpectrumColor.classList.add('activeSpan');
        lastCheckColor.classList.remove('activespan');
        lastCheckColor = CheckBoxSecColor;

        changeColor('chainspectrum', event.target);
    };

    CheckNonCovDistanceColor.onclick = (event) => {
        if (bondloaded) {
            changeColor('covdistance', event.target);
            CheckNonCovTypeColor.classList.remove('activeSpan');
            mobileCheckNonCovTypeColor.classList.remove('activeSpan');
            CheckNonCovDistanceColor.classList.add('activeSpan');
            mobileCheckNonCovDistanceColor.classList.add('activeSpan');
        }
    };

    mobileCheckNonCovDistanceColor.onclick = (event) => {
        if (bondloaded) {
            changeColor('covdistance', event.target);
            CheckNonCovTypeColor.classList.remove('activeSpan');
            mobileCheckNonCovTypeColor.classList.remove('activeSpan');
            CheckNonCovDistanceColor.classList.add('activeSpan');
            mobileCheckNonCovDistanceColor.classList.add('activeSpan');
        }
    };

    CheckNonCovTypeColor.onclick = (event) => {
        if (bondloaded) {
            changeColor('covtype', event.target);
            CheckNonCovDistanceColor.classList.remove('activeSpan');
            mobileCheckNonCovDistanceColor.classList.remove('activeSpan');
            CheckNonCovTypeColor.classList.add('activeSpan');
            mobileCheckNonCovTypeColor.classList.add('activeSpan');
        }
    };

    mobileCheckNonCovTypeColor.onclick = (event) => {
        if (bondloaded) {
            changeColor('covtype', event.target);
            CheckNonCovDistanceColor.classList.remove('activeSpan');
            mobileCheckNonCovDistanceColor.classList.remove('activeSpan');
            CheckNonCovTypeColor.classList.add('activeSpan');
            mobileCheckNonCovTypeColor.classList.add('activeSpan');
        }
    };

    CheckboxHBOND.oninput = (event) => {
        addHBOND(event);
        event.target.checked == true ? (mobileCheckboxHBOND.checked = 'true') : (mobileCheckboxHBOND.checked = 'false');
    };

    mobileCheckboxHBOND.oninput = (event) => {
        addHBOND(event);
        event.target.checked == true ? (CheckboxHBOND.checked = 'true') : (CheckboxHBOND.checked = 'false');
    };

    function addHBOND(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                Scene.add(HBONDScene);
                if (sessionMode == 'immersive-ar') {
                    FUNCTIONS.prepareForAR(Scene.getObjectByName('bond_HBOND'));
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.push(Scene.getObjectByName('bond_HBOND'));
                }
            } else {
                if (sessionMode == 'immersive-ar') {
                    let obj = pivot.getObjectByUserDataProperty('type', 'bond_HBONDAR');
                    FUNCTIONS.prepareForNonAR(obj, true);
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'bond_HBOND'),
                        1
                    );
                }
                Scene.remove(Scene.getObjectByName('HBOND'));
            }
        }
    }

    CheckboxVDW.oninput = (event) => {
        addVDW(event);
        event.target.checked == true ? (mobileCheckboxVDW.checked = 'true') : (mobileCheckboxVDW.checked = 'false');
    };

    mobileCheckboxVDW.oninput = (event) => {
        addVDW(event);
        event.target.checked == true ? (CheckboxVDW.checked = 'true') : (CheckboxVDW.checked = 'false');
    };

    function addVDW(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                Scene.add(VDWScene);
                if (sessionMode == 'immersive-ar') {
                    FUNCTIONS.prepareForAR(Scene.getObjectByName('bond_VDW'));
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.push(Scene.getObjectByName('bond_VDW'));
                }
            } else {
                if (sessionMode == 'immersive-ar') {
                    let obj = pivot.getObjectByUserDataProperty('type', 'bond_VDWAR');
                    FUNCTIONS.prepareForNonAR(obj, true);
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'bond_VDW'),
                        1
                    );
                }
                Scene.remove(Scene.getObjectByName('VDW'));
            }
        }
    }

    CheckboxSBOND.oninput = (event) => {
        addSBOND(event);
        event.target.checked == true ? (mobileCheckboxSBOND.checked = 'true') : (mobileCheckboxSBOND.checked = 'false');
    };

    mobileCheckboxSBOND.oninput = (event) => {
        addSBOND(event);
        event.target.checked == true ? (CheckboxSBOND.checked = 'true') : (CheckboxSBOND.checked = 'false');
    };

    function addSBOND(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                Scene.add(SBONDScene);
                if (sessionMode == 'immersive-ar') {
                    FUNCTIONS.prepareForAR(Scene.getObjectByName('bond_SSBOND'));
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.push(Scene.getObjectByName('bond_SSBOND'));
                }
            } else {
                if (sessionMode == 'immersive-ar') {
                    let obj = pivot.getObjectByUserDataProperty('type', 'bond_SSBONDAR');
                    FUNCTIONS.prepareForNonAR(obj, true);
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'bond_SSBOND'),
                        1
                    );
                }
                Scene.remove(Scene.getObjectByName('SBOND'));
            }
        }
    }

    CheckboxIONIC.oninput = (event) => {
        addIONIC(event);
        event.target.checked == true ? (mobileCheckboxIONIC.checked = 'true') : (mobileCheckboxIONIC.checked = 'false');
    };

    mobileCheckboxIONIC.oninput = (event) => {
        addIONIC(event);
        event.target.checked == true ? (CheckboxIONIC.checked = 'true') : (CheckboxIONIC.checked = 'false');
    };

    function addIONIC(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                Scene.add(IONICScene);
                if (sessionMode == 'immersive-ar') {
                    FUNCTIONS.prepareForAR(Scene.getObjectByName('bond_IONIC'));
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.push(Scene.getObjectByName('bond_IONIC'));
                }
            } else {
                if (sessionMode == 'immersive-ar') {
                    let obj = pivot.getObjectByUserDataProperty('type', 'bond_IONICAR');
                    FUNCTIONS.prepareForNonAR(obj, true);
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'bond_IONIC'),
                        1
                    );
                }
                Scene.remove(Scene.getObjectByName('IONIC'));
            }
        }
    }

    CheckboxPIPISTACK.oninput = (event) => {
        addPIPISTACK(event);
        event.target.checked == true ? (mobileCheckboxPIPISTACK.checked = 'true') : (mobileCheckboxPIPISTACK.checked = 'false');
    };

    mobileCheckboxPIPISTACK.oninput = (event) => {
        addPIPISTACK(event);
        event.target.checked == true ? (CheckboxPIPISTACK.checked = 'true') : (CheckboxPIPISTACK.checked = 'false');
    };

    function addPIPISTACK(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                Scene.add(PIPISTACKScene);
                if (sessionMode == 'immersive-ar') {
                    FUNCTIONS.prepareForAR(Scene.getObjectByName('bond_PIPISTACK'));
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.push(Scene.getObjectByName('bond_PIPISTACK'));
                }
            } else {
                if (sessionMode == 'immersive-ar') {
                    let obj = pivot.getObjectByUserDataProperty('type', 'bond_PIPISTACKAR');
                    FUNCTIONS.prepareForNonAR(obj, true);
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'bond_PIPISTACK'),
                        1
                    );
                }
                Scene.remove(Scene.getObjectByName('PIPISTACK'));
            }
        }
    }

    CheckboxPICATION.oninput = (event) => {
        addPICATION(event);
        event.target.checked == true ? (mobileCheckboxPICATION.checked = 'true') : (mobileCheckboxPICATION.checked = 'false');
    };

    mobileCheckboxPICATION.oninput = (event) => {
        addPICATION(event);
        event.target.checked == true ? (CheckboxPICATION.checked = 'true') : (CheckboxPICATION.checked = 'false');
    };

    function addPICATION(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                Scene.add(PICATIONScene);
                if (sessionMode == 'immersive-ar') {
                    FUNCTIONS.prepareForAR(Scene.getObjectByName('bond_PICATION'));
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.push(Scene.getObjectByName('bond_PICATION'));
                }
            } else {
                if (sessionMode == 'immersive-ar') {
                    let obj = pivot.getObjectByUserDataProperty('type', 'bond_PICATIONAR');
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'bond_PICATION'),
                        1
                    );
                }
                Scene.remove(Scene.getObjectByName('PICATION'));
            }
        }
    }

    CheckboxGENERIC.oninput = (event) => {
        addGENERIC(event);
        event.target.checked == true ? (mobileCheckboxGENERIC.checked = 'true') : (mobileCheckboxGENERIC.checked = 'false');
    };

    mobileCheckboxGENERIC.oninput = (event) => {
        addGENERIC(event);
        event.target.checked == true ? (CheckboxGENERIC.checked = 'true') : (CheckboxGENERIC.checked = 'false');
    };

    function addGENERIC(event) {
        if (pdbloaded) {
            if (event.target.checked == true) {
                Scene.add(GENERICScene);
                if (sessionMode == 'immersive-ar') {
                    FUNCTIONS.prepareForAR(Scene.getObjectByName('bond_GENERIC'));
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.push(Scene.getObjectByName('bond_GENERIC'));
                }
            } else {
                if (sessionMode == 'immersive-ar') {
                    let obj = pivot.getObjectByUserDataProperty('type', 'bond_GENERICAR');
                    FUNCTIONS.prepareForNonAR(obj, true);
                } else if (sessionMode == 'immersive-vr') {
                    //TODO
                } else {
                    //inline
                    selectables.splice(
                        selectables.findIndex((x) => x.name === 'bond_GENERIC'),
                        1
                    );
                }
                Scene.remove(Scene.getObjectByName('GENERIC'));
            }
        }
    }

    CheckNonCovAtoms.oninput = (event) => {
        addNonCovAtoms(event);
        event.target.checked == true ? (mobileCheckNonCovAtoms.checked = 'true') : (mobileCheckNonCovAtoms.checked = 'false');
    };

    mobileCheckNonCovAtoms.oninput = (event) => {
        addNonCovAtoms(event);
        event.target.checked == true ? (CheckNonCovAtoms.checked = 'true') : (CheckNonCovAtoms.checked = 'false');
    };

    function addNonCovAtoms(event) {
        if (pdbloaded && bondloaded) {
            let scenes = [AtomScene, SmallAtomScene, AtomBondsScene, LigandsScene, SmallLigandsScene, LigandBondsScene, WireframeScene];

            if (event.target.checked == true) {
                if (sessionMode == 'immersive-vr') {
                    //TODO
                } else if (sessionMode == 'immersive-ar') {
                    scenes.forEach((scene) => {
                        if (scene.children.length > 0) {
                            scene.children[0].children.forEach((child) => {
                                if (child.name == 'COVAR') {
                                    child.visible = true;
                                    if (child.parent.parent.parent == Scene) {
                                        //la mesh si trova in una scena presente nella Scena principale
                                        //quindi la aggiungo al pivot

                                        if (!child.userData.aldreadyPutInAR) {
                                            FUNCTIONS.putInPivotAndCenter(pivot, child);
                                            child.userData.aldreadyPutInAR = true;
                                        } else {
                                            pivot.add(child);
                                            pivot.matrixWorldNeedsUpdate = true;
                                        }

                                        //togli dal pivot il corrispondente AR con una regex
                                        let name;
                                        var regex = /(.*)_COVAR/;
                                        var res = child.userData.type.match(regex);
                                        if (res) {
                                            name = res[1] + 'AR';
                                            let obj = pivot.getObjectByUserDataProperty('type', name);
                                            obj.visible = false;
                                            let parent = obj.userData.originalParent;
                                            parent.add(obj);
                                        }
                                    }
                                } else {
                                    child.visible = false;
                                }
                            });
                        }
                    });
                } else {
                    //inline

                    scenes.forEach((scene) => {
                        if (scene.children.length > 0) {
                            scene.children[0].children.forEach((child) => {
                                if (child.name == 'COV') {
                                    //show mesh
                                    child.layers.set(0);
                                    child.visible = true;
                                } else {
                                    child.layers.set(1);
                                    child.visible = false;
                                }
                            });
                        }
                    });
                }
            } else {
                if (sessionMode == 'immersive-vr') {
                    //TODO
                } else if (sessionMode == 'immersive-ar') {
                    scenes.forEach((scene) => {
                        if (scene.children.length > 0) {
                            scene.children[0].children.forEach((child) => {
                                if (child.name == 'COVAR') {
                                    child.visible = false;
                                    /*if ( child.parent.parent.parent == Scene ){// se si trova nel pivot lo tolgo                         
                                        let parent = child.userData.originalParent;
                                        parent.add( child ); 
                                    }*/
                                } else if (child.name == 'AR') {
                                    child.visible = true;
                                    //l'oggetto è nella scena principale
                                    if (child.parent.parent.parent == Scene) {
                                        if (!child.userData.aldreadyPutInAR) {
                                            FUNCTIONS.putInPivotAndCenter(pivot, child);
                                            child.userData.aldreadyPutInAR = true;
                                        } else {
                                            pivot.add(child);
                                            pivot.matrixWorldNeedsUpdate = true;
                                        }

                                        //togli dal pivot il corrispondente COVAR con una regex
                                        let name;
                                        var regex = /(.*)AR/;
                                        var res = child.userData.type.match(regex);
                                        if (res) {
                                            name = res[1] + '_COVAR';
                                            let obj = pivot.getObjectByUserDataProperty('type', name);
                                            obj.visible = false;
                                            let parent = obj.userData.originalParent;
                                            parent.add(obj);
                                        }
                                    }
                                }
                            });
                        }
                    });
                } else {
                    //inline
                    scenes.forEach((scene) => {
                        if (scene.children.length > 0) {
                            scene.children[0].children.forEach((child) => {
                                if (child.name == 'COV' || child.name == 'AR' || child.name == 'COVAR') {
                                    child.layers.set(1);
                                    child.visible = false;
                                } else {
                                    child.layers.set(0);
                                    child.visible = true;
                                }
                            });
                        }
                    });
                }
            }
        }
    }

    function changeColor(color) {
        if (pdbloaded) colorBy(color);
    }

    $('#2drinbutton').click(function (event) {
        //open new window with RIN
        sessionStorage.setItem('nodes', JSON.stringify(nodesRIN));
        sessionStorage.setItem('links', JSON.stringify(linksRIN));

        sessionStorage.setItem('map', JSON.stringify(map));
        sessionStorage.setItem('res_count', res_count);
        sessionStorage.setItem('bond_count', JSON.stringify(bond_count));
        sessionStorage.setItem('avg_e_bond', JSON.stringify(avg_e_bond));
        sessionStorage.setItem('avg_dist_bond', JSON.stringify(avg_dist_bond));

        window.open('index2D.html');
    });

    $('#3drinbutton').click(function (event) {
        //open new window with RIN
        sessionStorage.setItem('nodes', JSON.stringify(nodesRIN));
        sessionStorage.setItem('links', JSON.stringify(linksRIN));

        sessionStorage.setItem('map', JSON.stringify(map)); //obj
        sessionStorage.setItem('res_count', res_count); //integer
        sessionStorage.setItem('bond_count', JSON.stringify(bond_count)); //array
        sessionStorage.setItem('avg_e_bond', JSON.stringify(avg_e_bond)); //array
        sessionStorage.setItem('avg_dist_bond', JSON.stringify(avg_dist_bond)); //array

        window.open('index3D.html');
    });

    /////////////////////////////////////////////////////////
    //CALLBACK MOUSE and TOUCH
    ////////////////////////////////////////////////////////
    renderer.domElement.addEventListener('mousemove', removeRaycasting);

    renderer.domElement.addEventListener('mousedown', (event) => {
        event.preventDefault();
        mouse.x = (event.offsetX / renderer.domElement.width) * 2 - 1;
        mouse.y = -(event.offsetY / renderer.domElement.height) * 2 + 1;
        mouseUserData.clientX = event.clientX;
        mouseUserData.clientY = event.clientY;
    });

    renderer.domElement.addEventListener('mouseup', (event) => {
        if (mouse.x == (event.offsetX / renderer.domElement.width) * 2 - 1 && mouse.y == -(event.offsetY / renderer.domElement.height) * 2 + 1) {
            mouse2.x = mouse.x;
            mouse2.y = mouse.y;
        } else mouse2.x = 9999;
    });
    renderer.domElement.addEventListener('touchstart', touchStart, false);
    renderer.domElement.addEventListener(
        'touchmove',
        () => {
            //toast.className = "hide";
            removeRaycasting();
        },
        false
    );

    function onKeyDown(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;
        }
    }

    function onKeyUp(event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    }

    document.body.addEventListener('keydown', onKeyDown, false);
    document.body.addEventListener('keyup', onKeyUp, false);

    function touchStart(event) {
        event.preventDefault();
        if (pdbloaded && sessionMode == 'inline') {
            if (lastMesh1) {
                removeRaycasting();
            } else {
                mouseUserData.clientX = event.touches[0].clientX;
                mouseUserData.clientY = event.touches[0].clientY;

                mouse.x = (event.touches[0].clientX / renderer.domElement.width) * 2 - 1;
                mouse.y = -(event.touches[0].clientY / renderer.domElement.height) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(Scene.children, true);
                raycastProtein(intersects);
            }
        }
    }

    function removeRaycasting() {
        if (lastMesh1) {
            //helix, loop , sheet and nucleic acid backbone
            FUNCTIONS.colorFaces(lastMesh1, lastFaces1, lastColor1);
            lastMesh1.geometry.attributes.color.needsUpdate = true;
            lastColor1 = null;
            lastMesh1 = null;
            if (lastMesh2) {
                //atoms and stick ot stick of nucleic acid
                if (lastColor2bis) {
                    let leftSide = lastFaces2.slice(0, Math.floor(lastFaces2.length / 2));
                    let rightSide = lastFaces2.slice(Math.floor(lastFaces2.length / 2), lastFaces2.length - 1);

                    FUNCTIONS.colorFaces(lastMesh2, leftSide, lastColor2);
                    FUNCTIONS.colorFaces(lastMesh2, rightSide, lastColor2bis);
                } else {
                    FUNCTIONS.colorFaces(lastMesh2, lastFaces2, lastColor2);
                }
                lastMesh2.geometry.attributes.color.needsUpdate = true;
                lastColor2 = null;
                lastColor2bis = null;
                lastMesh2 = null;

                if (lastMesh3) {
                    //nucleicAcid
                    FUNCTIONS.colorFaces(lastMesh3, lastFaces3, lastColor3);
                    lastMesh3.geometry.attributes.color.needsUpdate = true;
                    lastColor3 = null;
                    lastMesh3 = null;
                }
            }

            toast.className = 'hide';
        }
    }

    /////////////////////////////////////////////////////////
    //LETTURA FILE PDB
    /////////////////////////////////////////////////////////

    document.forms['pdbupload'].elements['file'].onchange = function (evt) {
        $.LoadingOverlay('show', {
            image: '',
            fontawesome: 'fas fa-dna fa-pulse',
        });

        if (!window.FileReader) return; // Browser is not compatible

        setTimeout(function () {
            if (evt.target.files[0]) {
                const name = evt.target.files[0].name;
                //sanitize name
                if (name.match(/^[\w\-\_\s]+.pdb$/) || name.match(/^[0-9]*$/)) {
                    //TODO android changes file names
                    pdbname = name; //used to pass the pdb name to node.js
                } else {
                    alert('Incorrect pdb name! site will be reloaded');
                    window.location.reload();
                    return;
                }

                const lastDot = name.lastIndexOf('.');
                const ext = name.substring(lastDot + 1);
                const proteinName = name.substring(0, lastDot);

                if (ext != 'pdb' && !/Mobi|Android/i.test(navigator.userAgent)) {
                    //file non ha estensione pdb o siamo in un mobile device
                    $('#errmsg').append('This file is not a PDB file. Please check the format and try again.');
                    $('#pdbfail').show();
                    $.LoadingOverlay('hide');
                    return;
                }

                $('.labelfile').html(name);

                var reader = new FileReader();

                for (var i = 0; i < selectables.length; i++) selectables.splice(i, 1);
                (ligandsPresent = false), (solventPresent = false);

                reader.onload = function (evt) {
                    if (evt.target.readyState != 2) return;
                    if (evt.target.error) {
                        alert('Error while reading file');
                        $.LoadingOverlay('hide');
                        return;
                    }

                    var pdb = evt.target.result;
                    pdbcontent = pdb; //used to pass the pdb content to node.js

                    cleanPDBparseArrays();

                    var response = parsePDB(pdb, proteinName);

                    //crea un KD-tree con i punti degli atomi e un array di atomi indicizzato per posizione:
                    //EDIT: non si è rivelato più efficiente di una ricerca lineare
                    //KDTree = new kdTree(Atoms, FUNCTIONS.KDTreeDistance , ["x", "y","z"]);

                    if (response) {
                        $('#pdbsuccesp').html('click on the protein to see information about atoms.');
                        //reset slider
                        FUNCTIONS.moveSlider($('#atomslider'), 1, undefined, $('#rangevalue1'));

                        //TODO ogni nuova struttura si renderizza coi colori degli atomi, in futuro va cambiato
                        if (lastCheckColor.classList.contains('activeSpan')) {
                            mobilelastCheckColor.classList.remove('activeSpan');
                            lastCheckColor.classList.remove('activeSpan');
                            CheckBoxElemColor.classList.add('activeSpan');
                            mobileCheckBoxElemColor.classList.add('activeSpan');
                        } else {
                            lastCheckColor.classList.add('disabled');
                            mobilelastCheckColor.classList.add('disabled');
                        }
                        lastCheckColor = CheckBoxElemColor;
                        mobilelastCheckColor = mobileCheckBoxElemColor;
                        $('#bondspan').addClass('disabled');
                        $('#mobilenoncovbondsspan').addClass('disabled');
                        $('#pdbsuccess').show();
                        //hide loader
                        $.LoadingOverlay('hide');

                        pdbloaded = true;
                    } else {
                        $('#errmsg').html('Unexpected error while parsing PDB. The protein will not be displaed.');
                        $('#pdbfail').show();
                        $.LoadingOverlay('hide');
                    }
                };
                reader.readAsText(evt.target.files[0]);
            } else {
                $.LoadingOverlay('hide');
            }
        }, 300);
    };

    function sanitize(word) {
        return word.match(/^[\w]{1,4}$/);
    }

    $('#searchpdbbutton').on('click', function () {
        let name = $('#pdbname').val();
        if (sanitize(name)) sendRequest(name);
        else {
            window.location.reload();
            return;
        }
    });

    $('#mobilesearchpdbbutton').on('click', function () {
        let name = $('#mobilepdbname').val();
        if (sanitize(name)) sendRequest(name);
        else {
            window.location.reload();
            return;
        }
    });

    function sendRequest(pdb) {
        var n1 = new Date().getTime();
        $.ajax({
            type: 'GET',
            url: 'https://files.rcsb.org/view/' + pdb + '.pdb',
            success: function (res) {
                $('#pdbsuccesp').html('click on the protein to see information about atoms.');
                cleanPDBparseArrays();
                $('.labelfile').html('Upload');
                let response = parsePDB(res, pdb);

                //KDTree = new kdTree(Atoms, FUNCTIONS.KDTreeDistance , ["x", "y","z"]);
                if (response) {
                    pdbname = pdb + '.pdb';
                    pdbcontent = res;
                    //reset slider
                    FUNCTIONS.moveSlider($('#atomslider'), 1, undefined, $('#rangevalue1'));
                    if (lastCheckColor.classList.contains('activeSpan')) {
                        mobilelastCheckColor.classList.remove('activeSpan');
                        lastCheckColor.classList.remove('activeSpan');
                        CheckBoxElemColor.classList.add('activeSpan');
                        mobileCheckBoxElemColor.classList.add('activeSpan');
                    } else {
                        lastCheckColor.classList.add('disabled');
                        mobilelastCheckColor.classList.add('disabled');
                    }
                    lastCheckColor = CheckBoxElemColor;
                    mobilelastCheckColor = mobileCheckBoxElemColor;
                    $('#bondspan').addClass('disabled');
                    $('#mobilenoncovbondsspan').addClass('disabled');
                    //$("#loading").hide();
                    $('#pdbsuccess').show();
                    pdbloaded = true;

                    var n2 = new Date().getTime();
                    console.log('time taken ' + (n2 - n1) + 'ms');
                } else {
                    $('#errmsg').html('Unexpected error while parsing PDB. The protein will not be displaed.');
                    $('#pdbfail').show();
                }
            },
            error: function (res) {
                $('#errmsg').html('The PDB file you are looking for may not exist, or your device may not be connected to Internet.');
                $('#pdbfail').show();
            },
        });
    }

    $(document).ajaxStart(function () {
        $.LoadingOverlay('show', {
            image: '',
            fontawesome: 'fas fa-dna fa-pulse', //spin or pulse
        });
    });

    $(document).ajaxComplete(function () {
        $.LoadingOverlay('hide');
    });

    $('.xmlbutton').on('click', function () {
        if (!bondloaded && pdbloaded) {
            $('#covid').modal('show');
        }
    });
    $('#covbutton').on('click', function () {
        if (!bondloaded && pdbloaded) {
            //speed test
            var n1 = new Date().getTime();

            //RING parameters
            var bond_control = $('#bond-control-strict').is(':checked') ? 'strict' : 'weak';

            var int_type;

            if ($('#interaction-type-all').is(':checked')) int_type = 'all';
            if ($('#interaction-type-multiple').is(':checked')) int_type = 'multiple';
            if ($('#interaction-type-one').is(':checked')) int_type = 'one';

            var net_policy;

            if ($('#net-policy-closest').is(':checked')) net_policy = 'closest';
            if ($('#net-policy-ca').is(':checked')) net_policy = 'ca';
            if ($('#net-policy-cb').is(':checked')) net_policy = 'cb';

            var force = $('#force').is(':checked');

            var pipistack = $('#pipistack-bond').val();
            var pication = $('#pication-bond').val();
            var generic = $('#generic-bond').val();
            var vdw = $('#vdw-bond').val();
            var hbond = $('#h-bond').val();
            var ionic = $('#ionic-bond').val();
            var seq_sep = $('#seq-sep').val();

            if (!((pipistack && pipistack < 6.5) || (pipistack && force))) pipistack = 6.5;

            if (!((pication && pication < 5) || (pipistack && force))) pication = 5;

            if (!((generic && generic < 6) || (generic && force))) generic = 6;

            if (!((hbond && hbond < 3.5) || (hbond && force))) hbond = 3.5;

            if (!((vdw && vdw < 0.5) || (vdw && force))) vdw = 0.5;

            if (!((ionic && ionic < 4) || (ionic && force))) ionic = 4;

            if (!((seq_sep && seq_sep < 3) || (seq_sep && force))) seq_sep = 3;

            $.ajax({
                type: 'POST',
                //url: "https://coccode.dsi.unive.it:8002/requestxml",
                url: 'https://192.168.1.157:8002/requestxml', //for local tests
                //url: "http://ring.dais.unive.it:8002/api/ispresent/pdbname",
                data: {
                    name: pdbname,
                    content: pdbcontent,
                    force: force,
                    bondcontrol: bond_control,
                    netpolicy: net_policy,
                    interactiontype: int_type,
                    pipistack: pipistack,
                    pication: pication,
                    generic: generic,
                    hbond: hbond,
                    vdw: vdw,
                    ionic: ionic,
                    seqsep: seq_sep,
                },
                success: function (res) {
                    xml = res.doc;
                    let result = res.ring;

                    if (xml == null) {
                        //server received a wrong pdb name
                        $('#failmsg').html('Server received a wrong PDB code.');
                        $('#bondfail').show();
                    } else {
                        console.log(result);

                        let response = parseXmlBonds(xml);
                        if (!$.isEmptyObject(response)) {
                            bondloaded = true;
                            createNonCovProtein([AtomScene, SmallAtomScene, AtomBondsScene, LigandsScene, SmallLigandsScene, LigandBondsScene, WireframeScene]); //create protein without atoms not involved in non-covalent bonds
                            nonCovAtomsLoaded = true;

                            CheckNonCovAtoms.disabled = false;
                            CheckNonCovTypeColor.classList.remove('disabled');
                            CheckNonCovTypeColor.classList.add('activeSpan');
                            CheckNonCovDistanceColor.classList.remove('disabled');
                            //$('.openrinbutton').removeClass('disabled');
                            CheckNonCovTypeColor.classList.add('activeSpan');
                            mobileCheckNonCovAtoms.disabled = false;
                            mobileCheckNonCovTypeColor.classList.remove('disabled');
                            mobileCheckNonCovDistanceColor.classList.remove('disabled');
                            mobileCheckNonCovTypeColor.classList.add('activeSpan');

                            $('#covid').modal('hide');
                            $('#bondsuccess').show();
                            result = result.replace(/(?:\r\n|\r|\n)/g, '<br>');
                            $('#noncovcontent').html(result);
                            $('#noncovcontent').html(
                                ' Found:<br> ' +
                                    'H-BONDS : ' +
                                    response.HBOND +
                                    '<br>' +
                                    'S-BONDS : ' +
                                    response.SBOND +
                                    '<br>' +
                                    'VDW : ' +
                                    response.VDW +
                                    '<br>' +
                                    'IONIC : ' +
                                    response.IONIC +
                                    '<br>' +
                                    'PI-PI-STACK : ' +
                                    response.PIPISTACK +
                                    '<br>' +
                                    'PI-CATION : ' +
                                    response.PICATION +
                                    '<br>' +
                                    'GENERIC : ' +
                                    response.GENERIC
                            );
                            var n2 = new Date().getTime();
                            console.log('time taken ' + (n2 - n1) + 'ms');
                            //$('#rinbutton').removeAttr('disabled');
                        } else {
                            $('#failmsg').html('Unexpected error while reading RIN: it seems that intermolecular bonds can not be calculated for this molecule.');
                            $('#bondfail').show();
                        }
                    }
                },
                error: function (res) {
                    $('#failmsg').html('Network error! Please check your connection and try again.');
                    $('#bondfail').show();
                },
            });
        }
    });

    $(document).on('click', '.close', function () {
        if ($(this).parent()[0].className != 'modal-header') $(this).parent().hide();
        else $('#covid').modal('hide');
    });

    $(function () {
        window.setTimeout(function () {
            pdbname = '1cbs.pdb';

            $.ajax({
                type: 'GET',
                url: 'https://files.rcsb.org/view/' + pdbname,
                success: function (pdb) {
                    $('#pdbsuccesp').html('click on the protein to see information about atoms.');
                    cleanPDBparseArrays();
                    $('.labelfile').html('Upload');

                    pdbcontent = pdb;
                    parsePDB(pdb, pdbname);

                    $('#pdbsuccess').show();

                    $('#pdbname').val('1cbs');
                    $('#mobilepdbname').val('1cbs');
                    //KDTree = new kdTree(Atoms, FUNCTIONS.KDTreeDistance , ["x", "y","z"]);

                    pdbloaded = true;
                },
                error: function (res) {
                    $('#errmsg').html('Please check your connection and try again.');
                    $('#pdbfail').show();
                },
            });
        }, 0);
    });

    //RENDERER
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //turn on VR and AR support
    renderer.xr.enabled = true;

    //LIGHTS
    var light1 = new THREE.PointLight(0xffffff, 1.2, 1000, 0);
    light1.position.set(0, 0, 0);

    camera.add(light1);
    camera.layers.enable(0);
    var light = new THREE.AmbientLight(0x404040, 0.5); // soft white light
    /* const loader = new THREE.TextureLoader();
     loader.load('./../media/img/violetb.jpg' , function(texture)
             {
              Scene.background = texture;  
             });*/

    Scene.add(light);
    Scene.add(camera);

    //CONTROLS
    controls = new OrbitControls(camera, renderer.domElement);

    renderer.setAnimationLoop(animate);

    //ENTER/EXIT VR
    VRButton.createButton(renderer);

    //ENTER/EXIT AR
    ARButton.createButton(renderer);

    //AR RETICLE
    reticle = new THREE.Mesh(new THREE.RingBufferGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial());
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    Scene.add(reticle);

    //AR PIVOT for ROTATION
    pivot = new THREE.Object3D();
    pivot.name = 'pivotAR';
    Scene.add(pivot);

    //AR and VR CONTROLLERS

    XRControllers.createControllers(Scene, renderer, controller1, controller2);

    //SIDEBAR
    $('#sidebar').mCustomScrollbar({
        theme: 'minimal',
    });

    //collpase sidebar and leave icons
    $('#sidebarCollapse').on('click', function () {
        if ($('#sidebar').hasClass('active')) {
            //hide sidebar
            $('#sidebar').removeClass('active');
            $('#sidebar').addClass('closed');

            $('#sidebar-header').html('');

            $('.menuitem').hide();

            //move collpase menu if open
            tempCollapse = $('.collapse.show');
            tempParentCollapse = $('.collapse.show').parent();

            if (tempCollapse != null && tempCollapse.length > 0 && tempParentCollapse != null && tempParentCollapse.length > 0) {
                openCollapse(true);
            }
        } else {
            $('#sidebar').addClass('active');
            $('#sidebar').removeClass('closed');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');

            $('#sidebar-header').html(pdbinfo);
            $('.menuitem').show();

            if (tempCollapse != null && tempCollapse.length > 0) {
                closeCollapse();
            }
        }
    });

    //COLLAPSED MENU
    let tempCollapse = [],
        tempParentCollapse = [],
        flag = false;

    $('.collapse-parent').on('show.bs.collapse', function (e) {
        if ($('#sidebar').hasClass('closed') && $(this).is(e.target)) {
            flag = false;
            if (tempCollapse != null && tempCollapse.length > 0) {
                tempCollapse.collapse('toggle');
                flag = true;
                closeCollapse();
            }

            tempCollapse = $(this);
            tempParentCollapse = $(this).parent();
            openCollapse(false);
        } else if (tempCollapse != null && tempCollapse.length > 0 && $(this).is(e.target)) {
            closeCollapse();
        }
    });

    $('.collapse-parent').on('hidden.bs.collapse', function (e) {
        if ($('#sidebar').hasClass('closed') && tempParentCollapse != null && !flag && $(this).is(e.target)) {
            closeCollapse();
        }
        flag = false;
    });

    function closeCollapse() {
        tempParentCollapse.append(
            tempCollapse
                .css({
                    position: 'relative',
                    left: 0,
                    top: 0,
                })
                .detach()
        );
        tempCollapse = null;
        tempParentCollapse = null;
    }

    function openCollapse(isSidebarOpen) {
        if (isSidebarOpen) {
            $('.collapse').collapse('hide');
            tempCollapse = null;
            tempParentCollapse = null;
        } else {
            let offsetTop = tempParentCollapse.offset().top;
            let offsetLeft = tempParentCollapse.offset().left + tempParentCollapse.width();

            $('body').append(tempCollapse);
            tempCollapse.css('position', 'absolute');
            tempCollapse.css('left', offsetLeft);
            tempCollapse.css('top', offsetTop);
            tempCollapse.css('background-color', 'rgba(57,62,70,0.3)');
            $('#opacitylink').css('background-color', 'rgba(57,62,70,0.2)');
            $('#opacitylink').on({
                mouseenter: function () {
                    $('#opacitylink').css('color', 'rgb(57,62,70)');
                    $('#opacitylink').css('background-color', 'rgb(163,247,191)');
                },
                mouseleave: function () {
                    $('#opacitylink').css('color', 'white');
                    $('#opacitylink').css('background-color', 'rgba(57,62,70,0.2)');
                },
            });
        }
    }

    /*tooltip for collapsed menu version*/
    $('.amenu').on({
        mouseenter: function (e) {
            //show tool tip
            if ($('#sidebar').hasClass('closed')) {
                $('.tooltip').show();
                $('.tooltip').css('opacity', '1');
                $('.tooltip').css('top', $(this).offset().top);
                $('.tooltip').css('left', $(this).offset().left + 75); //50 is the size of collapsed sidebar
                $('.tooltiptext').html($(this).children('div').children('p').html());
            }
        },
        mouseleave: function (e) {
            //hide tool tip
            if ($('#sidebar').hasClass('closed')) {
                $('.tooltip').hide();
                $('.tooltip').css('opacity', '0');
                $('.tooltiptext').html('');
            }
        },
    });

    //DOWNLOAD BUTTON

    $('.downloadbutton').on('click', function () {
        FUNCTIONS.saveAsImage(pdbname);
    });

    $('#hidebutton').on('click', function () {
        if ($(this).hasClass('visible')) {
            $(this).removeClass('visible');
            $(this).addClass('hidden');
            //hide buttons and change icon
            $('#mobilebuttons').removeClass('visiblebutton');
            $('#mobilebuttons').addClass('hiddenbutton');

            $('#arvrbuttons').removeClass('visiblebutton');
            $('#arvrbuttons').addClass('hiddenbutton');

            $('#hideicon').removeClass('fa-chevron-down');
            $('#hideicon').addClass('fa-chevron-up');
        } else {
            //show buttons and change icon
            $(this).addClass('visible');
            $(this).removeClass('hidden');

            $('#mobilebuttons').removeClass('hiddenbutton');
            $('#arvrbuttons').removeClass('hiddenbutton');
            $('#mobilebuttons').addClass('visiblebutton');
            $('#arvrbuttons').addClass('visiblebutton');

            $('#hideicon').removeClass('fa-chevron-up');
            $('#hideicon').addClass('fa-chevron-down');
        }
    });

    //HAMBURGER BUTTON
    $('.second-button').on('click', function () {
        $('.animated-icon2').toggleClass('open');
    });

    //MANAGE WINDOW RESIZE
    window.addEventListener('resize', onWindowResize, false);

    //OPACITY OF ATOMS OBJ
    $('.atomslider').on('change mousemove', function () {
        if (sessionMode == 'immersive-vr') FUNCTIONS.moveSlider($(this), undefined, Scene.getObjectByName('atomsVR'), $('.rangevalue1'));
        else if (sessionMode == 'inline') FUNCTIONS.moveSlider($(this), undefined, Scene.getObjectByName('atoms'), $('.rangevalue1'));
        else {
            //AR
            FUNCTIONS.moveSlider($(this), undefined, Scene.getObjectByName('atoms'), $('.rangevalue1'));
        }
    });

    //prevent closing of dropdown menu
    $('.dropdown-menu').click(function (e) {
        e.stopPropagation();
    });

    $('.openpdbbutton').click(function (e) {
        //open new page with pdb content
        e.preventDefault();
        e.stopPropagation();
        window.open('https://files.rcsb.org/view/' + pdbname, '_blank');
    });

    /*$('.openrinbutton').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        //open rin
        let blob = new Blob([xml], { type: 'text/xml' });
        let url = URL.createObjectURL(blob);
        window.open(url);
        URL.revokeObjectURL(url);
    });*/

    //info modal
    $('#infospan').click(function (e) {
        e.preventDefault();
        $('#infomodal').modal('show');
    });

    $('#infomobilespan').click(function (e) {
        e.preventDefault();
        $('#infomodal').modal('show');
    });

    //mobile dropdowns
    Popper.Defaults.modifiers.hide = { enabled: false };
    Popper.Defaults.modifiers.preventOverflow = { enabled: false };

    let tempDropdown, tempButton;

    $('.dropup').on('show.bs.dropdown', function () {
        tempDropdown = $(this).children('div');
        tempButton = $(this);
        tempDropdown.removeAttr('style');
        $('body').append(tempDropdown);
        $('.mobile-dropdown.show').css('left', $(this).offset().left + 'px !important');
        $('.mobile-dropdown.show').css('top', $(this).offset().top - $(this).height() + 'px !important');
        $('.mobile-dropdown.show').css('position', 'absolute');
        /*$('body').append($(this).children('div').css({
            position: 'absolute !important',
            left: $(this).offset().left +'px !important',
            top:  $(this).offset().top - $(this).height()+'px !important',
        }).detach());*/
    });

    $('.dropup').on('hidden.bs.dropdown', function () {
        tempButton.append(
            tempDropdown
                .css({
                    position: false,
                    left: false,
                    top: false,
                })
                .detach()
        );
    });

    $('#infovizmodeVR')
        .on('mouseenter', function (e) {
            $('#snackbarI').html('Start an Immersive Virtual Reality session. Please <br>connect your VR viewer or explore the simulated session <br>(WebXR emulator extension is required).');
            $('#snackbarI').css({ top: e.pageY, left: e.pageX + 30 });
            $('#snackbarI').show();
            $('#infovizmodeVR').css('cursor', 'pointer');
            $('#infovizmodeVR').css('color', 'rgb(41,161,156)');
        })
        .on('mouseleave', function () {
            $('#snackbarI').hide();
            $('#infovizmodeVR').css('color', 'white');
        });

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    renderer.xr.addEventListener('sessionstart', function (event) {
        XRsession = renderer.xr.getSession();

        if (sessionMode == 'immersive-vr') {
            /*
            //VR mode
            console.log('in VR immersive mode.');

            //remove normal scene and add VR scenes

            if (Scene.getObjectByName('atomi1')) FUNCTIONS.changeScene('atomi1', ScenaAtomi1VR, 'atoms', 'atomsVR');

            if (Scene.getObjectByName('atomi2')) FUNCTIONS.changeScene('atomi2', ScenaAtomi2VR, 'smallatoms', 'smallatomsVR');

            if (Scene.getObjectByName('ligands1')) FUNCTIONS.changeScene('ligands1', ScenaLigands1VR, 'atomsL', 'atomsLVR');

            if (Scene.getObjectByName('ligands2')) FUNCTIONS.changeScene('ligands2', ScenaLigands2VR, 'smallatomsL', 'smallatomsLVR');

            if (Scene.getObjectByName('solventi')) FUNCTIONS.changeScene('solvents', ScenaSolventsVR, 'solvents', 'solventsVR');
            let valscale = 1 / (Atoms.length / distance);

            if (valscale > 0.1) valscale = 0.1;

            selectables.forEach((child) => {
                child.userData.position = child.position.clone();
                child.userData.lookat = child.rotation.clone();
                child.scale.set(valscale, valscale, valscale);
                child.position.set(0, 1.6, -2);
                child.lookAt(5, 0, 0); //ruota in orizzontale l'oggetto
            });

            //create a simple room
            const room = new THREE.LineSegments(new BoxLineGeometry(300, 300, 300, 10, 10, 10).translate(0, 10, 0), new THREE.LineBasicMaterial({ color: 0x808080 }));
            room.name = 'room';
            room.userData.type = 'room';
            Scene.add(room);

            //set opacity of nonVR object
            FUNCTIONS.moveSlider($('#atomslider'), $('#atomslider').val(), Scene.getObjectByName('atomsVR'), $('#rangevalue1'));
            */
        } else {
            //AR mode
            console.log('in AR immersive mode.');

            selectables.forEach((child) => {
                child.visible = false;
                //child.layers.set(1); //layers does not work in XR sessions
            });

            $('#armodal').show();
            setTimeout(function () {
                $('#armodal').hide();
            }, 3000); //hide modal after 3 seconds

            $('#mobilebuttons').css('bottom', '1em');

            //zoom and rotation listeners

            renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
            renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);
            renderer.domElement.addEventListener('touchend', onDocumentTouchEnd, false);

            controls.enabled = false;
        }
    });

    function onDocumentTouchStart(event) {
        event.preventDefault();

        if (event.touches.length == 2) {
            //zoom
            if (ARcontrols) ARcontrols.enabled = false;

            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;
            toucheEnd = touchStart = Math.sqrt(dx * dx + dy * dy);
        } else if (event.touches.length == 1) {
            //rotation
            event.preventDefault();

            /*mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
            targetRotationOnMouseDownX = targetRotationX;

            mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
            targetRotationOnMouseDownY = targetRotationY;*/
        }
    }

    function onDocumentTouchMove(event) {
        if (event.touches.length == 2) {
            //zoom
            //ARcontrols.enabled = false;
            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;
            toucheEnd = Math.sqrt(dx * dx + dy * dy);

            var factor = toucheEnd / touchStart;
            touchStart = toucheEnd;
            resizePivot(factor);
        } else if (event.touches.length == 1) {
            //rotation
            //Note from the developer, to speed up the rotation change 0.01 with a higher number
            /*event.preventDefault();
            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            targetRotationX = targetRotationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.01;//originally 0.05

            mouseY = event.touches[ 0 ].pageY - windowHalfY;
            targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.01; //originally 0.05   
            */
            //rotatePivot();
        }
    }

    function onDocumentTouchEnd(event) {
        touchStart = toucheEnd = 0;
        if (ARcontrols) ARcontrols.enabled = true;
    }

    function resizePivot(factor) {
        let scale = pivot.scale.x * factor;
        pivot.scale.set(scale, scale, scale);
    }

    function rotatePivot() {
        pivot.rotation.y += (targetRotationX - pivot.rotation.y) * 0.1;
        pivot.rotation.x += (targetRotationY - pivot.rotation.x) * 0.1;
    }

    renderer.xr.addEventListener('sessionend', function (event) {
        if (sessionMode == 'immersive-vr') {
            /*
            sessionMode = 'inline';
            console.log('out of VR immersive mode.');

            //remove sceneobj from controller and put in the scene back
            if (controller1.userData.selected) {
                if (controller1.userData.selected.length) {
                    //selectables.push( controller1.userData.selected );
                    controller1.userData.selected.forEach((child) => {
                        selectables.push(child);
                        FUNCTIONS.putInScene(child);
                    });
                    controller1.userData.selected = undefined;
                }
            } else if (controller2.userData.selected) {
                if (controller2.userData.selected.length) {
                    //selectables.push( controller2.userData.selected );
                    controller2.userData.selected.forEach((child) => {
                        selectables.push(child);
                        FUNCTIONS.putInScene(child);
                    });
                    controller2.userData.selected = undefined;
                }
            }

            selectables.forEach((child) => {
                child.scale.set(1, 1, 1);
                child.position.set(child.userData.position.x, child.userData.position.y, child.userData.position.z);
                child.lookAt(child.userData.lookat._x, child.userData.lookat._y, child.userData.lookat._z);
            });

            let room = Scene.getObjectByName('room');
            if (room) Scene.remove(room);

            if (Scene.getObjectByName('atomi1VR')) FUNCTIONS.changeScene('atomi1VR', AtomScene, 'atomsVR', 'atoms');
            if (Scene.getObjectByName('atomi2VR')) FUNCTIONS.changeScene('atomi2VR', SmallAtomScene, 'smallatomsVR', 'smallatoms');

            if (Scene.getObjectByName('ligands1VR')) FUNCTIONS.changeScene('ligands1VR', LigandsScene, 'atomsLVR', 'atomsL');

            if (Scene.getObjectByName('ligands2VR')) FUNCTIONS.changeScene('ligands2VR', SmallLigandsScene, 'smallatomsLVR', 'smallatomsL');
            if (Scene.getObjectByName('solventiVR')) FUNCTIONS.changeScene('solventsVR', ScenaSolvents, 'solventsVR', 'solvents');

            XRControllers.cleanIntersected();

            //set opacity of VR object
            FUNCTIONS.moveSlider($('#atomslider'), $('#atomslider').val(), Scene.getObjectByName('atoms'), $('#rangevalue1'));

            $('#vrmobilebis').prop('checked', false);
            $('#VRmode').prop('checked', false);
        */
        } else {
            //AR session

            sessionMode = 'inline';
            console.log('out of AR immersive mode.');

            XRsession = null;
            proteinPlaced = false;

            if (ARcontrols) {
                ARcontrols.detach();
                ARcontrols.dispose();
            }
            $('#mobilebuttons').css('bottom', '5em');

            Scene.remove(ARcontrols);

            selectables.forEach((obj) => {
                obj.visible = true;
            });

            let i = 0,
                j = pivot.children.length;
            while (i < j) {
                FUNCTIONS.prepareForNonAR(pivot.children[0], false);
                i++;
            }

            //in case of zoom
            pivot.scale.set(1, 1, 1);
            //remove zoom listeners
            renderer.domElement.removeEventListener('touchstart', onDocumentTouchStart, false);
            renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);
            renderer.domElement.addEventListener('touchend', onDocumentTouchEnd, false);

            controls.enabled = true;

            $('#armobile').prop('checked', false);
        }
    });

    function raycastProtein(intersects) {
        var atom, bond, tolerance, faceIndex;
        if (intersects[0]) {
            intersectedMesh = intersects[0].object;
            faceIndex = intersects[0].faceIndex;
            if (intersectedMesh.geometry.attributes.position) {
                try {
                    switch (intersectedMesh.userData.type) {
                        case 'helix':
                        case 'sheet':
                        case 'loops':
                        case 'nucleicAcid':
                            if (intersectedMesh.userData.type == 'nucleicAcid') tolerance = 2.5;
                            else tolerance = 1.8;

                            atom = FUNCTIONS.getAtomFromPosition(intersectedMesh.userData.backbone, intersects[0].point, tolerance);

                            if (atom) {
                                if (atom.nucleic) {
                                    let type = atom.nucleicType;
                                    let stickMesh = SecondaryStructureScene.children[0].getObjectByUserDataProperty('type', 'basestick' + type);
                                    let polygonMesh = SecondaryStructureScene.children[0].getObjectByUserDataProperty('type', 'basesPolygon' + type);

                                    colorNucleicAcid(intersectedMesh, stickMesh, polygonMesh, atom);
                                } else {
                                    let faceArrayBackbone = intersectedMesh.geometry.userData.faceArray[atom.serial];

                                    var complement = FUNCTIONS.invertColor(atom.color);
                                    FUNCTIONS.colorFaces(intersectedMesh, faceArrayBackbone, new THREE.Color(complement));
                                    intersectedMesh.geometry.attributes.color.needsUpdate = true;

                                    lastColor1 = new THREE.Color(atom.color);
                                    lastMesh1 = intersectedMesh;
                                    lastFaces1 = faceArrayBackbone;
                                }
                            }

                            break;
                        case 'bond_HBOND':
                        case 'bond_IONIC':
                        case 'bond_VDW':
                        case 'bond_PICATION':
                        case 'bond_PIPISTACK':
                        case 'bond_SSBOND':
                        case 'GENERIC':
                            tolerance = 3; //no need of tolerance for bonds
                            bond = FUNCTIONS.getBondFromPosition(intersectedMesh.geometry.userData.mergedUserData, intersects[0].point, tolerance);

                            if (bond) {
                                let faceArray = intersectedMesh.geometry.userData.faceArray[bond.serial];

                                lastColor1 = new THREE.Color(bond.color);
                                lastFaces1 = faceArray;
                                lastMesh1 = intersectedMesh;
                                var complement = FUNCTIONS.invertColor(COLOR.nonCovalentBonds[bond.interaction]);

                                FUNCTIONS.colorFaces(intersectedMesh, faceArray, new THREE.Color(complement));
                                intersectedMesh.geometry.attributes.color.needsUpdate = true;
                            }

                            break;
                        case 'atoms':
                        case 'smallatoms':
                        case 'atomsL':
                        case 'smallatomsL':
                        case 'solvents':
                        case 'smallatoms_COV':
                        case 'atoms_COV':
                        case 'atomsL_COV':
                        case 'smallatomsL_COV':
                        case 'wireframe':
                            if (
                                intersectedMesh.userData.type == 'smallatoms' ||
                                intersectedMesh.userData.type == 'smallatomsL' ||
                                intersectedMesh.userData.type == 'smallatoms_COV' ||
                                intersectedMesh.userData.type == 'smallatomsL_COV' ||
                                intersectedMesh.userData.type == 'wireframe'
                            )
                                tolerance = 1;
                            //smallatoms radius and wireframe
                            else tolerance = 2; //mean radius of atoms
                            //TODO basic linear search
                            atom = FUNCTIONS.getAtomFromPosition(intersectedMesh.geometry.userData.mergedUserData, intersects[0].point, tolerance);
                            if (atom) {
                                if (intersectedMesh.userData.type == 'smallatomsL') {
                                    let mesh1 = intersectedMesh;
                                    let mesh2 = LigandBondsScene.getObjectByUserDataProperty('type', 'bondsL');
                                    colorAtomStick(mesh1, mesh2, atomStickArraysL, atom);
                                } else if (intersectedMesh.userData.type == 'smallatoms') {
                                    let mesh1 = intersectedMesh;
                                    let mesh2 = AtomBondsScene.getObjectByUserDataProperty('type', 'bonds');
                                    colorAtomStick(mesh1, mesh2, atomStickArrays, atom);
                                } else if (intersectedMesh.userData.type == 'smallatomsL_COV') {
                                    let mesh1 = intersectedMesh;
                                    let mesh2 = LigandBondsScene.getObjectByUserDataProperty('type', 'bondsL_COV');
                                    colorAtomStick(mesh1, mesh2, atomStickArraysLCOV, atom);
                                } else if (intersectedMesh.userData.type == 'smallatoms_COV') {
                                    let mesh1 = intersectedMesh;
                                    let mesh2 = AtomBondsScene.getObjectByUserDataProperty('type', 'bonds_COV');
                                    colorAtomStick(mesh1, mesh2, atomStickArraysCOV, atom);
                                } else {
                                    let faceArray = intersectedMesh.geometry.userData.faceArray[atom.serial];
                                    lastColor1 = new THREE.Color(atom.color);
                                    lastFaces1 = faceArray;
                                    lastMesh1 = intersectedMesh;
                                    var complement = FUNCTIONS.invertColor(atom.color);
                                    FUNCTIONS.colorFaces(intersectedMesh, faceArray, new THREE.Color(complement));
                                    intersectedMesh.geometry.attributes.color.needsUpdate = true;
                                }
                            }

                            break;
                        case 'basestickDNA':
                        case 'basestickRNA':
                        case 'basesPolygonDNA':
                        case 'basesPolygonRNA':
                            tolerance = 3;
                            atom = FUNCTIONS.getAtomFromPosition(intersectedMesh.geometry.userData.mergedUserData, intersects[0].point, tolerance);

                            if (atom) {
                                let type = atom.nucleicType;
                                let mesh1, mesh2, mesh3;
                                let meshArr = SecondaryStructureScene.children[0].getObjectsByUserDataProperty('type', 'nucleicAcid');

                                function checkResSeq(a) {
                                    return a.resSeq == atom.resSeq && a.chainId == atom.chainId;
                                }
                                let found = false,
                                    m = 0;

                                while (!found) {
                                    if (meshArr[m].userData.backbone.findIndex(checkResSeq) != -1) {
                                        mesh1 = meshArr[m];
                                        found = true;
                                    }
                                    m++;
                                }

                                if (intersectedMesh.userData.type == 'basestickRNA' || intersectedMesh.userData.type == 'basestickDNA') {
                                    mesh2 = intersectedMesh;
                                    mesh3 = SecondaryStructureScene.children[0].getObjectByUserDataProperty('type', 'basesPolygon' + type);
                                } else {
                                    mesh2 = SecondaryStructureScene.children[0].getObjectByUserDataProperty('type', 'basestick' + type);
                                    mesh3 = intersectedMesh;
                                }
                                colorNucleicAcid(mesh1, mesh2, mesh3, atom);
                            }

                            break;
                        case 'bonds':
                        case 'bondsL':
                        case 'bonds_COV':
                        case 'bondsL_COV':
                            tolerance = 0.75;
                            atom = FUNCTIONS.getAtomFromPosition(intersectedMesh.geometry.userData.mergedUserData, intersects[0].point, tolerance);

                            if (atom) {
                                if (intersectedMesh.userData.type == 'bonds') {
                                    let mesh1 = SmallAtomScene.getObjectByUserDataProperty('type', 'smallatoms');
                                    let mesh2 = intersectedMesh;
                                    colorAtomStick(mesh1, mesh2, atomStickArrays, atom);
                                } else if (intersectedMesh.userData.type == 'bondsL') {
                                    let mesh1 = SmallAtomScene.getObjectByUserDataProperty('type', 'smallatomsL');
                                    let mesh2 = intersectedMesh;
                                    colorAtomStick(mesh1, mesh2, atomStickArraysL, atom);
                                } else if (intersectedMesh.userData.type == 'bonds_COV') {
                                    let mesh1 = SmallAtomScene.getObjectByUserDataProperty('type', 'smallatoms_COV');
                                    let mesh2 = intersectedMesh;
                                    colorAtomStick(mesh1, mesh2, atomStickArraysCOV, atom);
                                } else if (intersectedMesh.userData.type == 'bondsL_COV') {
                                    let mesh1 = SmallAtomScene.getObjectByUserDataProperty('type', 'smallatomsL_COV');
                                    let mesh2 = intersectedMesh;
                                    colorAtomStick(mesh1, mesh2, atomStickArraysLCOV, atom);
                                }
                            }

                            break;

                        default:
                            //do nothing
                            break;
                    }
                    if (atom) {
                        FUNCTIONS.showToast(atom, bondloaded, 'atom');
                    } else {
                        //bond
                        FUNCTIONS.showToast(bond, bondloaded, 'bond');
                    }
                } catch (all) {
                    console.log('Raycasting Error: ' + all.message);
                    return;
                }
            }
        }
    }

    //mesh1 = nucleic acid backbone, mesh2 = sticks, mesh3 = polygons
    function colorNucleicAcid(mesh1, mesh2, mesh3, atom) {
        let faceArrayBackbone, faceArraySticks, faceArrayPolygons;

        faceArrayBackbone = nucleicArrays[atom.resSeq + '' + atom.chainId].backbone;
        faceArraySticks = nucleicArrays[atom.resSeq + '' + atom.chainId].stick;
        faceArrayPolygons = nucleicArrays[atom.resSeq + '' + atom.chainId].polygon;
        var complement = FUNCTIONS.invertColor(atom.color);

        lastColor1 = new THREE.Color(mesh1.geometry.attributes.color.array[0], mesh1.geometry.attributes.color.array[1], mesh1.geometry.attributes.color.array[2]);
        lastMesh1 = mesh1;
        lastFaces1 = faceArrayBackbone;

        //first half of stick
        lastColor2 = new THREE.Color(mesh2.geometry.attributes.color.array[0], mesh2.geometry.attributes.color.array[1], mesh2.geometry.attributes.color.array[2]);
        //second half of stick
        let idx = mesh2.userData.count * 3;
        lastColor2bis = new THREE.Color(mesh2.geometry.attributes.color.array[idx], mesh2.geometry.attributes.color.array[idx + 1], mesh2.geometry.attributes.color.array[idx + 2]);
        lastMesh2 = mesh2;
        lastFaces2 = faceArraySticks;

        lastColor3 = new THREE.Color(mesh3.geometry.attributes.color.array[0], mesh3.geometry.attributes.color.array[1], mesh3.geometry.attributes.color.array[2]);
        lastMesh3 = mesh3;
        lastFaces3 = faceArrayPolygons;

        FUNCTIONS.colorFaces(mesh1, faceArrayBackbone.slice(0, faceArrayBackbone.length), new THREE.Color(complement));
        FUNCTIONS.colorFaces(mesh2, faceArraySticks.slice(0, faceArraySticks.length), new THREE.Color(complement));
        FUNCTIONS.colorFaces(mesh3, faceArrayPolygons.slice(0, faceArrayPolygons.length), new THREE.Color(complement));

        mesh1.geometry.attributes.color.needsUpdate = true;
        mesh2.geometry.attributes.color.needsUpdate = true;
        mesh3.geometry.attributes.color.needsUpdate = true;
    }

    //mesh1 = smallatom, mesh2 = stick
    function colorAtomStick(mesh1, mesh2, array, atom) {
        let faceArrayAtom, faceArraySticks;

        faceArrayAtom = array[atom.serial].atoms;
        faceArraySticks = array[atom.serial].bonds;

        var complement = FUNCTIONS.invertColor(atom.color);

        if (faceArraySticks) {
            FUNCTIONS.colorFaces(mesh2, faceArraySticks, new THREE.Color(complement));
            lastColor2 = new THREE.Color(atom.color);
            lastMesh2 = mesh2;
            lastFaces2 = faceArraySticks;
            mesh2.geometry.attributes.color.needsUpdate = true;
        }
        if (faceArrayAtom) {
            FUNCTIONS.colorFaces(mesh1, faceArrayAtom, new THREE.Color(complement));
            lastColor1 = new THREE.Color(atom.color);
            lastMesh1 = mesh1;
            lastFaces1 = faceArrayAtom;
            mesh1.geometry.attributes.color.needsUpdate = true;
        }
    }

    function animate(timestamp, frame) {
        renderer.setAnimationLoop(animate);
        if (!renderer.xr.isPresenting) {
            if (mouse2.x != 9999 && mouse2.x != 99999) {
                raycaster.setFromCamera(mouse, camera);
                var intersects = raycaster.intersectObjects(Scene.children, true);
                raycastProtein(intersects);
                mouse2.x = 9999;
            }

            controls.update();
        } else if (sessionMode == 'immersive-vr') {
            /*
            //VR MODE
            XRControllers.cleanIntersected();

            XRControllers.intersectObjects(controller1);
            XRControllers.intersectObjects(controller2);

            ThreeMeshUI.update();
            */
        } else {
            //AR MODE
            if (frame && !proteinPlaced) {
                var referenceSpace = renderer.xr.getReferenceSpace();
                var session = renderer.xr.getSession();

                if (hitTestSourceRequested === false) {
                    session.requestReferenceSpace('viewer').then(function (referenceSpace) {
                        session.requestHitTestSource({ space: referenceSpace }).then(function (source) {
                            hitTestSource = source;
                        });
                    });

                    session.addEventListener('end', function () {
                        hitTestSourceRequested = false;
                        hitTestSource = null;
                    });
                    hitTestSourceRequested = true;
                }

                if (hitTestSource && !proteinPlaced) {
                    var hitTestResults = frame.getHitTestResults(hitTestSource);
                    if (hitTestResults.length) {
                        var hit = hitTestResults[0];
                        reticle.visible = true;
                        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
                    } else {
                        reticle.visible = false;
                    }
                }
            } else if (frame && proteinPlaced) {
                XRControllers.intersectObjects(controller1);
                //rotatePivot();
            }
        }

        renderer.render(Scene, camera);
    }
});
