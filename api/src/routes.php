<?php
// Routes

$app->get('/login/[{username}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return "Hello {$args['username']}";
});

$app->post('/login', function ($request, $response, $args) {
    //Get credentials from request body
	$credentials = $request->getParsedBody();
	
	//Authenticate against the Database
	$db = $this->dbConn;
	$sql = 'CALL Login(\''. $credentials['username'] .'\',\''. $credentials['password'] . '\');';
	$query = $db->query($sql);
	$row = $query->fetchAll();
	//$result = $query->execute();
	$returnArray = array();
	//If username and password exists in database
	if (sizeof($row) == 1) {
		$returnArray['success'] = 'True';
		//print_r($query->fetchAll());		
		//retrieve name and add it to final return array
		$data = $row[0];
		$returnArray['userID'] = $data['userID'];
		$returnArray['token'] = $data['token'];	
	}
	else {
		$returnArray['success'] = 'False';
	}

	
	return json_encode($returnArray);
});

$app->post('/logout', function ($request, $response, $args) {
    //Get credentials from request body
	$credentials = $request->getParsedBody();
	
	//Authenticate against the Database
	$db = $this->dbConn;
	$sql = 'CALL Logout(\''. $credentials['Authorization'] .'\');';
	$query = $db->query($sql);
	$row = $query->fetchAll();
	//$result = $query->execute();
	$returnArray = array();
	//If username and password exists in database
	if (sizeof($row) == 1) {
		$returnArray['success'] = 'True';
	}
	else {
		$returnArray['success'] = 'False';
	}

	
	return json_encode($returnArray);
});