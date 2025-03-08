function confirmDelete() {
    let userConfirmed = confirm("Are you sure you want to delete all scores? This action cannot be undone.");
    if (userConfirmed) {
        deleteAllScores();
    }
}

function deleteAllScores() {
    fetch("delete_all.php", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
            if (data.status === "success") {
                alert("All scores have been deleted.");
                window.location.href = "admin_scoreboard.html";
            } else {
                alert("Error deleting data: " + data.message);
            }
        })
        .catch(error => console.error("Fetch error:", error));
}
//current