<?php 
  session_start();
  $_SESSION['sessIdUser'] = session_id();

?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <title>RINmaker</title>

    <!-- Bootstrap CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="style2.css">
</head>

<body>
    

    <div class="wrapper">
        <!-- Sidebar Holder -->
        <nav id="sidebar" class="">
            <br>
            <div class="container">
                <img src="img/logo.png"/ class="img-fluid" alt="Responsive image">
            </div>

            <div class="container">
                <p style="color: white" class="lead">Ca' Foscari University of Venice</p>
                <p style="color: white" class="lead">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag-fill" viewBox="0 0 16 16">
                      <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    </svg>
                    <strong>v0.1.3</strong> 29/03/2021
                </p>
            </div>

            <div class="container">
                <div class="container">

                    <ul class="navbar-nav">

                        <li class="nav-item active">
                            <a class="nav-link" href="../RINmaker/index.php">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
                                    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/>
                                </svg>
                                Home
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="../RINmaker/about.html">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                                </svg>
                                About
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="../RINmaker/help.html">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
                                </svg>
                                Help
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Page Content Holder -->
        <div id="content">

            <nav>
                <button type="button" id="sidebarCollapse" class="navbar-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
            <br>
            
            <main role="main" class="container rounded" >
                <form id="form1" method="post" enctype=multipart/form-data>
                    <div class="container">
                        <br>
                        <h4 class="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-keyboard" viewBox="0 0 16 16">
                                <path d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z"/>
                                <path d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75v-.5zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-.5zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75v-.5zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75v-.5zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75v-.5zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75v-.5zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75v-.5zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75v-.5zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75v-.5zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25v-.5z"/>
                            </svg>
                            Input
                        </h4>
                        <hr class="my-4">
                        <div class="row">
                            <div class="col-sm">
                                <p style="color: black">
                                    Load PDB file
                                </p>
                                <div class="input-group mb-3">
                                    <input type="file" name="customFile" class="form-control" id="customFile">  
                                </div>
                            </div>
                            <div class="col-sm">
                                <p style="color: black">Insert PDB ID</p>
                                <div class="input-group mb-3">
                                    <input type="text" name="pdbid" id="pdbid" class="form-control" placeholder="PDB ID" aria-label="Example text with button addon" aria-describedby="button-addon1">
                                </div>
                            </div>
                        </div>
        
                        <h4 class="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-check" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
                            </svg>
                            Options
                        </h4>
                        <hr class="my-4">

                        <div class="row">
                            <p>
                                <i>ångström (Å) = 0.1 nanometers = 1<sup>-10</sup> meters</i>
                            </p>
                        </div>
                        <br>

                        <div class="row">
                            <div class="col-sm">
                                <p><mark>Bond Control</mark></p>
                                <div class="input-group mb-3">
                                    <select id="bond-control" name="bond-control" class="form-select" >
                                    <option selected>strict</option>
                                    <option>weak</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm">

                                <p><mark>Interaction Type</mark></p>
                                <div class="input-group mb-3">
                                    <select id="interaction-type" name="interaction-type" class="form-select">
                                    <option selected>all</option>
                                    <option>multiple</option>
                                    <option>one</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-sm">

                                <p><mark>Network Policy</mark></p>
                                <div class="input-group mb-3">
                                    <select id="net-policy" name="net-policy" class="form-select">
                                    <option selected>closest</option>
                                    <option>Ca</option>
                                    <option>Cb</option>
                                    </select>
                                </div>
                            </div>
                        </div>  
                        <br>
                        <div class="row">
                            <div class="col-sm">
                                <p><mark>Sequence Separation</mark></p>
                                <div class="input-group mb-3">
                                    <div class="input-group-text">
                                    <input id="seq-sep-checkbox" name="seq-sep-checkbox" class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input id="seq-sep-num" name="seq-sep-num" type="text" class="form-control" placeholder="UINT=3">
                                </div>
                            </div>
                            <div class="col-sm">
                                <p><mark>Hydrogen bond</mark> <i>(in Å)</i></p>
                                <div class="input-group mb-3">
                                    <div class="input-group-text">
                                    <input id="h-bond-checkbox" name="h-bond-checkbox" class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input id="h-bond-num" name="h-bond-num" type="text" class="form-control" placeholder="FLOAT=3.5" >
                                </div>
                            </div>
                            <div class="col-sm">
                                <p><mark>Van Der Waals bond</mark> <i>(in Å)</i></p>
                                <div class="input-group mb-3">
                                    <div class="input-group-text">
                                    <input id="vdw-bond-checkbox" name="vdw-bond-checkbox" class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input id="vdw-bond-num" name="vdw-bond-num" type="text" class="form-control" placeholder="FLOAT=0.5">
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-sm">
                                <p><mark>Ionic bond</mark> <i>(in Å)</i></p>
                                <div class="input-group mb-3">
                                    <div class="input-group-text">
                                    <input id="ionic-bond-checkbox" name="ionic-bond-checkbox" class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input id="ionic-bond-num" name="ionic-bond-num" type="text" class="form-control" placeholder="FLOAT=4">
                                </div>
                            </div>
                            <div class="col-sm">
                                <p><mark>Generic bond</mark> <i>(in Å)</i></p>
                                <div class="input-group mb-3">
                                    <div class="input-group-text">
                                    <input id="generic-bond-checkbox" name="generic-bond-checkbox" class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input id="generic-bond-num" name="generic-bond-num" type="text" class="form-control" placeholder="FLOAT=6">
                                </div>
                            </div>
                            <div class="col-sm">
                                <p><mark>&#960-cation interaction</mark> <i>(in Å)</i></p>
                                <div class="input-group mb-3">
                                    <div class="input-group-text">
                                    <input id="pication-bond-checkbox" name="pication-bond-checkbox" class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input id="pication-bond-num" name="pication-bond-num" type="text" class="form-control" placeholder="FLOAT=5">
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-sm">
                                <p><mark>&#960-&#960 stacking</mark> <i>(in Å)</i></p>
                                <div class="input-group mb-3">
                                    <div class="input-group-text">
                                    <input id="pipistack-bond-checkbox" name="pipistack-bond-checkbox" class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input id="pipistack-bond-num" name="pipistack-bond-num" type="text" class="form-control" placeholder="FLOAT=6.5">
                                </div>
                            </div>
                            <div class="col-sm">
                            <p><mark>Hydrogen bond angle</mark> <i>(in degrees)</i></p>
                                <div class="input-group mb-3">
                                    <div class="input-group-text">
                                    <input id="h-bond-angle-checkbox" name="h-bond-angle-checkbox" class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input id="h-bond-angle-num" name="h-bond-angle-num" type="text" class="form-control" placeholder="FLOAT=63">
                                </div>
                            </div>
                            <div class="col-sm">
                                <p><mark>&#960-cation angle</mark> <i>(in degrees)</i></p>
                                <div class="input-group mb-3">
                                    <div class="input-group-text">
                                    <input id="pication-angle-checkbox" name="pication-angle-checkbox" class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input id="pication-angle-num" name="pication-angle-num" type="text" class="form-control" placeholder="FLOAT=45">
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-sm">
                                <p><mark>&#960-&#960 stacking-normal-normal</mark> <i>(in degrees)</i></p>
                                <div class="input-group mb-3">
                                    <div class="input-group-text">
                                        <input id="pipistack-normal-normal-checkbox" name="pipistack-normal-normal-checkbox" class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input id="pipistack-normal-normal-num" name="pipistack-normal-normal-num" type="text" class="form-control" placeholder="FLOAT=90">
                                </div>
                            </div>
                            <div class="col-sm">
                                <p><mark>&#960-&#960 stacking-normal-centre</mark> <i>(in degrees)</i></p>
                                <div class="input-group mb-3">
                                    <div class="input-group-text">
                                        <input id="pipistack-normal-centre-checkbox" name="pipistack-normal-centre-checkbox" class="form-check-input mt-0" type="checkbox" value="">
                                    </div>
                                    <input id="pipistack-normal-centre-num" name="pipistack-normal-centre-num" type="text" class="form-control" placeholder="FLOAT=90">
                                </div>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row text-center">
                        <input type="hidden" id="upcontent" name="upcontent" value="">

                        <div class="col-sm">
                            <input type="submit" name="download" id="download" class="btn btn-primary" value="Generate XML" onclick=" if(redirectXML())load(); else return false"/>
                            <div id="loading"></div>
                        </div>

                        <div class="col-sm">
                            <input type="button" class="btn btn-primary" value="Show 2D RIN" onclick="redirect2d()"/>
                        </div>

                        <div class="col-sm">
                            <input type="button" class="btn btn-primary" value="Show 3D RIN" onclick="redirect3d()"/>
                        </div>

                        <div id="result"></div>
                    </div>
                </form>
                <br>
            </main>
            <br>
                <?php
                    if(isset($_GET['err-send'])){
                        if($_GET['err-send'] == true){
                            echo '
                            <div class="container">
                                <div class="alert alert-warning d-flex align-items-center" role="alert">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                    </svg>
                                    &nbsp; Insert only a .pdb file in the form
                                </div>
                            </div>
                            ';
                        }
                    }


                    if(isset($_GET['err-not-found'])){
                        if($_GET['err-not-found'] == true){
                            echo '
                            <div class="container">
                                <div class="alert alert-danger d-flex align-items-center" role="alert">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                                    </svg>
                                    &nbsp; The specified pdb file does not exist
                                </div>
                            </div>
                            ';
                        }
                    }

                    if(isset($_GET['err-int-err'])){
                        if($_GET['err-int-err'] == true){
                            echo '
                            <div class="container">
                                <div class="alert alert-warning d-flex align-items-center" role="alert">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                    </svg>
                                    &nbsp; Internal error. The service is temporarily not working, try again later
                                </div>
                            </div>
                            ';
                        }
                    }

                    if(isset($_GET['err-bad-request'])){
                        if($_GET['err-bad-request'] == true){
                            echo '
                            <div class="container">
                                <div class="alert alert-warning d-flex align-items-center" role="alert">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                    </svg>
                                    &nbsp; Bad Request. Incorrect value, please check that all parameters respect the constraints. For more info visit the Help page
                                </div>
                            </div>
                            ';
                        }
                    }

                    if(isset($_GET['msg-succ'])){
                        if($_GET['msg-succ'] == true){
                            echo '
                            <div class="container">
                                <div class="alert alert-success d-flex align-items-center" role="alert">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                    </svg>
                                    &nbsp; Completed successfully
                                </div>
                            </div>
                            ';
                        }
                    }
                ?> 
                <br>
                <div id="loading">
                </div>
                <div class="container">
                    <div class="card">
                        <div class="card-header">
                            Log: <?php
                                    if(isset($_GET['filename'])){
                                        $file = $_GET['filename'];
                                        echo "<strong>".substr($file, 0, 8)."</strong>";
                                    }
                                ?>
                        </div>
                        <div id="card" class="card-body">

                        <pre> 
