import {
    edges,
    nodes,
    Atoms,
    Backbone,
    AtomBonds,
    AlsoConnect,
    Helix,
    Sheet,
    Loop,
    Ligands,
    LigandBonds,
    Solvents,
    median,
    ter,
    drawRibbon,
    setSheet,
    indexArray,
    LindexArray,
    Oxigen,
    TOLERANCE,
    RNAatoms,
    DNAatoms,
    DNABackbone,
    RNABackbone,
    chains,
    minY,
    maxY,
    minX,
    maxX,
    minZ,
    maxZ,
    setMinY,
    setMinX,
    setMinZ,
    setMaxX,
    setMaxY,
    setMaxZ,
    residueSequence,
    increaseResCount,
    setDisegnaRibbon,
    setPDBinfo,
} from './Core.js';
import { renderNonCovBonds, renderizza } from './Rendering.js';
import { compareSheetHelix, checkDuplicates, calcola_Distanza, addBond } from './Functions.js';
import * as CONSTANTS from './Constants.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.min.js';

///////////////////////////////////////////////////////////////////////
///PARSING PDB FILE
///////////////////////////////////////////////////////////////////////

export function parsePDB(pdb, proteinName) {
    let lines = null;
    let resolution = '';
    let hasHeader = false;

    //multi-model protein: must read only first model coordinates and CONECT fields
    if (pdb.indexOf('NUMMDL') != -1) {
        let endLineIndex = pdb.indexOf('ENDMDL');
        let pdbmodel = pdb.slice(0, endLineIndex);
        console.log('Multi-model protein: first model are considered');
        let pdbconnect = pdb.slice(pdb.indexOf('CONECT'), pdb.length); //conect lines after end of model
        pdb = pdbmodel.concat(pdbconnect);
    }

    var occur2 = Number.MAX_SAFE_INTEGER,
        precChainId,
        lastRes;
    var i = 0,
        ter = 0,
        loopIndex = 0,
        loop = true;

    setMinY(1000);
    setMaxY(-1000);
    setMinX(1000);
    setMaxX(-1000);
    setMinZ(1000);
    setMaxZ(-1000);

    try {
        lines = pdb.split(/\r\n|\n/);

        lines.forEach((line) => {
            let endLineIndex = null;
            let type = line.slice(0, 6).trim(); //the first 6 chars determine the record type
            switch (type) {
                case 'REMARK':
                    //read resolution
                    let num = parseInt(line.slice(9, 10)); //resolution is in remark 2
                    if (num == 2) {
                        if (line.slice(11, 38).trim() == 'RESOLUTION. NOT APPLICABLE.') resolution = 'Resolution Not Applicable';
                        else resolution = line.slice(23, 30).trim() + ' Å';
                    }
                    break;
                case 'JRNL':
                    readAtomInfo(line);
                    break;
                case 'HELIX':
                    readHelices(line);
                    break;
                case 'SHEET':
                    readSheets(line);
                    break;
                case 'ATOM':
                    readAtoms(line);
                    break;
                case 'TER':
                    let serial = line.slice(7, 11);
                    Atoms[serial] = 'TER';
                    ter++;
                    Backbone.push('TER');
                    indexArray.push('TER');
                    break;
                case 'HETATM':
                    readHetatm(line);
                    break;
                case 'CONECT':
                    readConect(line);
                    break;
            }
        });

        function readAtomInfo(line) {
            let type = line.slice(12, 18).trim();
            if (type == 'TITL') {
                let atominfo = line.slice(19, 79).trim();
                let text = proteinName.toUpperCase() + ': ' + atominfo;
                document.getElementById('sidebar-header').innerHTML = text;
                setPDBinfo(text);
                hasHeader = true;
            }
        }
        function readHelices(line) {
            let startChainId = line.slice(19, 20).trim();
            let start = parseInt(line.slice(20, 25));
            let endChainId = line.slice(31, 32).trim();
            let end = parseInt(line.slice(32, 37));
            Helix.push({
                startChainId: startChainId,
                start: start,
                endChainId: endChainId,
                end: end,
            });
        }
        function readSheets(line) {
            let startChainId = line.slice(21, 22);
            let start = parseInt(line.slice(22, 26));
            let endChainId = line.slice(32, 33);
            let end = parseInt(line.slice(33, 37));
            Sheet.push({
                startChainId: startChainId,
                start: start,
                endChainId: endChainId,
                end: end,
            });
        }
        function readAtoms(line) {
            let serial = parseInt(line.slice(6, 11).trim());
            let name = line.slice(11, 16).trim();
            let resName = line.slice(17, 20).trim();
            let chainId = line.slice(21, 22);
            let resSeq = parseInt(line.slice(22, 26));
            let pos = new THREE.Vector3(parseFloat(line.slice(31, 38)), parseFloat(line.slice(38, 46)), parseFloat(line.slice(46, 54)));
            let bFactor = parseFloat(line.slice(61, 66));
            let elem = line.slice(77, 78).trim().toUpperCase();

            if (serial && name && resName && chainId && resSeq && pos != undefined) {
                //check for atoms lexicographic order
                if (precChainId > chainId && drawRibbon) {
                    let string = 'Atoms are not in lexicographic order secondary structure will not be fully displayed ';
                    $('#pdbsuccesp').append('<br>Warning: ' + string);
                    console.log(string);
                    setDisegnaRibbon(false);
                    isInOrder = false;
                }
                precChainId = chainId;
                //variables for setting zoom and for calculates bonds
                minY > pos.y ? setMinY(pos.y) : setMinY(minY);
                maxY < pos.y ? setMaxY(pos.y) : setMaxY(maxY);
                minX > pos.x ? setMinX(pos.x) : setMinX(minX);
                maxX < pos.x ? setMaxX(pos.x) : setMaxX(maxX);
                minZ > pos.z ? setMinZ(pos.z) : setMinZ(minZ);
                maxZ < pos.z ? setMaxZ(pos.z) : setMaxZ(maxZ);

                median.add(pos);

                let atom = {
                    pos: pos,
                    name: name,
                    resName: resName,
                    chainId: chainId,
                    resSeq: resSeq,
                    serial: serial,
                    nonCovBonds: [],
                };
                if (elem) {
                    atom.elem = elem;
                    atom.color = CONSTANTS.color[elem];
                } else {
                    if (CONSTANTS.color[name.slice(0, 1)]) {
                        atom.elem = name.slice(0, 1);
                        atom.color = CONSTANTS.color[name.slice(0, 1)];
                    } else {
                        atom.elem = name.slice(0, 2);
                        atom.color = CONSTANTS.color[name.slice(0, 2)];
                    }
                }
                if (bFactor) {
                    atom.bFactor = bFactor;
                }
                Atoms[serial] = atom;
                if (!residueSequence[chainId]) {
                    residueSequence[chainId] = [];
                }
                if (lastRes != resName) {
                    residueSequence[chainId].push(resName);
                    increaseResCount();
                }
                lastRes = resName;

                if (!indexArray[chainId + ':' + resSeq + ':' + resName]) {
                    indexArray[chainId + ':' + resSeq + ':' + resName] = [];
                }
                indexArray[chainId + ':' + resSeq + ':' + resName].push(serial);

                if (!chains[chainId]) {
                    chains[chainId] = {};
                    chains[chainId].counter = 1;
                    chains[chainId].atoms = [];
                    chains[chainId].atoms.push(atom);
                } else {
                    chains[chainId].counter++;
                    chains[chainId].atoms.push(atom);
                }

                //nucleic acids atoms
                if (['DA', 'DC', 'DG', 'DT', 'DI'].includes(resName)) {
                    //DNA
                    DNAatoms.push(atom);
                    atom.nucleic = true;
                    atom.nucleicType = 'DNA';
                    if (name == "O3'") DNABackbone.push(atom);
                } else if (['A', 'C', 'G', 'U', 'I'].includes(resName)) {
                    //RNA
                    RNAatoms.push(atom);
                    atom.nucleic = true;
                    atom.nucleicType = 'RNA';
                    if (name == "O3'") RNABackbone.push(atom);
                } else {
                    //Carbon atoms compose the backbone of the protein
                    if (name == 'C') {
                        Backbone.push(atom);
                    }
                    //Oxygen atoms are essential for drawing beta sheets
                    if (name == 'O') Oxigen[chainId.toString() + resSeq.toString()] = pos;
                }
            } else {
                console.log('problem at line: ' + serial);
            }
        }
        function readHetatm(line) {
            let serial = parseInt(line.slice(6, 11).trim());
            let name = line.slice(11, 16).trim();
            let resName = line.slice(17, 20).trim();
            let chainId = line.slice(21, 22);
            let resSeq = parseInt(line.slice(23, 26));
            let pos = new THREE.Vector3(parseFloat(line.slice(31, 38)), parseFloat(line.slice(38, 46)), parseFloat(line.slice(46, 54)));

            let BFactor = parseFloat(line.slice(61, 66));
            let elem = line.slice(76, 78).trim().toUpperCase();

            if (serial && name && resName && chainId && resSeq && pos.x && pos.y && pos.z) {
                //variables for setting zoom and for calculates bonds
                minY > pos.y ? setMinY(pos.y) : setMinY(minY);
                maxY < pos.y ? setMaxY(pos.y) : setMaxY(maxY);
                minX > pos.x ? setMinX(pos.x) : setMinX(minX);
                maxX < pos.x ? setMaxX(pos.x) : setMaxX(maxX);
                minZ > pos.z ? setMinZ(pos.z) : setMinZ(minZ);
                maxZ < pos.z ? setMaxZ(pos.z) : setMaxZ(maxZ);

                median.add(pos); //median

                let atomo = {
                    pos: pos,
                    name: name,
                    resName: resName,
                    chainId: chainId,
                    resSeq: resSeq,
                    serial: serial,
                    nonCovBonds: [],
                };

                if (elem) {
                    atomo.elem = elem;
                    atomo.color = CONSTANTS.color[elem];
                } else {
                    if (CONSTANTS.color[name.slice(0, 1)]) {
                        atomo.elem = name.slice(0, 1);
                        atomo.color = CONSTANTS.color[name.slice(0, 1)];
                    } else {
                        atomo.elem = name.slice(0, 2);
                        atomo.color = CONSTANTS.color[name.slice(0, 2)];
                    }
                }
                if (BFactor) {
                    atomo.bFactor = BFactor;
                }

                if (resName == 'HOH') {
                    Solvents.push(atomo);
                } else {
                    Ligands[serial] = atomo;
                }
                //Ligands 2d array
                LindexArray.push(chainId + ':' + resSeq + ':' + resName);
                if (!LindexArray[chainId + ':' + resSeq + ':' + resName]) {
                    LindexArray[chainId + ':' + resSeq + ':' + resName] = [];
                }
                LindexArray[chainId + ':' + resSeq + ':' + resName].push(serial);
            }
        }
        function readConect(line) {
            let flag;
            let atom1 = line.slice(6, 11).trim();
            let atom2 = line.slice(11, 16).trim();
            let atom3 = line.slice(16, 21).trim();
            let atom4 = line.slice(21, 26).trim();
            let atom5 = line.slice(26, 31).trim();
            AlsoConnect.push(atom1);

            //true = first atom is a ligand
            Atoms[atom1] ? (flag = false) : (flag = true);

            try {
                addBond(atom1, atom2, flag);
                addBond(atom1, atom3, flag);
                addBond(atom1, atom4, flag);
                addBond(atom1, atom5, flag);
            } catch {
                console.log('Conect records not formatted correctly!');
            }
        }
        //covalent bonds  ->   radius1 + radius2 + tolerance O(n)
        function covalentBonds(atoms, type) {
            let nVectX = (maxX - minX) / 2;
            let nVectY = (maxY - minY) / 2;
            let nVectZ = (maxZ - minZ) / 2;
            let cont = new Array();

            for (var i = 0; i < nVectX; i++) {
                cont[i] = new Array();
                for (var j = 0; j < nVectY; j++) cont[i][j] = new Array();
            }

            Object.keys(atoms).forEach((serial) => {
                if (Atoms[serial] == 'TER') return;

                let indeX = Math.floor((atoms[serial].pos.x - minX) / 2);
                let indeY = Math.floor((atoms[serial].pos.y - minY) / 2);
                let indeZ = Math.floor((atoms[serial].pos.z - minZ) / 2);

                if (cont[indeX][indeY][indeZ] == undefined) cont[indeX][indeY][indeZ] = new Array();

                cont[indeX][indeY][indeZ].push(atoms[serial]);
            });

            //covalent bonds
            let cache = CONSTANTS.CovalentRadius;
            for (var i = 0; i < nVectX; i++)
                for (var j = 0; j < nVectY; j++)
                    for (var k = 0; k < nVectZ; k++) {
                        if (!cont[i][j][k]) continue;

                        var original_length = cont[i][j][k].length;
                        for (var l = 0; l < original_length; l++) {
                            var atom = cont[i][j][k].pop();

                            var iXs = i - 1 < 0 ? 0 : i - 1;
                            var iYs = j - 1 < 0 ? 0 : j - 1;
                            var iZs = k - 1 < 0 ? 0 : k - 1;

                            for (var iXs2 = iXs; iXs2 < i + 2 && iXs2 < nVectX; iXs2++)
                                for (var iYs2 = iYs; iYs2 < j + 2 && iYs2 < nVectY; iYs2++)
                                    for (var iZs2 = iZs; iZs2 < k + 2 && iZs2 < nVectZ; iZs2++) {
                                        if (!cont[iXs2][iYs2][iZs2]) continue;

                                        cont[iXs2][iYs2][iZs2].forEach((other) => {
                                            var dist = calcola_Distanza(atom, other);
                                            var raggio1 = cache[atom.elem];
                                            var raggio2 = cache[other.elem];

                                            if (raggio1 + raggio2 + TOLERANCE > dist) {
                                                if (type == 'ligands')
                                                    LigandBonds.push({
                                                        atom1: atom,
                                                        atom2: other,
                                                    });
                                                else
                                                    AtomBonds.push({
                                                        atom1: atom,
                                                        atom2: other,
                                                    });
                                            }
                                        });
                                    }
                        }
                    }

            cont.splice(0, cont.length);
        }

        if (Helix.length > 0) Helix.sort(compareSheetHelix);
        if (Sheet.length > 0) {
            Sheet.sort(compareSheetHelix);
            setSheet(Sheet.filter(checkDuplicates));
        }
        console.log('Chain found : ' + ter);
        if (Atoms.length > 0) median.divideScalar(Object.keys(Atoms).length);
        else median.divideScalar(Object.keys(Ligands).length);
        if (Object.keys(Atoms).length) covalentBonds(Atoms, 'atoms');
        if (!hasHeader) {
            //PDB has no atom info
            document.getElementById('sidebar-header').innerHTML = proteinName;
            setPDBinfo(proteinName);
        }

        if (Object.keys(Ligands).length) {
            covalentBonds(Ligands, 'ligands');
        }

        console.log('Parsed ' + (Object.keys(Atoms).length - ter) + ' atoms.');
        console.log('Parsed ' + Object.keys(Ligands).length + ' ligands.');
        console.log('Parsed ' + Solvents.length + ' solvents.');
    } catch (all) {
        console.log('Parsing error: ' + all.message);
        alert('Parsing error: ' + all.message);
        return false;
    }

    //fill information modal
    $('#infomodalbody').html('<strong>Residue Sequence:</strong><br><br>');
    for (let chain in chains) {
        $('#infomodalbody').append('Chain ' + chain + ': ' + residueSequence[chain].join(' ') + '<br><br>');
    }
    let rescount,
        flag = false,
        counter = 1;
    if (Atoms.length > 0) {
        while (!flag) {
            if ((rescount = Atoms[Object.keys(Atoms)[Object.keys(Atoms).length - counter]].resSeq) != undefined) flag = true;
            else counter++;
        }
    }

    $('#infomodalbody').append('<strong>Residue count:</strong> ' + rescount + '<br>'); //at pos Atoms.length-1 there is a TER
    $('#infomodalbody').append('<strong>Chains:</strong> ' + ter + '<br>');
    //count atoms without "ter"
    $('#infomodalbody').append('<strong>Atoms:</strong> ' + (Object.keys(Atoms).length - ter) + '<br>');
    $('#infomodalbody').append('<strong>Ligands:</strong> ' + Object.keys(Ligands).length + '<br>');
    $('#infomodalbody').append('<strong>Water molecules:</strong> ' + Solvents.length + '<br>');
    $('#infomodalbody').append('<strong>Resolution:</strong> ' + resolution + '<br>');

    $('#loading_parsing').html('Parsing: DONE');

    renderizza();

    return true;
}

