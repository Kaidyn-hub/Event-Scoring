<?php
session_start(); // Start a new session or resume the existing session

// Database connection parameters
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "event_db";

// Create a new MySQLi connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get username and password from the POST request
    $username = $_POST["username"];
    $password = $_POST["password"];

    // Prepare a SQL statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM admins WHERE username = ? LIMIT 1");
    $stmt->bind_param("s", $username); // Bind the username parameter
    $stmt->execute(); // Execute the prepared statement
    $result = $stmt->get_result(); // Get the result set
    $admin = $result->fetch_assoc(); // Fetch the admin record

    // Check if the admin exists and the password matches
    if ($admin && $password === $admin["password"]) { 
        $_SESSION["admin"] = $username; // Store the username in the session
        echo json_encode(["status" => "success"]); // Return success response
    } else {
        echo json_encode(["status" => "error"]); // Return error response
    }
}
$conn->close(); // Close the database connection
// current
?>