<?php
if(isset($_GET['msg-log'])){
echo $_GET['msg-log'];
}

if(isset($_GET['err-not-found'])){
echo "File not found";
}

if(isset($_GET['err-int-err'])){
echo "Internal Error";
}

if(isset($_GET['err-bad-request'])){
echo "Bad Request";
}
?>
                        </pre>
                    </div>
                </div>
            </div>
            <br>
            <?php
            if(isset($_GET['filename'])){
                $file = $_GET['filename'];
                echo "
                <div class=container>
                    <a href= files/$file  download>
                    <button type='button' class='btn btn-primary'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-cloud-arrow-down-fill' viewBox='0 0 16 16'>
                            <path d='M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z'/>
                        </svg>
                        Download XML
                    </button>
                    </a>
                </div>
                ";
            }
            ?>
            <br>
        </div>
    </div>

    <!-- jQuery CDN - Slim version (=without AJAX) -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <!-- Popper.JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossorigin="anonymous"></script>
    <!-- Bootstrap JS -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script>

    <script type="text/javascript">
        $(document).ready(function () {
            $('#sidebarCollapse').on('click', function () {
                $('#sidebar').toggleClass('active');
                $(this).toggleClass('active');
            });
        });
    </script>

    

    <script defer src="https://use.fontawesome.com/releases/v5.0.13/js/solid.js" integrity="sha384-tzzSw1/Vo+0N5UhStP3bvwWPq+uvzCMfrN1fEFe+xBmv1C/AtVX5K0uZtmcHitFZ" crossorigin="anonymous"></script>
    <script defer src="https://use.fontawesome.com/releases/v5.0.13/js/fontawesome.js" integrity="sha384-6OIrr52G08NpOFSZdxxz1xdNSndlD4vdcf/q2myIUVO0VsqaGHJsB0RaBE01VTOY" crossorigin="anonymous"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-p34f1UUtsS3wqzfto5wAAmdvj+osOnFyQFpp4Ua3gs/ZVWx6oOypYoCJhGGScy+8" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"
    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
    crossorigin="anonymous"></script>
    <script src="//unpkg.com/element-resize-detector/dist/element-resize-detector.min.js"></script>
    
    <script type="text/javascript" src="js/functions.js"></script>
    <script type="text/javascript" src="js/checkForm.js"></script>
    <script type="text/javascript" src="js/browserDetection.js"></script>

    

    <footer class="bg-light text-center text-lg-start">
        <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.1);">
            © 2021 Ca' Foscari University of Venice
        </div>
    </footer>

</body>

</html>
