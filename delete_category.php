<?php
require "db_connect.php"; // Include the database connection file

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $category = $_POST["category"]; // Get the category from the POST request

    // Check if the category is not empty
    if (!empty($category)) {
        // Prepare a SQL statement to delete scores by category
        $stmt = $conn->prepare("DELETE FROM scores WHERE event_category = ?");
        $stmt->bind_param("s", $category); // Bind the category parameter

        // Execute the delete statement
        if ($stmt->execute()) {
            echo "Category '$category' has been deleted successfully."; // Return success message
        } else {
            echo "Error deleting category."; // Return error message
        }

        $stmt->close(); // Close the prepared statement
    } else {
        echo "Invalid category."; // Return error if category is invalid
    }

    $conn->close(); // Close the database connection
}
?>