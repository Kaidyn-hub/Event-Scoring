<?php
// Database connection parameters
$host = "localhost"; // Database host
$user = "root";      // Database username
$pass = "";          // Database password
$db = "event_db";    // Database name

// Create a new MySQLi connection
$conn = new mysqli($host, $user, $pass, $db);

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error); // Terminate script if connection fails
}
// current
?>