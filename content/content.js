// Scan email content when the page loads
document.addEventListener("DOMContentLoaded", async function () {
  if (isWebmail()) {
    console.log("Webmail detected. Scanning emails...");
    await scanEmails();
  }
});

// Detect if the current page is a webmail client
function isWebmail() {
  const webmailDomains = ["mail.google.com", "outlook.com", "yahoo.com"];
  return webmailDomains.some((domain) =>
    window.location.hostname.includes(domain)
  );
}

// Scan emails for malicious content
async function scanEmails() {
  const emailElements = document.querySelectorAll(
    ".email-content, .email-body"
  );
  for (const email of emailElements) {
    const emailContent = email.textContent || email.innerText;
    const result = await analyzeEmail(emailContent);

    if (!result.isSafe) {
      highlightDangerousEmail(email, result);
    }
  }
}

// Dummy function to analyze email content
async function analyzeEmail(emailContent) {
  const phishingKeywords = [
    "urgent",
    "click here",
    "free money",
    "password",
    "bank",
  ];
  const isSafe = !phishingKeywords.some((keyword) =>
    emailContent.toLowerCase().includes(keyword)
  );
  return {
    isSafe,
    message: isSafe
      ? "Email is safe!"
      : "Phishing attempt detected in email content.",
  };
}

// Highlight dangerous email
function highlightDangerousEmail(email, result) {
  email.style.border = "2px solid red";
  email.style.backgroundColor = "#ffebee";
  email.title = result.message;
}
