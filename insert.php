<?php
# Name: Mohneel Parakh
# TA: Brian Dai
# Assignment-7
# help add new pokemon

    error_reporting(E_ALL);
    include('common.php');
    header("Content-Type: application/json");
    
    if (isset($_POST["name"])) {
    	$name = strtolower($_POST["name"]);
    	if(isset($_POST["nickname"])) {
    		$nickname = $_POST["nickname"];
    		add_entry($name,$nickname,TRUE);
    	} else {
    		add_entry($name, strtoupper($name),TRUE);
    	}
    } else {
    	error_found(null,"name", "");
    }

?>