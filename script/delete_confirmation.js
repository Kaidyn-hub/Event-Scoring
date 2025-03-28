// Function to confirm deletion of all scores
function confirmDelete() {
    // Prompt the user for confirmation
    let userConfirmed = confirm("Are you sure you want to delete all scores? This action cannot be undone.");
    if (userConfirmed) {
        // If confirmed, call the function to delete all scores
        deleteAllScores();
    }
}

// Function to delete all scores from the database
function deleteAllScores() {
    // Send a POST request to delete_all.php to remove all scores
    fetch("delete_all.php", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
            // Check if the deletion was successful
            if (data.status === "success") {
                alert("All scores have been deleted.");
                // Redirect to the scoreboard page after deletion
                window.location.href = "admin_scoreboard.html";
            } else {
                // Alert the user if there was an error
                alert("Error deleting data: " + data.message);
            }
        })
        .catch(error => console.error("Fetch error:", error));
}//current