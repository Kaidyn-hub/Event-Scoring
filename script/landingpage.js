// Function to add a new participant input field
function addParticipant() {
    let container = document.getElementById("participants-container");
    let newInput = document.createElement("div");
    newInput.classList.add("mb-3", "input-group");
    // Create the input field and remove button for the new participant
    newInput.innerHTML = `
        <input type="text" class="form-control participant-input" placeholder="Enter Participant Name" name="participants[]" required>
        <button type="button" class="btn btn-danger" onclick="removeParticipant(this)" style="margin-left: -1px;">&times;</button>
    `;
    // Append the new input field to the container
    container.appendChild(newInput);
}

// Function to remove a participant input field
function removeParticipant(button) {
    let participantDiv = button.parentElement; // Get the parent div of the button
    participantDiv.remove(); // Remove the participant input field
}

// Event listener for the event form submission
document.getElementById("eventForm").addEventListener("submit", function(event) {
    // Prevent the default form submission
    event.preventDefault();
    let formData = new FormData(this); // Create a FormData object from the form

    // Send a POST request to save_event.php to save the event details
    fetch("save_event.php", {
        method: "POST",
        body: formData
    }).then(response => response.json())
      .then(data => {
          // Check if the data was saved successfully
          if (data.status === "success") {
            alert("Data saved successfully!");
            this.reset(); // Reset the form
            document.getElementById("participants-container").innerHTML = ""; // Clear the participants container
          } else {
              // Alert the user if there was an error saving data
              alert("Error saving data: " + data.message);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert("An error occurred while saving data."); // Alert on error
      });
});

// Function to confirm logout
function confirmLogout(event) {
    event.preventDefault(); // Prevent default action

    // Prompt the user for confirmation
    const userConfirmed = confirm("Are you sure you want to logout?");
    if (userConfirmed) {
        // Redirect to logout.php if confirmed
        window.location.href = "logout.php";
    }
}