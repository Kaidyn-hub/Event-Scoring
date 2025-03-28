<?php
require 'db_connect.php'; // Include the database connection file

header('Content-Type: application/json'); // Set the content type to JSON

// SQL query to fetch scores from the scores table
$query = "SELECT id, event_name, event_category, participants, gold, silver, bronze, year, timestamp 
          FROM scores 
          ORDER BY event_name, event_category, gold DESC, silver DESC, bronze DESC, timestamp ASC";

$result = $conn->query($query); // Execute the query

$scores = []; // Initialize an array to hold the scores

// Loop through the result set and organize scores by event
while ($row = $result->fetch_assoc()) {
    $eventKey = $row['event_name'] . ' - ' . $row['year']; // Create a unique key for each event

    // Check if the event key already exists in the scores array
    if (!isset($scores[$eventKey])) {
        $scores[$eventKey] = [
            "event_info" => [
                "name" => $row['event_name'],
                "category" => $row['event_category']
            ],
            "participants" => [] // Initialize participants array
        ];
    }

    // Get the participant name or set to "Unknown" if not available
    $participantName = isset($row["participants"]) ? $row["participants"] : "Unknown";

    // Add participant details to the scores array
    $scores[$eventKey]["participants"][] = [
        "id" => $row["id"],
        "participant" => $participantName,
        "category" => $row["event_category"],
        "gold" => $row["gold"],
        "silver" => $row["silver"],
        "bronze" => $row["bronze"],
        "timestamp" => $row["timestamp"]
    ];
}

echo json_encode($scores); // Return the scores as a JSON response
$conn->close(); // Close the database connection
// current
?>