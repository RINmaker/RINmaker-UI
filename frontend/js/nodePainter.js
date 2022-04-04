let DegreeGradient = {
    0.0 : "#2ec448",
    0.1 : "#2ec448",
    0.2 : "#5eb721",
    0.3 : "#79a900",
    0.4 : "#8e9b00",
    0.5 : "#9f8b00",
    0.6 : "#ad7a00",
    0.7 : "#b76800",
    0.8 : "#bf5400",
    0.9 : "#c33d0a",
    1.0 : "#c32222"   
}

function paint_by_residue(residue){
    
    if (residue == "ARG" || residue == "LYS"){
        return "#0000ff"
    }
    if (residue == "ASN" || residue == "GLN" || residue == "HIS"){
        return "#ff00ff"
    }
    if (residue == "CYS" || residue == "ILE" || residue == "LEU" || residue == "MET" || residue == "PHE" || residue == "PRO" || residue == "TRP" ||
        residue == "TYR" || residue == "VAL"){
        return "#008000"
    }
    if (residue == "ALA" || residue == "GLY" || residue == "SER" || residue == "THR"){
        return "#ffa500"
    }
    if (residue == "ASP" || residue == "GLU" ){
        return "#ff0000"
    }
    else{
        //LIG
        return "#808080"
    }
}

function paint_by_chain(chain){
    console.log(chain);
    if (chain == "A"){
        return "#1f77b4"
    }
    if (chain == "B"){
        return "#ff7f0e"
    }
    if (chain == "C"){
        return "#2ca02c"
    }
    if (chain == "D"){
        return "#d62728"
    }
    if (chain == "E"){
        return "#b594cd"
    }
    if (chain == "F"){
        return "#8c564b"
    }
    if (chain == "G"){
        return "#e377c2"
    }
    else{
        //Error
        console.log("Wrong value for the param chain: value read: ",chain);
    }
}

const roundAccurately = (number, decimalPlaces) => Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);
function paint_by_degree(degree){
    var normalize = degree/30;
    return DegreeGradient[roundAccurately(normalize,1)] 
}

function paint_by_polarity(residue){
    if (['ALA', 'PHE', 'GLY', 'PRO', 'ILE', 'TRP', 'LEU', 'VAL', 'MET'].includes(residue)){
        return '#00BFFF'
    }
    else{
        return '#808080'
    }
}

export{paint_by_residue, paint_by_chain, paint_by_degree, paint_by_polarity};