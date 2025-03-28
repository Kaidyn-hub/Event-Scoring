<?php
require 'db_connect.php'; // Include the database connection file

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the score details from the POST request
    $id = $_POST["id"] ?? null; // Participant ID
    $gold = $_POST["gold"] ?? null; // Gold score
    $silver = $_POST["silver"] ?? null; // Silver score
    $bronze = $_POST["bronze"] ?? null; // Bronze score

    // Validate input
    if (!$id || !is_numeric($gold) || !is_numeric($silver) || !is_numeric($bronze)) {
        echo json_encode(["status" => "error", "message" => "Invalid input"]); // Return error if input is invalid
        exit; // Terminate the script
    }

    // Prepare a SQL statement to update scores
    $query = "UPDATE scores SET gold = ?, silver = ?, bronze = ?, timestamp = CURRENT_TIMESTAMP WHERE id = ? 
          AND (gold != ? OR silver != ? OR bronze != ?)";
    $stmt = $conn->prepare($query); // Prepare the statement
    $stmt->bind_param("iiiiiii", $gold, $silver, $bronze, $id, $gold, $silver, $bronze); // Bind parameters

    // Execute the update statement
    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]); // Return success response
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]); // Return error response
    }

    $stmt->close(); // Close the prepared statement
    $conn->close(); // Close the database connection
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]); // Return error if request is invalid
} // current
?>