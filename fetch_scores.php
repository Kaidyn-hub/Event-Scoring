<?php
require 'db_connect.php';

$query = "SELECT * FROM scores ORDER BY gold DESC, silver DESC, bronze DESC";
$result = $conn->query($query);

$scores = [];
while ($row = $result->fetch_assoc()) {
    $scores[] = $row;
}

echo json_encode($scores);
?>
