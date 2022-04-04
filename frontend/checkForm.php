<?php

function form(&$status,&$params,&$requestFlag){
    $max = 20;
    $paramsVal = [
        "seq-sep" => 3,
        "h-bond" => 3.5,
        "vdw-bond" => 0.5,
        "ionic-bond" => 4,
        "generic-bond" => 6,
        "pication-bond" => 5,
        "pipistack-bond" => 6.5,
        "h-bond-angle" => 63,
        "pication-angle" => 45,
        "pipistack-normal-normal" => 90,
        "pipistack-normal-centre" => 90
    ];

    if(isset($_POST['download'])){
        if(isset($_POST['pdbid']) && trim($_POST['pdbid']) != ''){
	    if(!preg_match('/^.*\.(pdb)$/i', $_POST['pdbid'])){
	    	$params->pdbname = $_POST['pdbid'] . '.pdb';
	    }else{
            	$params->pdbname = $_POST['pdbid'];
	    }
            $requestFlag = 1;
        }else{
            $requestFlag = 0;
            $fileName = $_FILES['customFile']['name'];
            $errorCode = $_FILES['customFile']['error'];
            $fileType = strtolower(pathinfo(basename($fileName),PATHINFO_EXTENSION));
            if($errorCode === UPLOAD_ERR_NO_FILE){
                $status['error'] = true;
                $status['message']['uploadFile'] = true;
                return;
            }

            if($fileType != "pdb") {
                $status['error'] = true;
                $status['message']['uploadFile'] = true;
                return;
            }

            $params->pdbname = $fileName;
            $params->content = file_get_contents($_FILES['customFile']['tmp_name']);
        }

        #check if --seq-sep value is a unsigned int and add it in params
        if(isset($_POST['seq-sep-checkbox'])){
            $temp = $_POST['seq-sep-num'];
            if(ctype_digit(trim($temp," ")) && $temp >= $paramsVal['seq-sep'] && $temp <= $max){
                $params->seq_sep = $temp;
            }else{
                $status['error'] = true;
                $status['message']['seq-sep'] = true;
            }
        }

        #check if --bond-control has been assigned a value
        if(filter_has_var(INPUT_POST, 'bond-control')){
            $allowedValues = ["strict","weak"];
            if(in_array($_POST['bond-control'], $allowedValues)){
                $params->bond_control = $_POST['bond-control'];
            }
        }else{
            $status['error'] = true;
            $status['massage']['bond-control'] = true;
        }

        #check if --interaction-type has been assigned a value
        if(filter_has_var(INPUT_POST, 'interaction-type')){
            $allowedValues = ["all","multiple","one"];
            if(in_array($_POST['interaction-type'], $allowedValues)){
                $params->interaction_type = $_POST['interaction-type'];
            }
        }else{
            $status['error'] = true;
            $status['massage']['interaction-type'] = true;
        }

        #check if --net-policy has been assigned a value
        if(filter_has_var(INPUT_POST, 'net-policy')){
            $allowedValues = ["closest","Ca","Cb"];
            if(in_array($_POST['net-policy'], $allowedValues)){
                $params->net_policy = $_POST['net-policy'];
            }
        }else{
            $status['error'] = true;
            $status['massage']['net-policy'] = true;
        }

        #check if --h-bond value is a float
        if(isset($_POST['h-bond-checkbox'])){
            $temp = $_POST['h-bond-num'];
            if(is_numeric($temp) && $temp >= $paramsVal['h-bond'] && $temp <= $max){
                $params->h_bond = $temp;
            }else{
                $status['error'] = true;
                $status['message']['h-bond value'] = true;
            }
        }

        #check if --vdw-bond value is a float
        if(isset($_POST['vdw-bond-checkbox'])){
            $temp = $_POST['vdw-bond-num'];
            if(is_numeric($temp) && $temp >= $paramsVal['vdw-bond'] && $temp <= $max){
                $params->vdw_bond = $temp;
            }else{
                $status['error'] = true;
                $status['message']['vdw-bond'] = true;
            }
        }

        #check if --ionic-bond value is a float
        if(isset($_POST['ionic-bond-checkbox'])){
            $temp = $_POST['ionic-bond-num'];
            if(is_numeric($temp) && $temp >= $paramsVal['ionic-bond'] && $temp <= $max){
                $params->ionic_bond = $temp;
            }else{
                $status['error'] = true;
                $status['message']['ionic-bond'] = true;
            }
        }

        #check if --generic-bond value is a float
        if(isset($_POST['generic-bond-checkbox'])){
            $temp = $_POST['generic-bond-num'];
            if(is_numeric($temp) && $temp >= $paramsVal['generic-bond'] && $temp <= $max){
                $params->generic_bond = $temp;
            }else{
                $status['error'] = true;
                $status['message']['generic-bond'] = true;
            }
        }

        #check if --pication-bond value is a float
        if(isset($_POST['pication-bond-checkbox'])){
            $temp = $_POST['pication-bond-num'];
            if(is_numeric($temp) && $temp >= $paramsVal['pication-bond'] && $temp <= $max){
                $params->pication_bond = $temp;
            }else{
                $status['error'] = true;
                $status['message']['pication-bond'] = true;
            }
        }

        #check if --pipistack-bond value is a float
        if(isset($_POST['pipistack-bond-checkbox'])){
            $temp = $_POST['pipistack-bond-num'];
            if(is_numeric($temp) && $temp >= $paramsVal['pipistack-bond'] && $temp <= $max){
                $params->pipistack_bond = $temp;
            }else{
                $status['error'] = true;
                $status['message']['pipistack-bond'] = true;
            }
        }

        #check if --h-bond-angle value is numeric
        if(isset($_POST['h-bond-angle-checkbox'])){
            $temp = $_POST['h-bond-angle-num'];
            if(is_numeric($temp)){
                $params->h_bond_angle = $temp;
            }else{
                $status['error'] = true;
                $status['message']['h-bond-angle'] = true;
            }
        }

        #check if --pication-angle value is numeric
        if(isset($_POST['pication-angle-checkbox'])){
            $temp = $_POST['pication-angle-num'];
            if(is_numeric($temp)){
                $params->pication_angle = $temp;
            }else{
                $status['error'] = true;
                $status['message']['pication-angle'] = true;
            }
        }

        #check if --pipistack-normal-normal value is numeric
        if(isset($_POST['pipistack-normal-normal-checkbox'])){
            $temp = $_POST['pipistack-normal-normal-num'];
            if(is_numeric($temp)){
                $params->pipistack_normal_normal = $temp;
            }else{
                $status['error'] = true;
                $status['message']['pipistack-normal-normal'] = true;
            }
        }

        #check if --pipistack-normal-centre value is numeric
        if(isset($_POST['pipistack-normal-centre-checkbox'])){
            $temp = $_POST['pipistack-normal-centre-num'];
            if(is_numeric($temp)){
                $params->pipistack_normal_centre = $temp;
            }else{
                $status['error'] = true;
                $status['message']['pipistack-normal-centre'] = true;
            }
        }
    }
}

?>
