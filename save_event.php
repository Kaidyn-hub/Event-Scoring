<?php
// Database connection parameters
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "event_db";

// Create a new MySQLi connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"])); // Return error if connection fails
}

// Get event details from the POST request
$event = $_POST['event'];
$year = $_POST['year'];
$category = $_POST['category'];
$participants = $_POST['participants']; // Get participants array from the form

// Loop through each participant and insert into the scores table
foreach ($participants as $participant) {
    $sql = "INSERT INTO scores (participants, event_name, year, event_category, gold, silver, bronze) 
            VALUES ('$participant', '$event', '$year', '$category', 0, 0, 0)"; // Insert with initial scores set to 0
    $conn->query($sql); // Execute the insert query
}

echo json_encode(["status" => "success"]); // Return success response
$conn->close(); // Close the database connection
// current
?>