// Event listener for the login form submission
document.getElementById("loginForm").addEventListener("submit", function (event) {
    // Prevent the default form submission
    event.preventDefault();
    // Get the username and password from the input fields
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Send a POST request to admin_login.php for authentication
    fetch("admin_login.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${username}&password=${password}`
    })
        .then(response => response.json())
        .then(data => {
            // Check if the login was successful
            if (data.status === "success") {
                // Redirect to the landing page upon successful login
                window.location.href = "landingpage.html";
            } else {
                // Display an error message if login fails
                document.getElementById("errorMsg").style.display = "block";
            }
        });
});//current