document.addEventListener("DOMContentLoaded", function () {
  const checkPageButton = document.getElementById("checkPage");
  const viewDashboardButton = document.getElementById("viewDashboard");
  const currentStatus = document.getElementById("currentStatus");

  // Check current page URL when popup opens
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentUrl = tabs[0].url;
    checkUrl(currentUrl);
  });

  // Check the current page URL when the button is clicked
  checkPageButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url;
      checkUrl(currentUrl);
    });
  });

  // Open the dashboard
  viewDashboardButton.addEventListener("click", function () {
    chrome.tabs.create({
      url: chrome.runtime.getURL("dashboard/dashboard.html"),
    });
  });

  // Analyze URL
  async function checkUrl(url) {
    chrome.runtime.sendMessage(
      { type: "analyzeUrl", url },
      function (response) {
        if (response && response.isSafe !== undefined) {
          updateStatus(response);
        } else {
          currentStatus.className = "status dangerous";
          currentStatus.textContent = "Error checking URL!";
        }
      }
    );
  }

  // Update popup UI with analysis result
  function updateStatus(result) {
    currentStatus.className = result.isSafe
      ? "status safe"
      : "status dangerous";
    currentStatus.textContent = result.message;
  }
});
