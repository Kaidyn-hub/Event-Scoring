// Function to send an email using the contact form
function sendEmail() {
    // Get the values from the input fields
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Encode the subject and body for the mailto link
    const subject = encodeURIComponent("Contact Form Submission from " + name);
    const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nMessage: " + message);
    // Create a mailto link
    const mailtoLink = `mailto:sindoaija02@gmail.com?subject=${subject}&body=${body}`;

    // Redirect to the mailto link to open the user's email client
    window.location.href = mailtoLink;
    return false; // Prevent default form submission
}