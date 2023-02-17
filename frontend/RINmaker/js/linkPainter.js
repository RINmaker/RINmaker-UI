import { Atom_Radii as radiusAlvarez } from "./AtomRadius.js";

let IONICdistanceColors = {
    0.1 : "#7575ff",
    0.2 : "#5b5bff",
    0.3 : "#4141ff",
    0.4 : "#2727ff",
    0.5 : "#0d0dff",
    0.6 : "#0000ef",
    0.7 : "#0000ce",
    0.8 : "#0000ad",
    0.9 : "#00008c",
    1.0 : "#00006b"   
}

let HBONDdistanceColors = {
    0.1 : "#ffffff",
    0.2 : "#e4f4fe",
    0.3 : "#cae9fd",
    0.4 : "#afdefc",
    0.5 : "#94d3fb",
    0.6 : "#7fc2ec",
    0.7 : "#6faacf",
    0.8 : "#5e92b2",
    0.9 : "#4e7a95",
    1.0 : "#3e6278"   
}

let VDWdistanceColors = {
    0.1 : "#ffed8f",
    0.2 : "#ffe86f",
    0.3 : "#ffe34f",
    0.4 : "#ffde30",
    0.5 : "#ffd910",
    0.6 : "#f1cb00",
    0.7 : "#d5b301",
    0.8 : "#b89c02",
    0.9 : "#9c8402",
    1.0 : "#806c03"   
}

function get_element_vdwradius(atom){
    var one_letter_atom = atom.substring(0,1)
    var two_letters_atom = atom.substring(0,2)
    
    var res = radiusAlvarez[two_letters_atom]
    if (res === undefined){
        var res = radiusAlvarez[one_letter_atom]
    }
    return res
}

function paintLink_type(interaction_type){
    if ((interaction_type).includes('IONIC')){
        return "#0000ff";
    }
    if ((interaction_type).includes('HBOND')){
        return "#87cefa";
    }
    if ((interaction_type).includes('VDW')){
        return "#ffd700";
    }
    if ((interaction_type).includes('SSBOND')){
        return "#9C31F9"
    }
    if ((interaction_type).includes('PIPISTACK')){
        return "#ff0000"
    }
    if ((interaction_type).includes('PICATION')){
        return "#9acd32"
    }
    if ((interaction_type).includes('IAC')){
        return "#dcdcdc"
    }
    else{
        //NOBOND
        return "#F5DEB3" 
    }
}

const roundAccurately = (number, decimalPlaces) => Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces)
function paintLink_dist( interaction_type, dist,atom1,atom2){
    if ((interaction_type).includes('IONIC')){
        var normalize = dist/4.0
        return IONICdistanceColors[roundAccurately(normalize, 1)];
    }
    if ((interaction_type).includes('HBOND')){

        var normalize = dist/3.5
        return HBONDdistanceColors[roundAccurately(normalize, 1)];

    }
    if ((interaction_type).includes('VDW')){
        var r_a1 = get_element_vdwradius(atom1);
        var r_a2 = get_element_vdwradius(atom2);
        var normalize = (dist - (r_a1+r_a2))/0.5
        //return VDWdistanceColors[roundAccurately(normalize,1)]
        return "#ffed8f" //provvisoriamente ritorno il primo valore della scala finchè il problema delle distanze negative non viene risolto
    }
    if ((interaction_type).includes('SSBOND')){
        return "#9C31F9"
    }
    if ((interaction_type).includes('PIPISTACK')){
        return "#ff0000"
    }
    if ((interaction_type).includes('PICATION')){
        return "#9acd32"
    }
    if ((interaction_type).includes('IAC')){
        return "#dcdcdc"
    }

    else{
        //NOBOND
        return "#F5DEB3" 
    }
}

export { IONICdistanceColors, HBONDdistanceColors, VDWdistanceColors, paintLink_type ,paintLink_dist };