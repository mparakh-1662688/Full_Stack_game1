<?php
# Name: Mohneel Parakh
# TA: Brian Dai
# Assignment-7
# consists of methods that could be used by other files

    error_reporting(E_ALL);
    
    # this will help setup the link between the database and php
    function get_PDO() {
    	$host =  "localhost";
    	$user = "root";
    	$password = "";
    	$dbname = "hw7";
    	
    	$ds = "mysql:host={$host};dbname={$dbname};charset=utf8";
    	
    	try {
    		$db = new PDO($ds, $user, $password);
    		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    		return $db;
    	} catch (PDOException $ex) {
    		handle_error("Can not connect to the database. Please try again later.", $ex);
    	}
    }
    
    # Prints the given error message ($msg) with details about the error ($ex)
    function handle_error($msg, $ex) {
    	header("Content-Type: text/plain");
    	print ("{$msg}\n");
    	print ("Error details: $ex \n");
    	die();
    }
    
    # this will help display the error to the user if the 
    # required parameters have not been passed. 
    function error_found($type, $parameter1, $parameter2) {
    	if ($type != null) {
    		header("HTTP/1.1 400 Invalid Request");
    		print_r(json_encode(array("error" => "Error: Missing " .
    		$parameter1 . " " . $type . " " . $parameter2 . " parameter")));
    	} else {
    		header("HTTP/1.1 400 Invalid Request");
    		print_r(json_encode(array("error" => "Error: Missing " .
    		$parameter1 . " parameter")));
    		die();
    	}
    }
    
    # This function help delete the pokemon by their names
    function by_name($name, $check) {
    	$db = get_PDO();
    	$rows = $db-> query("SELECT * FROM Pokedex WHERE name = '{$name}';");
    	$output = array();
    	foreach($rows as $row) {
    		$item_data = array();
    		$item_data["name"] = $row["name"];
    		array_push($output, $item_data);
    	}
    	if (count($output) > 0) {
    		$db-> query("DELETE FROM Pokedex WHERE name = '{$name}';");
    		if($check) {
    			print(json_encode(array("success" => "Success! " . $name .
    			" removed from your Pokedex!")));
    		}
    	} else if($check) {
    		header("HTTP/1.1 400 Invalid Request");
    		print_r(json_encode(array("error" => "Error: Pokemon " . $name .
    		" not found in your Pokedex.")));
    		die();
    	}
    }
    
    
    # this will add a new pokemon to the pokedex and also give them nicknames
    function add_entry($name, $nickname, $check) {
    	$db = get_PDO();
    	try {
    		date_default_timezone_set('America/Los_Angeles');
    		$time = date('y-m-d H:i:s');
    		$new_entry = "INSERT INTO Pokedex VALUES ('{$name}', '{$nickname}'"
    		. ",'{$time}');";
    		$db->query($new_entry);
    		$params = array("name" => $name, "nickname" => $nickname);
    		if($check) {
    			print(json_encode(array("success" => "Success! " . $name .
    			" added to your Pokedex!")));
    		}
    	} catch (PDOException $ex) {
    		header("HTTP/1.1 400 Invalid Request");
    		print_r(json_encode(array("error" => "Error: Pokemon " . $name .
    		" already found.")));
    		die();
    	}
    }

?>

