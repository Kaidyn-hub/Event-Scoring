function addParticipant() {
    let container = document.getElementById("participants-container");
    let newInput = document.createElement("div");
    newInput.classList.add("mb-3", "input-group");
    newInput.innerHTML = `
        <input type="text" class="form-control participant-input" placeholder="Enter Participant Name" name="participants[]" required>
        <button type="button" class="btn btn-danger" onclick="removeParticipant(this)" style="margin-left: -1px;">&times;</button>
    `;
    container.appendChild(newInput);
}

function removeParticipant(button) {
    let participantDiv = button.parentElement;
    participantDiv.remove();
}

document.getElementById("eventForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let formData = new FormData(this);

    fetch("save_event.php", {
        method: "POST",
        body: formData
    }).then(response => response.json())
      .then(data => {
          if (data.status === "success") {
            alert("Data saved successfully!");
            this.reset();
            document.getElementById("participants-container").innerHTML = "";
          } else {
              alert("Error saving data: " + data.message);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert("An error occurred while saving data.");
      });
});

function confirmLogout(event) {
    event.preventDefault();

    const userConfirmed = confirm("Are you sure you want to logout?");
    if (userConfirmed) {
        window.location.href = "logout.php";
    }
}
// current