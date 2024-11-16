document.addEventListener("DOMContentLoaded", function () {
  const checkPageButton = document.getElementById("checkPage");
  const viewDashboardButton = document.getElementById("viewDashboard");
  const currentStatus = document.getElementById("currentStatus");

  // Check current page when popup opens
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentUrl = tabs[0].url;
    checkUrl(currentUrl);
  });

  checkPageButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url;
      checkUrl(currentUrl);
    });
  });

  viewDashboardButton.addEventListener("click", function () {
    chrome.tabs.create({ url: "dashboard/dashboard.html" });
  });

  async function checkUrl(url) {
    try {
      const result = await analyzeUrl(url);
      updateStatus(result);
    } catch (error) {
      currentStatus.className = "status dangerous";
      currentStatus.textContent = "Error checking URL: " + error.message;
    }
  }

  function updateStatus(result) {
    currentStatus.className = result.isSafe
      ? "status safe"
      : "status dangerous";
    currentStatus.textContent = result.message;
  }
});
