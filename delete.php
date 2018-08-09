<?php
# Name: Mohneel Parakh
# TA: Brian Dai
# Assignment-7
# help delete pokemons from pokedex.
    error_reporting(E_ALL);
    include('common.php');
    header("Content-Type: application/json");
    $db = get_PDO();
    
    if (isset($_POST["name"])) {
    	$name = strtolower($_POST["name"]);
    	by_name($name,TRUE);
    } elseif (isset($_POST["mode"])) {
    	$mode = strtolower($_POST["mode"]);
    	remove_all($mode);
    } else {
    	error_found("or","name","mode");
    }
    
    // removes all the pokemon the user has found
    function remove_all($input) {
    	if ($input == "removeall") {
    		$db = get_PDO();
    		$db-> query("DELETE FROM Pokedex;");
    		print(json_encode(array("success" => "Success! All ".
    		"Pokemon removed from your Pokedex!")));
    	} else {
    		header("HTTP/1.1 400 Invalid Request");
    		print_r(json_encode(array("error" => "Error: Unknown mode " .
    		$input . ".")));
    		die();
    	}
    }

?>