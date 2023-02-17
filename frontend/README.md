# RINmakerUI_new


## About RINmaker

RINmaker is a software tool that receives in input a protein structure (in pdb or mmCIF format) and creates the corresponding RIN (Residue Interaction Network) where nodes are amino acids and edges represent the non-covalent interactions.

## Usage

The RINmaker Home page contains two main sections:

- **Input section**: it allows for choosing between loading a .pdb file from the local computer or for entering the PDB databank identifier;
- **Options section**: it allows for specifying the input parameters (see the complete list below)

Once the input file and parameter have been specified it is possible to choose among the following three options:

- **Generate XML**: the input pdb file is passed to the RINmaker executable that will produce the corresponding RIN as an xml file, which can be downloaded. The log information will be also shown.
- **2D RIN**: the input pdb file is passed to the RINmaker executable that will produce a 2-dimensional graph representing the RIN of the input pdb file.
- **3D RIN**: the input pdb file is passed to the RINmaker executable that will produce a 3-dimensional graph representing the RIN of the input pdb file.

#### Made with react.js
