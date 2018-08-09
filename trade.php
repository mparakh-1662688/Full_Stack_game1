<?php
# Name: Mohneel Parakh
# TA: Brian Dai
# Assignment-7
# help trade pokemon with friends
   
    include('common.php');
    header("Content-Type: application/json");
    error_reporting(E_ALL);
    
    if(isset($_POST["mypokemon"]) && isset($_POST["theirpokemon"])) {
    	$my_pokemon = strtolower($_POST["mypokemon"]);
    	$their_pokemon = strtolower($_POST["theirpokemon"]);
    	trade($my_pokemon,$their_pokemon);
    } else {
    	error_found("and","mypokemon","theirpokemon");
    }
    
    // help trade pokemon with friend
    function trade($my_pokemon,$their_pokemon) {
    	$query = "SELECT * FROM Pokedex;";
    	$db = get_PDO();
    	$rows = $db->query($query);
    	$name;
    	foreach($rows as $row) {
    		if($row["name"] == $my_pokemon) {
    			$name = $row['name'];
    		}
    		if($row["name"] == $their_pokemon) {
    		    header("HTTP/1.1 400 Invalid Request");
    			print(json_encode(array("error" => "Error: You have already ".
    			" found " . $their_pokemon . ".")));
    			die();
    		}
    	}
    	if($name != null) {
    		by_name($my_pokemon,FALSE);
    		add_entry($their_pokemon, strtoupper($their_pokemon),FALSE);
    		print(json_encode(array("success" => "Success! You have traded " .
    		"your ". $my_pokemon . " for " . $their_pokemon . "!")));
    		} else {
    		    header("HTTP/1.1 400 Invalid Request");
    			print(json_encode(array("error" => "Error: Pokemon " . $my_pokemon .
    			" not found in your Pokedex.")));
    			die();
		}
	}
    
?>