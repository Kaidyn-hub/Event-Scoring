<?php
require 'db_connect.php';

$query = "SELECT * FROM scores ORDER BY event_name, gold DESC, silver DESC, bronze DESC";
$result = $conn->query($query);

$scores = [];
while ($row = $result->fetch_assoc()) {
    $scores[$row['event_name']][] = $row;
}

echo json_encode($scores);
?>