<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

if (!isset($_SESSION["admin"])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized access"]);
    exit();
}

include "db_connect.php";

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "DELETE FROM scores";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to delete data: " . $conn->error]);
}

$conn->close();
// current
?>