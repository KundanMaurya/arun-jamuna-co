<?php
/**
 * contact-handler.php
 * -----------------------------------------------------------------------
 * Handles submissions from the contact form on contact.html.
 *
 * Works automatically on GoDaddy shared / cPanel hosting, because PHP and
 * the mail() function are supported by default on those plans — no extra
 * setup, account signup, or API key is required. Just upload this file
 * alongside the HTML/CSS/JS files and set TO_EMAIL below.
 *
 * If your specific hosting plan does NOT support PHP (e.g. a very basic
 * "static only" / website-builder plan), see README.md for the
 * alternative: swapping SITE_CONFIG.FORM_ENDPOINT in js/script.js for a
 * hosted form service URL instead. The front-end code works the same way
 * either way.
 * -----------------------------------------------------------------------
 */

// =========================================================================
// CONFIGURATION — edit these two lines for your firm
// =========================================================================
const TO_EMAIL      = "arun.maurya@icai.org";           // Where enquiries should be delivered
const SITE_NAME      = "Arun Jamuna & Co.";           // Used in the email subject line
// =========================================================================

header("X-Content-Type-Options: nosniff");

// Detect whether this was an AJAX (fetch) submission or a plain HTML form
// POST (progressive-enhancement fallback for visitors without JavaScript).
$isAjax = (
    (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
    || (!empty($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)
);

function respond($success, $message, $isAjax) {
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['success' => $success, 'message' => $message]);
    } else {
        $status = $success ? 'success' : 'error';
        header('Location: contact.html?status=' . $status);
    }
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.', $isAjax);
}

// Honeypot check — a hidden field real visitors never fill in.
// If it has a value, silently pretend success to avoid tipping off bots.
if (!empty($_POST['website'])) {
    respond(true, 'Thank you.', $isAjax);
}

// Collect and sanitize input
$fullName = isset($_POST['fullName']) ? trim(strip_tags($_POST['fullName'])) : '';
$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone    = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$company  = isset($_POST['company']) ? trim(strip_tags($_POST['company'])) : '';
$service  = isset($_POST['service']) ? trim(strip_tags($_POST['service'])) : '';
$message  = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Server-side validation (mirrors the client-side rules in script.js —
// never trust the browser alone)
$errors = [];
if (mb_strlen($fullName) < 2) $errors[] = 'Full name is required.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'A valid email address is required.';
if (!preg_match('/^[0-9+\-\s()]{10,15}$/', $phone)) $errors[] = 'A valid phone number is required.';
if ($service === '') $errors[] = 'Please select a service.';
if (mb_strlen($message) < 15) $errors[] = 'Please provide a more detailed message.';

if (!empty($errors)) {
    respond(false, implode(' ', $errors), $isAjax);
}

// Basic header-injection protection: strip any newlines a bot might try
// to inject into the "from" fields used in the email header.
$safeName  = str_replace(["\r", "\n"], '', $fullName);
$safeEmail = str_replace(["\r", "\n"], '', $email);

$subject = "New Website Enquiry — " . SITE_NAME;

$body  = "You have received a new enquiry from the website contact form.\n\n";
$body .= "Name:     $fullName\n";
$body .= "Email:    $email\n";
$body .= "Phone:    $phone\n";
$body .= "Company:  " . ($company !== '' ? $company : '-') . "\n";
$body .= "Service:  $service\n\n";
$body .= "Message:\n$message\n";

$headers   = [];
$headers[] = "From: {$safeName} <no-reply@" . ($_SERVER['SERVER_NAME'] ?? 'yourdomain.com') . ">";
$headers[] = "Reply-To: {$safeName} <{$safeEmail}>";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "X-Mailer: PHP/" . phpversion();

$sent = @mail(TO_EMAIL, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    respond(true, 'Your enquiry has been sent successfully.', $isAjax);
} else {
    respond(false, 'The message could not be sent. Please try again later or contact us directly by phone.', $isAjax);
}
