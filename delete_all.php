<?php
session_start(); // Start a new session or resume the existing session
error_reporting(E_ALL); // Enable error reporting
ini_set('display_errors', 1); // Display errors on the screen

header("Content-Type: application/json"); // Set the content type to JSON

// Check if the user is logged in as an admin
if (!isset($_SESSION["admin"])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized access"]); // Return error if not authorized
    exit(); // Terminate the script
}

include "db_connect.php"; // Include the database connection file

// Check for connection errors
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit(); // Terminate the script
}

// SQL query to delete all scores from the scores table
$sql = "DELETE FROM scores";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]); // Return success response
} else {
    echo json_encode(["status" => "error", "message" => "Failed to delete data: " . $conn->error]); // Return error response
}

$conn->close(); // Close the database connection
// current
?>