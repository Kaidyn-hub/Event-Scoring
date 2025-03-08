function sendEmail() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const subject = encodeURIComponent("Contact Form Submission from " + name);
    const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nMessage: " + message);
    const mailtoLink = `mailto:sindoaija02@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
    return false;
}
//current