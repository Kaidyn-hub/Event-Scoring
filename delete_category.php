<?php
require "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $category = $_POST["category"];

    if (!empty($category)) {
        $stmt = $conn->prepare("DELETE FROM scores WHERE event_category = ?");
        $stmt->bind_param("s", $category);

        if ($stmt->execute()) {
            echo "Category '$category' has been deleted successfully.";
        } else {
            echo "Error deleting category.";
        }

        $stmt->close();
    } else {
        echo "Invalid category.";
    }

    $conn->close();
}
?>
