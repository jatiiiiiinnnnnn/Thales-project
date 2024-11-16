// Monitor for email content
document.addEventListener('DOMContentLoaded', function() {
    // Check if current page is a webmail client
    if (isWebmail()) {
      scanEmails();
    }
  });
  
  function isWebmail() {
    const webmailDomains = ['mail.google.com', 'outlook.com', 'yahoo.com'];
    return webmailDomains.some(domain => window.location.hostname.includes(domain));
  }
  
  async function scanEmails() {
    const emailElements = document.querySelectorAll('.email-content');
    for (const email of emailElements) {
      const emailContent = extractEmailContent(email);
      const result = await analyzeEmail(emailContent);
      if (!result.isSafe) {
        highlightDangerousEmail(email, result);
      }
    }
  }
  