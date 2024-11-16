let aiModel = null;

// Initialize AI model
async function initializeAI() {
  try {
    // Initialize Gemini AI
    const API_KEY = 'AIzaSyCqqlBH1cjrUeXblf04viXvhVP51jHdAgk';
    aiModel = new GeminiAI(API_KEY);
  } catch (error) {
    console.error('Error initializing AI:', error);
  }
}

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener(async function(details) {
  if (details.frameId === 0) { // Main frame only
    try {
      const result = await analyzeUrl(details.url);
      if (!result.isSafe) {
        showAlert(result);
        storeThreatData({
          url: details.url,
          timestamp: new Date(),
          type: 'malicious_url',
          details: result
        });
      }
    } catch (error) {
      console.error('Error analyzing URL:', error);
    }
  }
});

function showAlert(result) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'Security Alert',
    message: result.message,
    priority: 2
  });
}