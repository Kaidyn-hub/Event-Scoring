<?php
include 'db_connect.php';

$sql = "UPDATE scores SET gold = 0, silver = 0, bronze = 0";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}

$conn->close();
// current
?>
