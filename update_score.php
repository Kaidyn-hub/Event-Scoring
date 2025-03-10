<?php
require 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST["id"] ?? null;
    $gold = $_POST["gold"] ?? null;
    $silver = $_POST["silver"] ?? null;
    $bronze = $_POST["bronze"] ?? null;

    if (!$id || !is_numeric($gold) || !is_numeric($silver) || !is_numeric($bronze)) {
        echo json_encode(["status" => "error", "message" => "Invalid input"]);
        exit;
    }

    $query = "UPDATE scores SET gold = ?, silver = ?, bronze = ?, timestamp = CURRENT_TIMESTAMP WHERE id = ? 
          AND (gold != ? OR silver != ? OR bronze != ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iiiiiii", $gold, $silver, $bronze, $id, $gold, $silver, $bronze);


    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}// current
?>
