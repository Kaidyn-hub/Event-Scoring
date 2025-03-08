<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "event_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

$event = $_POST['event'];
$year = $_POST['year'];
$category = $_POST['category'];
$participants = $_POST['participants'];

foreach ($participants as $participant) {
    $sql = "INSERT INTO scores (participants, event_name, year, event_category, gold, silver, bronze) 
            VALUES ('$participant', '$event', '$year', '$category', 0, 0, 0)";
    $conn->query($sql);
}

echo json_encode(["status" => "success"]);
$conn->close();
// current
?>