<?php
require "db_connect.php";

$query = "SELECT DISTINCT event_category FROM scores";
$result = $conn->query($query);

$categories = [];
while ($row = $result->fetch_assoc()) {
    $categories[] = $row["event_category"];
}

echo json_encode($categories);
$conn->close();
?>
