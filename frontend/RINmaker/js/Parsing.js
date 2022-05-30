import {paintLink_type, paintLink_dist } from './linkPainter.js'
import {paint_by_residue, paint_by_chain, paint_by_degree, paint_by_polarity} from './nodePainter.js'
import {res_to_i,bond_to_i} from './mapToindex.js'


export var nodesRIN = [];
export var linksRIN = [];
export var res_count = new Array(20) //grandezza fissa poichè non ci sono più di 20 residue
export var bond_count = new Array(7) //idem per i legami
export var avg_e_bond = new Array(7)
export var avg_dist_bond = new Array(7)
export var map = {}
export var hbond_ext_count = new Array(4); // [0]=MC_MC [1]=SC_SC [2]=MC_SC [3]=SC_MC

for(var index=0; index < hbond_ext_count.length; index++){ //inizzializzo l'array a 0
    hbond_ext_count[index] = 0
}
for (var index = 0; index < (res_count.length); index++){ //forzo l'inizializzazione a 0 poichè altrimenti js fa quello che vuole
    res_count[index] = 0;
}
for (var index = 0; index < (bond_count.length); index++){ 
    bond_count[index] = 0;
    avg_e_bond[index] = 0;
    avg_dist_bond[index] = 0;
}


///////////////////////////////////////////////////////////////////////
///PARSING PDB FILE
///////////////////////////////////////////////////////////////////////

