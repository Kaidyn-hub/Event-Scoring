<?php
session_start(); // Start a new session or resume the existing session

// Destroy the current session to log the user out
session_destroy();

// Redirect the user to the admin login page after logging out
header("Location: admin_login.html");
exit(); // Terminate the script to ensure no further code is executed
// current
?>