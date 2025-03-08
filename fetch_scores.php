<?php
require 'db_connect.php';

header('Content-Type: application/json');

$query = "SELECT id, event_name, event_category, participants, gold, silver, bronze, year FROM scores ORDER BY event_name, event_category, gold DESC, silver DESC, bronze DESC";
$result = $conn->query($query);

$scores = [];

while ($row = $result->fetch_assoc()) {
    $eventKey = $row['event_name'] . ' - ' . $row['year'];

    if (!isset($scores[$eventKey])) {
        $scores[$eventKey] = [
            "event_info" => [
                "name" => $row['event_name'],
                "category" => $row['event_category']
            ],
            "participants" => []
        ];
    }

    $participantName = isset($row["participants"]) ? $row["participants"] : "Unknown";

    $scores[$eventKey]["participants"][] = [
        "id" => $row["id"],
        "participant" => $participantName,
        "category" => $row["event_category"],
        "gold" => $row["gold"],
        "silver" => $row["silver"],
        "bronze" => $row["bronze"]
    ];
}

echo json_encode($scores);
$conn->close();
// current
?>