////////////////////////////////////////////////////////
// PARSING NON-COVALENT BONDS XML FILE
////////////////////////////////////////////////////////

export function parseXmlBonds(text) {
    var cHBOND = 0,
        cVDW = 0,
        cIONIC = 0,
        cPIPISTACK = 0,
        cSBOND = 0,
        cGENERIC = 0,
        cPICATION = 0;
    var xml, parser;
    if (window.DOMParser) {
        // code for modern browsers
        parser = new DOMParser();
        xml = parser.parseFromString(text, 'text/xml');
    } else {
        // code for old IE browsers
        xml = new ActiveXObject('Microsoft.XMLDOM');
        xml.async = false;
        xml.loadXML(text);
    }

    try {
        //parse edges
        var xmledges = xml.getElementsByTagName('edge');
        var serial = 0;
        for (let i = 0; i < xmledges.length; i++) {
            var data = xmledges[i].getElementsByTagName('data');
            var distance;
            if (data[0].childNodes[0]) {
                distance = parseFloat(xmledges[i].querySelector('data[key=e_Distance]').innerHTML); //e_Distance
            }
            var interaction;
            if (data[1].childNodes[0]) {
                interaction = xmledges[i].querySelector('data[key=e_Interaction]').innerHTML; //e_Interaction
            }
            var angle;
            if (data[2].childNodes[0]) {
                angle = parseFloat(xmledges[i].querySelector('data[key=e_Angle]').innerHTML); //e_Angle
            }
            var energy;
            if (data[5].childNodes[0]) {
                energy = xmledges[i].querySelector('data[key=e_Energy]').innerHTML; //e_Energy
            }
            var index = interaction.lastIndexOf(':');
            var intType, intExt;
            if (index == -1) {
                intType = interaction;
            } else {
                intExt = interaction.substring(index + 1); //MC_MC,SC_MC ecc
                // sub_Type, where subtype = main chain (MC), side chain (SC) and ligand (LIG).
                intType = interaction.substring(0, index);
            }

            switch (intType) {
                case 'HBOND':
                    cHBOND++;
                    break;
                case 'SBOND':
                    cSBOND++;
                    break;
                case 'VDW':
                    cVDW++;
                    break;
                case 'IONIC':
                    cIONIC++;
                    break;
                case 'PIPISTACK':
                    cPIPISTACK++;
                    break;
                case 'PICATION':
                    cPIPISTACK++;
                    break;
                case 'GENERIC':
                    cGENERIC++;
                    break;
            }

            var atomName1 = xmledges[i].querySelector('data[key=e_Atom1]').innerHTML; //e_Atom1
            var atomName2 = xmledges[i].querySelector('data[key=e_Atom2]').innerHTML; //e_Atom2
            var color = CONSTANTS.nonCovalentBonds[intType];

            // check if atomName1 and atomName2 contain coordinates
            var atomName1 = atomName1.match(/^([-]?\d*\.\d*),([-]?\d*\.\d*),([-]?\d*\.\d*)$/);
            var atomName2 = atomName2.match(/^([-]?\d*\.\d*),([-]?\d*\.\d*),([-]?\d*\.\d*)$/);

            var pos1 = undefined,
                pos2 = undefined;

            if (atomName1) {
                let x = parseFloat(atomName1[1]);
                let y = parseFloat(atomName1[2]);
                let z = parseFloat(atomName1[3]);
                pos1 = new THREE.Vector3(x, y, z);
            }
            if (atomName2) {
                let x = parseFloat(atomName2[1]);
                let y = parseFloat(atomName2[2]);
                let z = parseFloat(atomName2[3]);
                pos2 = new THREE.Vector3(x, y, z);
            }

            var target = xmledges[i].querySelector('data[key=e_NodeId2]').innerHTML; //e_NodeId2
            var source = xmledges[i].querySelector('data[key=e_NodeId1]').innerHTML; //e_NodeId1

            //remove the third field of node_id
            var nodeID1 = source.replace(/^(.*:)(.*:)(.*:)(.*)$/, '$1$2$4');
            var nodeID2 = target.replace(/^(.*:)(.*:)(.*:)(.*)$/, '$1$2$4');

            var isLigand1 = false,
                isLigand2 = false;
            var idxs1 = indexArray[nodeID1];
            var idxs2 = indexArray[nodeID2];

            if (idxs1.length == 0) {
                var idxs1 = LindexArray[nodeID1];
                isLigand1 = true;
            }
            if (idxs2.length == 0) {
                idxs2 = LindexArray[nodeID2];
                isLigand2 = true;
            }

            var node1,
                node2,
                found = false,
                k = 0;

            if (idxs1.length > 0 && !pos1) {
                while (!found && k < idxs1.length) {
                    if (isLigand1) node1 = Ligands[idxs1[k]];
                    else node1 = Atoms[idxs1[k]];
                    if (node1 == undefined) {
                        console.log('undefined!');
                    }
                    if (node1.name == atomName1) found = true;
                    k++;
                }
                if (found) {
                    node1.nonCovBonds.push(intType);
                    nodes.push(node1);
                }
            }
            k = 0;
            found = false;

            if (idxs2.length > 0 && !pos2) {
                while (!found && k < idxs2.length) {
                    if (isLigand1) node2 = Ligands[idxs2[k]];
                    else node2 = Atoms[idxs2[k]];
                    if (node2.name == atomName2) found = true;
                    k++;
                }
                if (found) {
                    node2.nonCovBonds.push(intType);
                    nodes.push(node2);
                }
            }

            if (!pos1) {
                pos1 = node1.pos;
            }
            if (!pos2) {
                pos2 = node2.pos;
            }

            var edge = {
                distance: distance,
                energy: energy,
                angle: angle,
                interaction: intType,
                atom1: atomName1,
                atom2: atomName2,
                coord1: pos1,
                coord2: pos2,
                node1: node1,
                node2: node2,
                serial: serial,
                color: color,
            };
            edges.push(edge);
        }
    } catch (all) {
        console.log('Unexpected error while reading RIN: it seems that intermolecular bonds can not be calculated for this molecule ' + all.message);
        return {};
    }

    $('#infomodalbody').append('<br><strong>RIN information:</strong><br> ');
    $('#infomodalbody').append('<br><strong>RIN nodes:</strong> ' + nodes.length);
    $('#infomodalbody').append('<br><strong>RIN edges:</strong> ' + edges.length);
    $('#infomodalbody').append('<br><strong>HBOND edges:</strong> ' + cHBOND);
    $('#infomodalbody').append('<br><strong>SBOND edges:</strong> ' + cSBOND);
    $('#infomodalbody').append('<br><strong>IONIC edges:</strong> ' + cIONIC);
    $('#infomodalbody').append('<br><strong>VDW edges:</strong> ' + cVDW);
    $('#infomodalbody').append('<br><strong>VDW edges:</strong> ' + cGENERIC);
    $('#infomodalbody').append('<br><strong>VDW edges:</strong> ' + cPICATION);
    $('#infomodalbody').append('<br><strong>PIPISTACK edges:</strong> ' + cPIPISTACK);

    renderNonCovBonds();

    return {
        HBOND: cHBOND,
        SBOND: cSBOND,
        IONIC: cIONIC,
        VDW: cVDW,
        PIPISTACK: cPIPISTACK,
        GENERIC: cGENERIC,
        PICATION: cPICATION,
    };
}
