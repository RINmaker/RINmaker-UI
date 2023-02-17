function argBuilder(params){
	if(document.getElementById("pdbid").value !== ""){
		params.pdbname = document.getElementById("pdbid").value;
		params.fromname = true;
	}

	if(document.getElementById("customFile").value !== ""){
		var name = document.getElementById("customFile").value;
		params.pdbname = name.replace("C:\\fakepath\\","");
		params.fromcontent = true;
	}

	if(document.getElementById("seq-sep-checkbox").checked){
		params.seq_sep = document.getElementById("seq-sep-num").value;
	}

	params.bond_control = document.getElementById("bond-control").value;
	params.interaction_type = document.getElementById("interaction-type").value;
	params.net_policy = document.getElementById("net-policy").value;

	if(document.getElementById("h-bond-checkbox").checked){
		params.h_bond = document.getElementById("h-bond-num").value;
	}

	if(document.getElementById("vdw-bond-checkbox").checked){
		params.vdw_bond = document.getElementById("vdw-bond-num").value;
	}

	if(document.getElementById("ionic-bond-checkbox").checked){
		params.ionic_bond = document.getElementById("ionic-bond-num").value;
	}

	if(document.getElementById("generic-bond-checkbox").checked){
		params.generic_bond = document.getElementById("generic-bond-num").value;
	}

	if(document.getElementById("pication-bond-checkbox").checked){
		params.pication_bond = document.getElementById("pication-bond-num").value;
	}

	if(document.getElementById("pipistack-bond-checkbox").checked){
		params.pipistack_bond = document.getElementById("pipistack-bond-num").value;
	}

	if(document.getElementById("h-bond-angle-checkbox").checked){
		params.h_bond_angle = document.getElementById("h-bond-angle-num").value;
	}

	if(document.getElementById("pication-angle-checkbox").checked){
		params.pication_angle = document.getElementById("pication-angle-num").value;
	}

	if(document.getElementById("pipistack-normal-normal-checkbox").checked){
		params.pipistack_normal_normal = document.getElementById("pipistack-normal-normal-num").value;
	}

	if(document.getElementById("pipistack-normal-centre-checkbox").checked){
		params.pipistack_normal_centre = document.getElementById("pipistack-normal-centre-num").value;
	}
}

function upload(e){
	var files = document.getElementById("customFile").files[0];

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent){
		var textFromFileLoaded = fileLoadedEvent.target.result;
		localStorage.removeItem('content');
		localStorage.setItem('content',textFromFileLoaded);
	};

	fileReader.readAsText(files, "UTF-8");
}

