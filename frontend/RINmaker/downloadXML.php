<?php

session_start();

require_once 'checkForm.php';

$status = [
    'error' => false,
    'message' => $errMessage = [
    	'uploadFile' => false,
        'seq-sep' => false,
        'bond-control' => false,
        'interaction-type' => false,
        'net-policy' => false,
        'h-bond' => false,
        'vdw-bond' => false,
        'ionic-bond' => false,
        'generic-bond' => false,
        'pication-bond' => false,
        'pipistack-bond' => false,
        'h-bond-angle' 	=> false,
		'pication-angle' => false,
		'pipistack-normal-normal' => false,
		'pipistack-normal-centre' => false
    ],
];

$params = (object)[];

$requestFlag = 0;

form($status,$params,$requestFlag);

$header = "Location: ../RINmaker/index.php";

if($status['error']){
	if($status['message']['uploadFile']){
		$header .= "?err-send=true";
	}
	if($status['message']['seq-sep']){
		$header .= "?err-seq-sep=true";
	}
	if($status['message']['bond-control']){
		$header .= "?err-bond-type=true";
	}
	if($status['message']['interaction-type']){
		$header .= "?err-inter-type=true";
	}
	if($status['message']['net-policy']){
		$header .= "?err-net-policy=true";
	}
	if($status['message']['h-bond']){
		$header .= "?err-vdw-bond=true";
	}
	if($status['message']['ionic-bond']){
		$header .= "?err-ionic-bond=true";
	}
	if($status['message']['generic-bond']){
		$header .= "?err-generic-bond=true";
	}
	if($status['message']['pication-bond']){
		$header .= "?err-pication-bond=true";
	}
	if($status['message']['pication-bond']){
		$header .= "?err-pication-bond=true";
	}
	if($status['message']['pipistack-bond']){
		$header .= "?err-pistack-bond=true";
	}
	if($status['message']['h-bond-angle']){
		$header .= "?err-h-bond-angle=true";
	}
	if($status['message']['pication-angle']){
		$header .= "?err-pication-angle=true";
	}
	if($status['message']['pipistack-normal-normal']){
		$header .= "?err-pipistack-normal-normal=true";
	}
	if($status['message']['pipistack-normal-centre']){
		$header .= "?err-pipistack-normal-centre=true";
	}

	header($header);
	return;
}

$ENDPOINT = 'https://ring.dais.unive.it:8002';

$urlFromName = $ENDPOINT + '/api/requestxml/fromname';
$urlFromContent = $ENDPOINT + '/api/requestxml/fromcontent';

if($requestFlag === 1){

	$fields_string = http_build_query($params);

	$ch = curl_init();

	curl_setopt($ch,CURLOPT_URL, $urlFromName);
	curl_setopt($ch,CURLOPT_POST, true);
	curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);

	$result = curl_exec($ch);
	$getResponse = json_decode($result);

	$log = urlencode($getResponse->data->log);

	if($getResponse->response === 'success'){
		$sessionId = $_SESSION['sessIdUser'];
		$file = $params->pdbname.'.'.$sessionId.'.xml';
		$dirFile = $_SERVER['DOCUMENT_ROOT'].'/RINmaker/files/'.$file;
		$txt = fopen($dirFile, "w") or die("Unable to open file!");
		fwrite($txt, $getResponse->data->xml);
		fclose($txt);

		header("Location: ../RINmaker/index.php?msg-log=$log&msg-succ=true&filename=$file");

	}else if($getResponse->response === 'error'){
		if($getResponse->error->code == 404){
			header($header.'?err-not-found=true');
			return;
		}else if($getResponse->error->code == 500){
			header($header.'?err-int-err=true');
			return;
		}else if($getResponse->error->code == 400){
			header($header.'?err-bad-request=true');
			return;
		}
	}

}else if($requestFlag === 0){

	$fields_string = http_build_query($params);

	$ch = curl_init();

	curl_setopt($ch,CURLOPT_URL, $urlFromContent);
	curl_setopt($ch,CURLOPT_POST, true);
	curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);

	$result = curl_exec($ch);

	$getResponse = json_decode($result);
	$log = urlencode($getResponse->data->log);

	if($getResponse->response === 'success'){
		$sessionId = $_SESSION['sessIdUser'];
		$file = $params->pdbname.'.'.$sessionId.'.xml';
		$dirFile = $_SERVER['DOCUMENT_ROOT'].'/RINmaker/files/'.$file;
		$txt = fopen($dirFile, "w") or die("Unable to open file!");
		fwrite($txt, $getResponse->data->xml);
		fclose($txt);

		header("Location: ../RINmaker/index.php?msg-log=$log&msg-succ=true&filename=$file");

	}else if($getResponse->response === 'error'){
		if($getResponse->error->code == 500){
			header($header.'?err-int-err=true');
			return;
		}else if($getResponse->error->code == 400){
			header($header.'?err-bad-request=true');
			return;
		}
	}
}

?>
