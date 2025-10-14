<?php
// Database configuration for GSM Backend3
$host = 'localhost';
$user = 'root'; // Adjust as needed
$password = ''; // Adjust as needed
$database = 'gsm_db_merged';

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Set charset to utf8
$conn->set_charset('utf8');

// Function to close connection
function closeConnection($conn) {
    $conn->close();
}
?>
