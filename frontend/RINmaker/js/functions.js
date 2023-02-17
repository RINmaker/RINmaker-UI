

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

$('#loading').hide();

async function redirectXML(e) {
	
	form=document.getElementById("form1");
	if(emptyField() && isNumber() && isUnsignedInteger() && checkAngle()){
		$('#loading').show();
		$('#download').hide();
		
		var params = {};
		if(document.getElementById('customFile').value !== ""){
			await upload(e);
		}
		argBuilder(params);
		eraseCookie('params2D');
		//setCookie('params2D', JSON.stringify(params),1);
		//window.open('index2D.html','_self');
		const regexpPDB = /^[\w\-_\s]+.pdb$/;

		var url;
		var pdbname = params.pdbname;
		var urlFromContent = "https://ring.dais.unive.it:8002/api/requestxml/fromcontent";
		var urlFromName = "https://ring.dais.unive.it:8002/api/requestxml/fromname";

		if(!params.pdbname.match(regexpPDB)){
			params.pdbname = params.pdbname + '.pdb';
			pdbname = params.pdbname;
		}

		if(params.hasOwnProperty('fromname')){
			url = urlFromName;
			delete params.fromname;
		}else if(params.hasOwnProperty('fromcontent')){
			url = urlFromContent;
			params.content = localStorage.getItem('content');
			delete params.fromcontent;
		}

		$.ajax({
			type: "POST",
			url: url,
			data: params,
			async: 'false',
			success: function(res) {
				$('#loading').hide();
				$('#download').show();
				var log = res.data.log;
				var xml =  res.data.xml;
				document.getElementById("downloadXml").style.display = "block";
				document.getElementById("success").style.display= "block";
				
				document.getElementById("log").innerHTML = "Log: " + pdbname;
				document.getElementById("log-info").innerHTML = log;

				
				var element = document.getElementById("downloadXml");
				var new_element = element.cloneNode(true);
				element.parentNode.replaceChild(new_element, element);
				new_element.addEventListener("click", function(){
					download(pdbname.slice(0, -4) + ".xml", xml);
				}, false);


			},
			error: function(xhr, status, error){
				$('#loading').hide();
				$('#download').show();
				if(xhr.responseJSON.response === "error"){
					if(xhr.responseJSON.error.code === 404){
						document.getElementById("not-exist").style.display= "block";
						document.getElementById("log").innerHTML = "Log: " + pdbname;
						document.getElementById("log-info").innerHTML = "Not Found";
					}else if(xhr.responseJSON.error.code == 400){
						document.getElementById("bad-request").style.display= "block";
						document.getElementById("log").innerHTML = "Log: " + pdbname;
						document.getElementById("log-info").innerHTML = "Bad Request";
					}else if(xhr.responseJSON.error.code == 500){
						document.getElementById("int-err").style.display= "block";
						document.getElementById("log").innerHTML = "Log: " + pdbname;
						document.getElementById("log-info").innerHTML = "Internal Error";
					}  
					
				}    
			}
		});
	}
}



function load(){
	$('#download').hide();
	$('#loading').html(`
		<button class="btn btn-primary" type="button" disabled>
  			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
			  Loading...
			</button>
	`);
}


function redirect2d(e){
	if(emptyField() && isNumber() && isUnsignedInteger() && checkAngle()){
		var params = {};
		if(document.getElementById('customFile').value !== ""){
			upload(e);
		}
		argBuilder(params);
		eraseCookie('params2D');
		setCookie('params2D', JSON.stringify(params),1);
		window.open('index2D.html','_self');
	}
}

function redirect3d(e){
	if(emptyField() && isNumber() && isUnsignedInteger() && checkAngle()){
		var params = {};  
		if(document.getElementById('customFile').value !== ""){
			upload(e);
		}
		argBuilder(params);
		eraseCookie('params3D');
		setCookie('params3D', JSON.stringify(params),1);
		window.open('index3D.html','_self');
	}
}

function redirect3dFrom2d(e){
	var params = getCookie('params2D');
	eraseCookie('params3D');
	setCookie('params3D', params, 1);
	window.open('index3D.html','_self');
}

function redirect2dFrom3d(e){
	var params = getCookie('params3D');
	eraseCookie('params2D');
	setCookie('params2D', params, 1);
	window.open('index2D.html','_self');
}


function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function emptyField(){
	if(document.getElementById("customFile").value === "" && document.getElementById("pdbid").value === "") {
		alert("Please load or insert a .pdb file");
		return false;
	}else{
		return true;
	}
}

function isUnsignedInteger(){
	if(document.getElementById("seq-sep-checkbox").checked) {
		
		var strNum = document.getElementById("seq-sep-num").value;
		var val = 3;
		var max = 20;
		strNum = strNum.trim();
    		if(!strNum) {
    			alert("Please enter an unsigned int in --seq-sep field");
        		return false;
    		}
    		strNum = strNum.replace(/^0+/, "") || "0";
    		var n = Math.floor(Number(strNum));
    		if(!(String(n) === strNum && n >= 0)){
    			alert("Please enter an unsigned int in --seq-sep field");
    			return false;
    		}
    		if(n < val || n > max){
    			alert("Please enter a numeric value in --seq-sep field greater than " + val + " and less than " + max);
    			return false;
		}
		return true;
	}else{
		return true
	}
}

function isNumber(){
	var checkboxId = ["h-bond-checkbox","vdw-bond-checkbox","ionic-bond-checkbox","generic-bond-checkbox","pication-bond-checkbox","pipistack-bond-checkbox"];
	var numId = ["h-bond-num","vdw-bond-num","ionic-bond-num","generic-bond-num","pication-bond-num","pipistack-bond-num"];
	var val = [3.5,0.5,4,6,5,6.5];
	var max = 20;
	var i=0;

	for(i;i<6;i++){

		if(document.getElementById(checkboxId[i]).checked) {
			
			var strNum = document.getElementById(numId[i]).value;
			strNum = strNum.trim();
	    	if(!strNum) {
	    		alert("Please enter a numeric value (float, double, int) in --".concat('',numId[i].replace("-num","").concat(" ","field")));
	        	return false;
	    	}
	    	strNum = Number(strNum);
	    	if(isNaN(strNum)){
	    		alert("Please enter a numeric value (float, double, int) in --".concat('',numId[i].replace("-num","").concat(" ","field")));
	    		return false;
	    	}
	    	if(strNum < val[i] || strNum > max){
	    		alert("Please enter a numeric value in " + numId[i].replace("-num","").concat(" ","field") + " greater than " + val[i] + " and less than " + max);
	    		return false;
	    	}
		}
	}
	return true;
}

function checkAngle(){
	var checkboxId = ["h-bond-angle-checkbox","pication-angle-checkbox","pipistack-normal-normal-checkbox","pipistack-normal-centre-checkbox"];
	var numId = ["h-bond-angle-num","pication-angle-num","pipistack-normal-normal-num","pipistack-normal-centre-num"];
	var val = [63,45,90,90];

	var i=0;

	for(i;i<4;i++){

		if(document.getElementById(checkboxId[i]).checked) {
			
			var strNum = document.getElementById(numId[i]).value;
			strNum = strNum.trim();
	    	if(!strNum) {
	    		alert("Please enter a numeric value in --".concat('',numId[i].replace("-num","").concat(" ","field")));
	        	return false;
	    	}
	    	strNum = Number(strNum);
	    	if(isNaN(strNum)){
	    		alert("Please enter a numeric value in --".concat('',numId[i].replace("-num","").concat(" ","field")));
	    		return false;
	    	}
	    }
	}
	return true;
}
