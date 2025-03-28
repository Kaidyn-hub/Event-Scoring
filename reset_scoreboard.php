<?php
include 'db_connect.php'; // Include the database connection file

// SQL query to reset all scores to zero
$sql = "UPDATE scores SET gold = 0, silver = 0, bronze = 0";

// Execute the reset query and check for success
if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]); // Return success response
} else {
    echo json_encode(["status" => "error"]); // Return error response
}

$conn->close(); // Close the database connection
// current
?>