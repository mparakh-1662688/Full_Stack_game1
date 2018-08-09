<?php
# Name: Mohneel Parakh
# TA: Brian Dai
# Assignment-7
# help update the nicknames of pokemons

    include('common.php');
    header("Content-Type: application/json");
    error_reporting(E_ALL);
    
    if(isset($_POST["name"])) {
    	$name = strtolower($_GET["name"]);
    }
	if(isset($_POST["nickname"])) {
		update($name, $_POST["nickname"]);
	} else {
		update($_POST["name"], strtoupper($_GET["name"]));
	}

    # this will help update the name of the pokemon and give it a nickname.
    function update($name, $nickname) {
    	$query = "SELECT * FROM Pokedex;";
    	$db = get_PDO();
    	$rows = $db->query($query);
    	$name_exists;
    	foreach($rows as $row) {
    		if($row["name"] == $name) {
    			$name_exists = $row['name'];
    		}
    	}
    	if ($name_exists == null) {
    		header("HTTP/1.1 400 Invalid Request");
    		print_r(json_encode(array("error" => "Error: Pokemon " . $name .
    		" not found in your Pokedex.")));
    	} else {
    		$query = "UPDATE Pokedex SET nickname = '{$nickname}'" .
    		" WHERE name = '{$name}';";
    		$db->query($query);
    		print_r(json_encode(array("success" => "Success! Your " . $name .
    		" is now named " . $nickname . "!")));
    	}
    }

?>