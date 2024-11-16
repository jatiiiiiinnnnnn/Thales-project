document.addEventListener("DOMContentLoaded", function () {
  const checkPageButton = document.getElementById("checkPage");
  const currentStatus = document.getElementById("currentStatus");

  // Check the current page when the popup opens
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentUrl = tabs[0].url;
    checkPage(currentUrl);
  });

  // Check the current page when the button is clicked
  checkPageButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url;
      checkPage(currentUrl);
    });
  });

  // Scan the page (URLs or emails)
  function checkPage(url) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      const pageUrl = currentTab.url;

      if (isWebmail(pageUrl)) {
        scanEmails(pageUrl);
      } else {
        scanUrls(pageUrl);
      }
    });
  }

  // Scan the page for URLs
  async function scanUrls(url) {
    const result = await analyzeUrl(url);
    updateStatus(result);
  }

  // Check if it's a webmail page (e.g., Gmail, Yahoo Mail)
  function isWebmail(url) {
    const webmailDomains = ["mail.google.com", "outlook.com", "yahoo.com"];
    return webmailDomains.some((domain) => url.includes(domain));
  }

  // Scan emails on the current webmail page
  async function scanEmails(url) {
    chrome.tabs.executeScript(
      { code: "document.body.innerHTML" },
      async function (result) {
        const emailContent = result[0];
        const emailElements = emailContent.match(
          /<div class="email-content">(.+?)<\/div>/g
        );

        if (emailElements) {
          let threatsFound = false;

          for (const email of emailElements) {
            const emailText = email.replace(/<[^>]*>/g, ""); // Strip HTML tags
            const analysisResult = await analyzeEmail(emailText);

            if (!analysisResult.isSafe) {
              threatsFound = true;
              showAlert("Malicious email detected!");
              break; // Stop checking further if we find a threat
            }
          }

          if (!threatsFound) {
            showAlert("All clear!! No need to worry.");
          }
        }
      }
    );
  }

  // Function to analyze email content
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
      message: isSafe ? "Email is safe!" : "Phishing attempt detected.",
    };
  }

  // Function to analyze URL
  async function analyzeUrl(url) {
    const maliciousPatterns = [
      "phishing",
      "malware",
      "virus",
      "hacker",
      "suspicious",
    ];
    const isSafe = !maliciousPatterns.some((pattern) =>
      url.toLowerCase().includes(pattern)
    );
    return {
      isSafe,
      message: isSafe ? "URL is safe!" : `Threat detected in URL: ${url}`,
    };
  }

  // Function to update popup with analysis result
  function updateStatus(result) {
    currentStatus.className = result.isSafe
      ? "status safe"
      : "status dangerous";
    currentStatus.textContent = result.message;
  }

  // Function to show alerts (email or URL threats)
  function showAlert(message) {
    currentStatus.className = "status dangerous";
    currentStatus.textContent = message;
  }
});