/*export function parsePDB( pdb, proteinName ){
    
    let pdbmodel = null, pdbconnect = null, lines = null, resolution = "";
    let updated = false; //PDB has HEADER info?
    let isInOrder = true; //PDB atoms are ordered by chainId?
    
    //multi-model protein: must read only first model coordinates and CONECT fields
    if ( pdb.indexOf("NUMMDL") != -1 ){ 
        let endLineIndex = pdb.indexOf("ENDMDL");
        pdbmodel = pdb.slice(0, endLineIndex );
        console.log( "Multi-model protein: first model are considered" );
        pdbconnect = pdb.slice( pdb.indexOf("CONECT"), pdb.length ); //connect lines after end of model
        pdb = pdbmodel.concat(pdbconnect);
    }
    
    var occur2 =  Number.MAX_SAFE_INTEGER, chainIdPrec, lastRes;
    var i=0, ter=0, loopIndex = 0, loop = true;
    
    setMinY(1000); 	setMaxY(-1000);
    setMinX(1000); 	setMaxX(-1000);
    setMinZ(1000); 	setMaxZ(-1000);
    
    // Reading line by line
    try{
        let size = pdb.length /81; //number of pdb lines
        var chunks = chunkSubstr( pdb, 16000*81 ); //size deve essere un multplo del numero di colonne del pdb, size % 81 == 0 (80+\n)
        for ( let chunk in chunks ){
            lines = chunks[chunk].split(/\r\n|\n/);
                
            lines.forEach((line) => {
                let endLineIndex = null;
                let type = line.slice(0,6).trim(); //the first 6 char determine the record type
                switch ( type ){
                    case "REMARK":
                        //read resolution
                        let num = parseInt(line.slice(9,10)); //resolution is in remark 2
                        if ( num == 2 ){
                            if ( line.slice(11,38).trim() == "RESOLUTION. NOT APPLICABLE.")
                                resolution = "Resolution Not Applicable";
                            else
                                resolution  = line.slice(23,30).trim()+" Å";
                        }
                        break;
                    case "JRNL": 
                        readAtomInfo(line);
                        break;
                    case "HELIX":
                        readHelices(line);
                        break;
                    case "SHEET":
                        readSheets(line);
                        break;
                    case "ATOM":
                        readAtoms(line);
                        break;
                    case "TER":
                        //legge il serial di TER e iserisci TER a quella posizione
                        let serial = line.slice(7,11);
                        Atomi[serial] = "TER";		
                        ter++;		
                        Backbone.push("TER");	
                        indexArray.push("TER");
                        break;
                    case "HETATM":
                        readHetatm(line);
                        break;  
                    case "CONECT":
                        readConect(line);
                        break;
                    //personal type of record
                    //7 number of site
                    //8-11 start residue
                    //12-15 end residue
                    //16-19 start residue
                    //20-23 end reidue
                    //24-27 start residue
                    //28-31 end residue
                    //32-35 first ligand
                    //36-39 second ligand (if any)
                    case "SITE":
                        //readSite(line);
                        break;
                }
            });       
        }
    
        function readAtomInfo( line ){

            let type = line.slice(12,18).trim(); 
            if ( type == "TITL" ) {
                let atominfo = line.slice(19, 79).trim();
                let text = proteinName.toUpperCase() + ": " + atominfo;
                document.getElementById("sidebar-header").innerHTML = text;
                //setPDBinfo( atominfo );
                setPDBinfo( text );
                updated = true;
            }
        }
        function readHelices( line ){

            //per usare il pdb 7aai e 7aae cambiare startchainid in 19-20 e endChainID in 31-32
            let startChainId = line.slice(19, 20).trim();				
            let start = parseInt(line.slice(20, 25));
            let endChainId = line.slice(31, 32).trim();	
            let end = parseInt(line.slice(32, 37));

            Helix.push({ startChainId : startChainId , start : start
                        , endChainId : endChainId , end : end});

        }
        function readSheets( line ){

            let startChainId = line.slice(21, 22);					
            let start = parseInt(line.slice(22, 26));
            let endChainId = line.slice(32, 33);  			
            let end = parseInt(line.slice(33, 37));

            Sheet.push({ startChainId : startChainId , start : start
                        , endChainId : endChainId , end : end});			
        }
        function readAtoms( line ){

            let serial = parseInt(line.slice(6,11).trim());
            
            let name = line.slice(11, 16).trim(); 
            let resName = line.slice(17, 20).trim();
            let chainId = line.slice(21, 22);
            let resSeq = parseInt(line.slice(22,26));
            let pos = new THREE.Vector3(parseFloat(line.slice(31, 38)),  			//cordinate 
                                            parseFloat(line.slice(38, 46)),
                                            parseFloat(line.slice(46, 54)));				
            let BFactor = parseFloat(line.slice(61,66));;
            let elem = line.slice(77, 78).trim().toUpperCase();
            
            if ( serial && name && resName && chainId && resSeq && pos.x && pos.y && pos.z ){ //PDBS with only atoms and position does not have bfactor and elem

                //controllo che gli atomi sia ordinati in modo lessicografico in base al campo chainID
            if(chainIdPrec > chainId && disegnaRibbon){
                let string = 'Atoms are not in lexicographic order' + 
                    ' secondary structure will not be fully displayed ';

                    $("#pdbsuccesp").append("<br>Warning: "+string);
                    //alert( string );
                    console.log( string );
                    setDisegnaRibbon(false);
                    isInOrder = false;
                }
                chainIdPrec = chainId;

                //variables for setting zoom and for calculates bonds
                (minY > pos.y)? setMinY(pos.y) : setMinY(minY);
                (maxY < pos.y)? setMaxY(pos.y) : setMaxY(maxY); 
                (minX > pos.x)? setMinX(pos.x) : setMinX(minX); (maxX < pos.x)? setMaxX(pos.x) : setMaxX(maxX);
                (minZ > pos.z)? setMinZ(pos.z) : setMinZ(minZ); (maxZ < pos.z)? setMaxZ(pos.z) : setMaxZ(maxZ);

                mediana.add(pos); 	//mediana

                let atomo = {pos : pos, name : name,
                     resName : resName, chainId : chainId, resSeq : resSeq,
                    serial : serial, nonCovBonds : [], 
                    //kdtreepos : {x : pos.x, y : pos.y, z : pos.z}
                };		
            
                if ( elem ) {
                    atomo.elem = elem;
                    atomo.color = COLOR.color[elem];
                }
                else{
                    if (COLOR.color[name.slice(0,1)]) {
                        atomo.elem = name.slice(0,1); 
                        atomo.color = COLOR.color[name.slice(0,1)];
                    } else {
                        atomo.elem = name.slice(0,2); 
                        atomo.color = COLOR.color[name.slice(0,2)];
                    }     
                } 
                if ( BFactor ) atomo.bFactor = BFactor;
                
                Atomi[serial] = atomo;
                if ( !residueSequence[chainId] ) residueSequence[chainId] = [];
                if ( lastRes != resName ){
                    residueSequence[chainId].push(resName);
                    increaseResCount();
                }
                lastRes = resName;

               if ( !indexArray[chainId+':'+resSeq+':'+resName] )       indexArray[chainId+':'+resSeq+':'+resName] = [];
               indexArray[chainId+':'+resSeq+':'+resName].push(serial);

                if ( !chains[chainId] ){
                    chains[chainId] = {}
                    chains[chainId].counter = 1;
                    chains[chainId].atoms = [];
                    chains[chainId].atoms.push( atomo );
                }else{

                    chains[chainId].counter++;
                    chains[chainId].atoms.push( atomo );
                }

                //nucleic acids

                if ( ['DA', 'DC', 'DG', 'DT', 'DI'].includes(resName)){ //DNA
                    DNAatoms.push(atomo);
                    atomo.nucleic = true;
                    atomo.nucleicType = "DNA";
                    if ( name ==  'O3\'')
                        DNABackbone.push(atomo);
                } else if ( ['A', 'C', 'G', 'U', 'I'].includes(resName) ){ //RNA
                    RNAatoms.push(atomo);
                    atomo.nucleic = true;
                    atomo.nucleicType = "RNA";
                    if ( name ==  'O3\'')
                        RNABackbone.push( atomo );
                } else {    //protein
                    //vengono memorizzati tutti gli atomi con nome 'C'
                    //che compongono la backbone della proteina
                    if(name == "C") { 
                        Backbone.push( atomo );
                        //questo è inutile
                        // if ( !OrderedBackbone[chainId] )
                        //     OrderedBackbone[chainId] = [];
                        // OrderedBackbone[chainId].push( atomo );  
                    }

                    //inserts atoms into secondary structures arrays
                    // /*let found = false, h = 0;
                    // while ( name == "C" && !found && ( h < Helix.length || h < Sheet.length )) {
                    //     //check helixes
                    //     if ( Helix[h] ){
                    //         if ( !Helix[h].atoms ){
                    //             Helix[h].atoms = [];
                    //             Helix[h].positions = [];
                    //             Helix[h].colors = [];
                    //         }

                    //         if ( name == "C" && resSeq <= Helix[h].end && resSeq >= Helix[h].start && chainId == Helix[h].startChainId ){
                    //             Helix[h].atoms.push(atomo);
                    //             Helix[h].positions.push(pos);
                    //             Helix[h].colors.push(atomo.color);

                    //             found = true;
                    //             loop = false;
                    //             break;
                    //         }
                    //     }
                    //     if( Sheet[h] ){
                    //         //check Sheets
                    //         if ( !Sheet[h].atoms ){
                    //             Sheet[h].atoms = [];
                    //             Sheet[h].positions = [];
                    //             Sheet[h].colors = [];
                    //         }

                    //         if ( name == "C" && resSeq <= Sheet[h].end && resSeq >= Sheet[h].start && chainId == Sheet[h].startChainId ){

                    //             Sheet[h].atoms.push(atomo);
                    //             Sheet[h].positions.push(pos);
                    //             Sheet[h].colors.push(atomo.color);

                    //             found = true;
                    //             loop = false;
                    //         } 
                    //     }
                    //     h++;
                    // }


                    // if ( name == "C" && !found ){
                    //     if ( loop == false )
                    //         loopIndex++;
                    //     if ( !Loop[loopIndex] ){
                    //         Loop[loopIndex] = {};
                    //         Loop[loopIndex].atoms = [];
                    //         Loop[loopIndex].positions = [];
                    //         Loop[loopIndex].colors = [];
                    //     }
                    //     Loop[loopIndex].atoms.push(atomo);
                    //     Loop[loopIndex].positions.push(pos);
                    //     Loop[loopIndex].colors.push(atomo.color); 
                    //     loop = true;
                    // }

                    //vengono memorizzati tutti gli atomi con nome 'O' 
                    // questo è necessario per disegnare le beta sheet.
                    if(name == "O")  Oxigen[chainId.toString() + resSeq.toString() ] = pos;
                }   
            } else {
                console.log("problem at line: "+serial);
            } 
        }
        function readHetatm( line ){

            let serial = parseInt(line.slice(6,11).trim());
            let name = line.slice(11, 16).trim(); 
            let resName = line.slice(17, 20).trim();
            let chainId = line.slice(21, 22);
            let resSeq = parseInt(line.slice(23,26));
            let pos = new THREE.Vector3(parseFloat(line.slice(31, 38)),  		
                                        parseFloat(line.slice(38, 46)),
                                        parseFloat(line.slice(46, 54)));		

            let BFactor = parseFloat(line.slice(61,66));;			
            let elem = line.slice(76, 78).trim().toUpperCase();

            if ( serial && name && resName && chainId && resSeq && pos.x && pos.y && pos.z ){

                 //variables for setting zoom and for calculates bonds
                (minY > pos.y)? setMinY(pos.y) : setMinY(minY);
                (maxY < pos.y)? setMaxY(pos.y) : setMaxY(maxY); 
                (minX > pos.x)? setMinX(pos.x) : setMinX(minX); (maxX < pos.x)? setMaxX(pos.x) : setMaxX(maxX);
                (minZ > pos.z)? setMinZ(pos.z) : setMinZ(minZ); (maxZ < pos.z)? setMaxZ(pos.z) : setMaxZ(maxZ);

                mediana.add(pos); 	//mediana

                let atomo = {pos : pos, name : name,		//ligand atom
                     resName : resName, chainId : chainId, resSeq : resSeq,
                    serial : serial, nonCovBonds : [] };
            
                if ( elem ) {
                    atomo.elem = elem;
                    atomo.color = COLOR.color[elem];
                }
                else{
                    if (COLOR.color[name.slice(0,1)]) {
                        atomo.elem = name.slice(0,1); 
                        atomo.color = COLOR.color[name.slice(0,1)];
                    } else {
                        atomo.elem = name.slice(0,2); 
                        atomo.color = COLOR.color[name.slice(0,2)];
                    }     
                } 
                if ( BFactor ) atomo.bFactor = BFactor;
                
                if ( resName == 'HOH') //solvent
                    Solvents.push(atomo);
                else
                    Ligands[serial] = atomo;

                LindexArray.push(chainId+':'+resSeq+':'+resName);
                if ( !LindexArray[chainId+':'+resSeq+':'+resName] )       LindexArray[chainId+':'+resSeq+':'+resName] = [];
               LindexArray[chainId+':'+resSeq+':'+resName].push(serial);
            }
        }  
        function readConect( line ){
            let flag;
            let ligStart;

            let atom1 = line.slice(6, 11).trim(); 
            let atom2 = line.slice(11, 16).trim();
            let atom3 = line.slice(16, 21).trim();
            let atom4 = line.slice(21, 26).trim();
            let atom5 = line.slice(26, 31).trim();
            AlsoConnect.push(atom1);

            //true = first atom is a ligand
            Atomi[atom1] ? flag = false : flag = true;

            try{
                
                addBond(atom1,atom2,flag);
                addBond(atom1,atom3,flag);
                addBond(atom1,atom4,flag);
                addBond(atom1,atom5,flag);

            }catch{ console.log("Conect records not formatted correctly!")}
        }
        //covalent bonds  ->   radius1 + radius2 + tolerance O(n)   
        function covalentBonds( atoms, type ){

                let nVectX = (maxX-minX)/2;   let nVectY = (maxY-minY)/2;   let nVectZ = (maxZ-minZ)/2;
                let cont = new Array;

                for(var i=0; i<nVectX; i++){
                    cont[i] = new Array();
                    for(var j=0; j<nVectY; j++)
                        cont[i][j] = new Array();
                }		

                Object.keys(atoms).forEach(serial => {
                    if(Atomi[serial] == "TER") return;

                    let indeX = Math.floor(((atoms[serial].pos.x) - minX)/2);
                    let indeY = Math.floor(((atoms[serial].pos.y) - minY)/2);
                    let indeZ = Math.floor(((atoms[serial].pos.z) - minZ)/2);
                    
                    if( cont[indeX][indeY][indeZ] == undefined)
                        cont[indeX][indeY][indeZ] = new Array();

                    cont[indeX][indeY][indeZ].push(atoms[serial]);	
                });


                //CALCOLO COLLEGAMENTI
                let cache = COLOR.CovalentRadius; 
                    for(var i=0; i<nVectX; i++)
                        for(var j=0; j<nVectY; j++)
                            for(var k=0; k<nVectZ; k++){
                                if(!cont[i][j][k]) continue;

                                var original_length = cont[i][j][k].length;
                                for(var l=0; l<original_length;	l++){

                                    var atom = cont[i][j][k].pop();

                                    var iXs = (i -1 < 0)? 0 : i -1;
                                    var iYs = (j -1 < 0)? 0 : j -1;
                                    var iZs = (k -1 < 0)? 0 : k -1;


                                    for(var iXs2 = iXs; (iXs2 < i+2) && (iXs2 < nVectX);  iXs2++ )
                                        for(var iYs2 = iYs ; (iYs2 < j+2) && (iYs2 < nVectY);  iYs2++ )
                                            for(var iZs2 = iZs ; (iZs2 < k+2) && (iZs2 < nVectZ);  iZs2++ ){

                                                if(!cont[iXs2][iYs2][iZs2]) continue;

                                                cont[iXs2][iYs2][iZs2].forEach((other) =>{
                                                    var dist = calcola_Distanza(atom, other);	
                                                    var raggio1 = cache[atom.elem];               //potrebbe non esserci il covalent radius del seguente atomo
                                                    var raggio2 = cache[other.elem];

                                                    if(raggio1+raggio2 + TOLLERANZA > dist){
                                                        if (type == 'ligands')
                                                            LigandBonds.push({atom1: atom, atom2: other })
                                                        else 
                                                            AtomBonds.push({atom1: atom, atom2: other });}
                                                });
                                            }
                                }
                            }

                    cont.splice(0,cont.length);
        }
    
        if (Helix.length > 0) Helix.sort(compareSheetHelix);
        if (Sheet.length > 0) {
            Sheet.sort(compareSheetHelix); 
            setSheet(Sheet.filter(checkDuplicates));  
        }
        //if ( !isInOrder ) OrderedBackbone.sort();
        console.log("Chain found : " + ter);
        if ( Atomi.length > 0)
            mediana.divideScalar(Object.keys(Atomi).length);
        else 
            mediana.divideScalar(Object.keys(Ligands).length);
        if(  Object.keys(Atomi).length )
            covalentBonds( Atomi, 'atoms' );
        if ( !updated ){//PDB has no atom info
            document.getElementById("sidebar-header").innerHTML = proteinName;
            setPDBinfo( proteinName );    
        }
        
        if(  Object.keys(Ligands).length )
            covalentBonds( Ligands, 'ligands' );
        //add missing atoms to Loop
        // let h = 0, s = 0, found1 = false, found2 = false;
        // for ( let l in Loop ){
        //     found1 = false; found2 = false;
        //     while( !(found1 && found2) ){
        //         if ( Helix[h] ){
        //             if ( Loop[l].atoms[0].resSeq == Helix[h].end+1 && Loop[l].atoms[0].chainId == Helix[h].endChainId ){
        //                 //il primo atomo di un loop è l'ultimo del ribbon prima
        //                 Loop[l].atoms.unshift(Helix[h].atoms[Helix[h].atoms.length-1]);
        //                 Loop[l].positions.unshift(Helix[h].positions[Helix[h].positions.length-1]);
        //                 Loop[l].colors.unshift(Helix[h].colors[Helix[h].colors.length-1]);
        //                 found1 = true;
        //                 if ( l == Loop.length-1 ) found2 = true;
        //             } else if ( Loop[l].atoms[Loop[l].atoms.length-1].resSeq == Helix[h].start-1 &&  Loop[l].atoms[Loop[l].atoms.length-1].chainId == Helix[h].startChainId){
        //                 //l'ultimo atomo di un loop è il primo del ribbon dopo   
        //                 Loop[l].atoms.push(Helix[h].atoms[0]);
        //                 Loop[l].positions.push(Helix[h].positions[0]);
        //                 Loop[l].atoms.push(Helix[h].colors[0]);
        //                 found2 = true;
        //                 if (l == 0) found1 = true;
        //             }
        //             if ( Loop[l].atoms[0].resSeq >= Helix[h].end && Loop[l].atoms[0].chainId == Helix[h].startChainId)
        //                 h++; 

        //         }
        //         if ( Sheet[s] ){
        //             if ( Loop[l].atoms[0].resSeq == Sheet[s].end+1 && Loop[l].atoms[0].chainId == Sheet[s].endChainId ){
        //                 //il primo atomo di un loop è l'ultimo del ribbon prima
        //                 Loop[l].atoms.unshift(Sheet[s].atoms[Sheet[s].atoms.length-1]);
        //                 Loop[l].positions.unshift(Sheet[s].positions[Sheet[s].positions.length-1]);
        //                 Loop[l].colors.unshift(Sheet[s].colors[Sheet[s].colors.length-1]);
        //                 found1 = true;
        //                 if ( l == Loop.length-1 ) found2 = true;
        //             } else if ( Loop[l].atoms[Loop[l].atoms.length-1].resSeq == Sheet[s].start-1 &&  Loop[l].atoms[Loop[l].atoms.length-1].chainId == Sheet[s].startChainId){
        //                 //l'ultimo atomo di un loop è il primo del ribbon dopo   
        //                 Loop[l].atoms.push(Sheet[s].atoms[0]);
        //                 Loop[l].positions.push(Sheet[s].positions[0]);
        //                 Loop[l].colors.push(Sheet[s].colors[0]);
        //                 found2 = true;
        //                 if (l == 0) found1 = true;
        //             }
        //             if ( Loop[l].atoms[0].resSeq >= Sheet[s].end && Loop[l].atoms[0].chainId == Sheet[s].startChainId )
        //                 s++;
        //         }
        //     }
        // }
        
        // //add missing loops between ribbons
        // for ( let h in Helix ){
            
        //     for ( let s in Sheet ){
        //         if ( Helix[])    
        //     }
        // }
        
        
       
    } catch( all ) {  
        console.log("Parsing error: " + all.message );
    //    alert("Parsing error: " + all.message );
        return false;
    }

    
    //fill information modal
    $("#infomodalbody").html("<strong>Residue Sequence:</strong><br><br>");
    for ( let chain in chains ){
        $("#infomodalbody").append("Chain "+chain+": "+residueSequence[chain].join(" ")+"<br><br>");
    }
    let rescount, flag = false, counter = 1;;
    if ( Atomi.length > 0 ){
        while( !flag ){
            if ( (rescount = Atomi[Object.keys(Atomi)[Object.keys(Atomi).length-counter]].resSeq) != undefined )
                flag = true; 
            else  
                counter++;
        }
    }
    
    //$("#infomodalbody").append("<strong>Residue count:</strong> "+resCount+"<br>");
    $("#infomodalbody").append("<strong>Residue count:</strong> "+rescount+"<br>");//at pos Atomi.length-1 there is a TER
    $("#infomodalbody").append("<strong>Chains:</strong> "+ter+"<br>");
    //count atoms without "ter"
    $("#infomodalbody").append("<strong>Atoms:</strong> "+(Object.keys(Atomi).length-ter)+"<br>");
    $("#infomodalbody").append("<strong>Ligands:</strong> "+Object.keys(Ligands).length+"<br>");
    $("#infomodalbody").append("<strong>Water molecules:</strong> "+Solvents.length+"<br>");
    $("#infomodalbody").append("<strong>Resolution:</strong> "+ resolution+"<br>" );                   
    
    $("#loading_parsing").html("Parsing: DONE");
    
    renderizza();
    return true;
}*/

    
////////////////////////////////////////////////////////
// PARSING NON-COVALENT BONDS XML FILE
////////////////////////////////////////////////////////

