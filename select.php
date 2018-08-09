<?php

    include('common.php');
    header("Content-Type: application/json");
    error_reporting(E_ALL);
    
    select();
    
    // this will show the current pokemon that you have
    function select() {
        $outter_array = array();
        try {
            $db = get_PDO();
        	$query = "SELECT * FROM Pokedex;";
        	$rows = $db->query($query);
        	$output = array();
        	foreach($rows as $row) {
        		$item_data = array();
        		$item_data["name"] = $row["name"];
        		$item_data["nickname"] = $row["nickname"];
        		$item_data["datefound"] = $row["datefound"];
        		array_push($output, $item_data);
        	}
        	$outter_array['pokemon'] = $output;
        	print_r(json_encode($outter_array));
        } catch (PDOException $ex) {
        	handle_error("Cannot query the database", $ex);
        }
    }

?>