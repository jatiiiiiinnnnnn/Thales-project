let aiModel = null;

// Dummy function to simulate AI-based threat analysis
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

// Initialize AI model (if Gemini AI or any external API is used)
async function initializeAI() {
  try {
    // Gemini AI placeholder: Integrate your actual API initialization here
    console.log("AI model initialized!");
  } catch (error) {
    console.error("Error initializing AI model:", error);
  }
}

// Proactively monitor navigation and analyze URLs
chrome.webNavigation.onBeforeNavigate.addListener(async function (details) {
  if (details.frameId === 0) {
    // Only analyze the main frame
    try {
      const result = await analyzeUrl(details.url);
      if (!result.isSafe) {
        // Notify user about the malicious URL
        showAlert(result.message);
        storeThreatData({
          url: details.url,
          timestamp: new Date(),
          type: "malicious_url",
          details: result.message,
        });
      }
    } catch (error) {
      console.error("Error analyzing URL:", error);
    }
  }
});

// Notification for detected threats
function showAlert(message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: "Security Alert",
    message,
    priority: 2,
  });
}

// Threat data storage (stored locally)
function storeThreatData(threat) {
  chrome.storage.local.get(["threatHistory"], function (data) {
    const threatHistory = data.threatHistory || [];
    threatHistory.push(threat);
    chrome.storage.local.set({ threatHistory });
  });
}

// Initialize the AI model
initializeAI();
