var res_list = ["ARG","LYS","ASN","GLN","HIS","CYS","ILE","LEU","MET","PHE","PRO","TRP","TYR","VAL","ALA","GLY","SER","THR","ASP","GLU"];

var bond_list = ['IONIC','HBOND',"VDW","SSBOND","PIPISTACK","PICATION","IAC"];
let res_to_i = {}
let bond_to_i = {}
var i = 0;
for (var current_residue = 0 ; current_residue < (res_list.length); current_residue++){
    res_to_i[res_list[current_residue]] = i;
    i++;
}
i = 0;
for (var current_bond = 0 ; current_bond < (bond_list.length); current_bond++){
    bond_to_i[bond_list[current_bond]] = i;
    i++;
}

export {res_to_i,bond_to_i}