export function parseXmlBonds( text ){
        
    var cHBOND = 0, cVDW = 0, cIONIC = 0, cPIPISTACK = 0,cSBOND = 0;;
    var xml, parser;
    var temp_nodes = [];
        if (window.DOMParser) {
          // code for modern browsers
            parser = new DOMParser();
            xml = parser.parseFromString(text,"text/xml");
        } else {
          // code for old IE browsers
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = false;
            xml.loadXML(text);
        }
    
        try {
            //parse nodes
            var xmlnodes = xml.getElementsByTagName( "node" );
            for (let i = 0; i < xmlnodes.length; i++ ) {
                //var data = xmlnodes[i].getElementsByTagName( "data");

                //v_Degree
                //var degree = parseInt( data[2].childNodes[0].data );
                
                //v_nodeID
                //var nodeID = data[4].childNodes[0].data;
                var nodeID = xmlnodes[i].querySelector("data[key=v_NodeId]").innerHTML

                //remove the third field of node_id
                //nodeID = nodeID.replace(/^(.*:)(.*:)(.*:)(.*)$/,'$1$2$4');
                
                //Attributi extra per nodi della RIN
                var res = xmlnodes[i].querySelector("data[key=v_Name]").innerHTML;
                var deg = parseInt( xmlnodes[i].querySelector("data[key=v_Degree]").innerHTML);
                var ch = xmlnodes[i].querySelector("data[key=v_Chain]").innerHTML;
                
                var col_res = paint_by_residue(res);
                var col_ch = paint_by_chain(ch);
                var col_deg = paint_by_degree(deg);
                var col_pol = paint_by_polarity(res);
                var nodeRIN = {
                    id : nodeID,
                    residue : res, 
                    degree : deg, 
                    chain : ch, 
                    col_res : col_res,
                    col_ch : col_ch, 
                    col_deg : col_deg,
                    col_pol : col_pol,
                };
                
                nodesRIN.push(nodeRIN);

                //creazione dati esportati per la creazione dei grafici
                res_count[res_to_i[res.toString()]]++;

            }

            //parse edges
            var xmledges = xml.getElementsByTagName( "edge" );
            var serial = 0;
            // http://protein.bio.unipd.it/ring/about
            for (let i = 0; i < xmledges.length; i++ ) {

                var data = xmledges[i].getElementsByTagName( "data");

                var distance;
                if (data[0].childNodes[0])
                    //distance = parseFloat( data[0].childNodes[0].data ); 
                    distance = parseFloat( xmledges[i].querySelector("data[key=e_Distance]").innerHTML ); 
                    //e_Distance
                
                var interaction
                 
                if (data[1].childNodes[0])
                    //interaction = data[1].childNodes[0].data;  //e_Interaction
                    interaction = xmledges[i].querySelector("data[key=e_Interaction]").innerHTML;  //e_Interaction
                
                var angle;
                if (data[2].childNodes[0])
                    //angle = parseFloat(data[2].childNodes[0].data); //e_Angle
                    angle = parseFloat(xmledges[i].querySelector("data[key=e_Angle]").innerHTML); //e_Angle
                
                var energy;
                if (data[5].childNodes[0])
                    //energy = data[5].childNodes[0].data; //e_Energy
                    energy = xmledges[i].querySelector("data[key=e_Energy]").innerHTML; //e_Energy

                var index = interaction.lastIndexOf(':');
                var intType, intExt;
                if ( index == -1 )
                    intType = interaction;
                else {
                    intExt = interaction.substring(index + 1); //MC_MC,SC_MC ecc
                    // subtypenode_subtypenode, where subtype = main chain (MC), side chain (SC) and ligand (LIG).
                    intType = interaction.substring(0,index); 

                    if(intType == 'HBOND'){
                        if(intExt == 'MC_MC'){
                            hbond_ext_count[0]++;
                        } else if(intExt  == 'SC_SC'){
                            hbond_ext_count[1]++;
                        } else if(intExt  == 'MC_SC'){
                            hbond_ext_count[2]++;
                        } else if(intExt  == 'SC_MC'){
                            hbond_ext_count[3]++;
                        }
                    }
                    
                if ( !intType || !interaction || !intExt ){
                    console.log("found!");
                }
                //HBOND, VWD ecc
                //RING-2.0 identifies 6 different type of interaction, plus a generic interaction (IAC) that simply indicates a generic contact based on a distance cutoff
                }

                switch( intType ){
                    case "HBOND":
                        cHBOND++;
                        break;
                    case "SBOND":
                        cSBOND++;
                        break;
                    case "VDW":
                        cVDW++;
                        break;
                    case "IONIC":
                        cIONIC++;
                        break;
                    case "PIPISTACK":
                        cPIPISTACK++;
                        break;
                }


                //Hydrogen bond (HBOND): color: #87cefa
                //Van der Waals interactions (VDW): color: #ffd700
                //Disulfide bridges (SBOND): color: #000000
                //Salt bridges (IONIC): color: #0000ff
                //π-π stacking (PIPISTACK): color: #ff0000
                //π-cation (PICATION): color: #9acd32
                //Inter-Atomic Contact (IAC) color: # dcdcdc

                //var atomName1 = data[6].childNodes[0].data; //e_Atom1         
                var atomName1 = xmledges[i].querySelector("data[key=e_Atom1]").innerHTML; //e_Atom1         
                //var atomName2 = data[7].childNodes[0].data; //e_Atom2
                var atomName2 = xmledges[i].querySelector("data[key=e_Atom2]").innerHTML; //e_Atom2
                //var color = COLOR.nonCovalentBonds[ intType ];

                // check if atomName1 and atomName2 contain coordinates
                var regex1 = atomName1.match( /^([-]?\d*\.\d*),([-]?\d*\.\d*),([-]?\d*\.\d*)$/);
                var regex2 = atomName2.match( /^([-]?\d*\.\d*),([-]?\d*\.\d*),([-]?\d*\.\d*)$/);

                var pos1 = undefined , pos2 = undefined; 
                if ( regex1 ){
                    let x = parseFloat(regex1[1]);
                    let y = parseFloat(regex1[2]);
                    let z = parseFloat(regex1[3]);
                    pos1 = new THREE.Vector3(x,y,z);
                }
                if ( regex2 ){
                    let x = parseFloat(regex2[1]);
                    let y = parseFloat(regex2[2]);
                    let z = parseFloat(regex2[3]);
                    pos2 = new THREE.Vector3(x,y,z);
                }

                //var nodeID2 = data[9].childNodes[0].data; //e_NodeId2
                var target = xmledges[i].querySelector("data[key=e_NodeId2]").innerHTML; //e_NodeId2
                //var nodeID1 = data[10].childNodes[0].data; //e_NodeId1
                var source = xmledges[i].querySelector("data[key=e_NodeId1]").innerHTML; //e_NodeId1

                //remove the third field of node_id
                var nodeID1 = source.replace(/^(.*:)(.*:)(.*:)(.*)$/,'$1$2$4');
                var nodeID2 = target.replace(/^(.*:)(.*:)(.*:)(.*)$/,'$1$2$4');


                var isLigand1 = false, isLigand2 = false;
                //var idxs1 = getAllIndexes( indexArray, nodeID1);
                //var idxs2 = getAllIndexes( indexArray, nodeID2);
                
                /*var idxs1 = indexArray[nodeID1];
                var idxs2 = indexArray[nodeID2];

                if ( idxs1.length == 0 ){
                    //idxs1 = getAllIndexes( LindexArray, nodeID1);
                    var idxs1 = LindexArray[nodeID1];
                    isLigand1 = true;
                }
                if ( idxs2.length == 0){
                    //idxs2 = getAllIndexes( LindexArray, nodeID2);
                    idxs2 = LindexArray[nodeID2];
                    isLigand2 = true;
                }

                var node1, node2, x, y, z, found = false, k = 0;
                var idx1, idx2;

                //questo non è corretto con 5kwo. Non è detto che il nodo si trovi in uno degli indici idxs1 perchè idxs1.len < temp_nodes.length
                //fai così, salva in indexArray anche x,y,z e poi, dopo aver preso tutti gli indici corrisponendti a un node id confronta le posizioni
                if ( idxs1.length > 0 && !pos1){

                    // while( !found && k < temp_nodes.length){ //non ha senso questo, idxs1 si rifersce agli indici degli atomi o ligandi
                    //     if ( nodeID1 == temp_nodes[k].nodeid ){
                    //         x = temp_nodes[k].x;
                    //         y = temp_nodes[k].y;
                    //         z = temp_nodes[k].z;
                    //         found = true;
                    //         idx1 = k;
                    //         //node index found
                    //     }
                    //     k++;
                    // }
                    // found = false; k = 0;

                    //now search for atom corresponding to that node
                    while( !found && k < idxs1.length){
                        if (isLigand1) node1 = Ligands[ idxs1[k]];
                        else node1 = Atomi[ idxs1[k] ];
                        if ( node1 == undefined){
                            console.log("undefined!")
                        }
                        if ( node1.name == atomName1 )
                            found = true;
                        k++;
                    }
                    if ( found ){
                        node1.nonCovBonds.push(intType);
                        nodes.push(node1);
                    }
                } 
                k = 0, found = false;

                if ( idxs2.length > 0 && !pos2){ // !pos2????
                    // while( !found && k < temp_nodes.length){
                    //     if ( nodeID2 == temp_nodes[k].nodeid ){
                    //         x = temp_nodes[k].x;
                    //         y = temp_nodes[k].y;
                    //         z = temp_nodes[k].z;
                    //         found = true;
                    //         idx2 = k;
                    //         //node index found
                    //     }
                    //     k++;
                    // }
                    // found = false; k = 0;
                    //now search for atom corresponding to that node
                    while( !found && k < idxs2.length ){
                        if (isLigand1) node2 = Ligands[idxs2[k]];
                        else node2 = Atomi[idxs2[k]];
                        if ( node2.name == atomName2)
                            found = true;
                        k++;
                    }
                    if ( found ){
                        node2.nonCovBonds.push(intType);
                        nodes.push(node2);
                    }
                }

                if ( !pos1 ) pos1 = node1.pos;
                if ( !pos2 ) pos2 = node2.pos;

                //angle is present only in HBOND and PIPISTACK?

                var edge = { distance : distance, energy: energy, angle: angle,interaction : intType, atom1 : atomName1, atom2 : atomName2, coord1 : pos1, coord2 : pos2, node1 : node1, node2: node2, serial : serial, color : color };
                edges.push(edge);*/
                
                //Attributi archi per la RIN
                var clr_type = paintLink_type(interaction);
                var clr_dist = paintLink_dist(interaction, distance,atomName1,atomName2);
                var cat = source.concat('#').concat(target);
                var flipcat = target.concat('#').concat(source);
                
                var edgeRIN = {
                    source : source,
                    target : target,
                    interaction : interaction,
                    distance : distance,
                    energy : energy,
                    color_type : clr_type,
                    color_dist : clr_dist,
                    color_uni : "#FA9664",
                    a1 : atomName1,
                    a2 : atomName2,
                    curvature : 0,
                    category : cat,
                    flipcategory : flipcat ,
                    position : i
                };
                 
                linksRIN.push(edgeRIN);
 
                //creazione dati esportati per la creazione dei grafici
                var energy_float = parseFloat(energy)
                if (interaction.includes(':')){
                    var extracted_bond = interaction.substr(0, interaction.indexOf(':')); //alcune interazioni nel file xml sono in formato tipo HBOND:MC_MC. Estraggo solo il tipo di legame
                    bond_count[bond_to_i[extracted_bond]]++;
                    avg_e_bond[bond_to_i[extracted_bond]] += energy_float;
                    avg_dist_bond[bond_to_i[extracted_bond]] += distance;
                }
                else{
                    bond_count[bond_to_i[interaction]]++; //altrimenti utilizzo la stringa così com'è
                    avg_e_bond[bond_to_i[interaction]] += energy_float;
                    avg_dist_bond[bond_to_i[interaction]] += distance;
                }
                
                serial++;   
                 
            }

            var total = 0;
            for(let i=0; i<hbond_ext_count.length; i++){
                total += hbond_ext_count[i];
            }

            for(let i=0; i<hbond_ext_count.length; i++){
                hbond_ext_count[i] = ((100 * hbond_ext_count[i]) / total).toFixed(2);
            }
            


            const roundAccurately = (number, decimalPlaces) => Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces)
            for (var i = 0; i < (bond_count.length); ++i){
                if (avg_e_bond[i] != 0)
                    avg_e_bond[i] = roundAccurately((avg_e_bond[i]/bond_count[i]),4)
                if (avg_dist_bond[i] != 0)
                    avg_dist_bond[i] = roundAccurately((avg_dist_bond[i]/bond_count[i]),4)
            }
            //raggruppiamo i legami in base a source e target
            

            for (var i = 0; i < linksRIN.length; ++i) {
                var category = linksRIN[i].category;
                var flipcategory = linksRIN[i].flipcategory
                if (!(category in map) && !(flipcategory in map)){
                    map[category] = []
                    map[category].push(linksRIN[i].position);
                }
                else if (!(category in map) && (flipcategory in map)){
                    map[flipcategory].push(linksRIN[i].position);
                }
                    else {
                        map[category].push(linksRIN[i].position);
                    }  
            }
            function isOdd(num) { return num % 2;}
            
            //Ora aggiorno la curvatura
            for (var i in map){ 
                if ((map[i].length) > 1){ //se si ha un solo bond tra quei du particolari amminoacidi non c'è bisogno di curvare l'unico arco
                    var ceiling = 0.3
                    if (isOdd(map[i].length)){
                        var half = ((map[i].length)-1)/2.0 //il -1 è solo in caso il numero degli archi sia dispari
                        var step = ceiling/half
                        var start = (step*half) *-1
                    }
                    else{
                        var half = (map[i].length)/2.0
                        var step = ceiling/half
                        var start = (step*half)*-1                             
                    }

                    for (var j=0; j<(map[i].length);j++){
                        if (linksRIN[map[i][j]].category != i){
                            start = start*(-1)
                            linksRIN[map[i][j]].curvature = start;
                            start = start+step;
                        }
                        else{
                            linksRIN[map[i][j]].curvature = start;
                            start = start+step;
                        }

                    }
                }
            }

        } catch( all ) {  
            console.log("Unexpected error while reading RIN: it seems that intermolecular bonds can not be calculated for this molecule " + all.message );
            //alert("Unexpected error while reading RIN: it seems that intermolecular bonds can not be calculated for this molecule.");
            return false;
        }
    
        /*$("#infomodalbody").append("<br><strong>RIN information:</strong><br> ");
        $("#infomodalbody").append("<br><strong>RIN nodes:</strong> "+nodes.length);
        $("#infomodalbody").append("<br><strong>RIN edges:</strong> "+edges.length);
        $("#infomodalbody").append("<br><strong>HBOND edges:</strong> "+cHBOND);
        $("#infomodalbody").append("<br><strong>SBOND edges:</strong> "+cSBOND);
        $("#infomodalbody").append("<br><strong>IONIC edges:</strong> "+cIONIC);
        $("#infomodalbody").append("<br><strong>VDW edges:</strong> "+cVDW);
        $("#infomodalbody").append("<br><strong>PIPISTACK edges:</strong> "+cPIPISTACK);
    
        renderNonCovBonds();*/
        console.log(res_count)
        return true;
}