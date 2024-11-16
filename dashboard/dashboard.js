document.addEventListener("DOMContentLoaded", function () {
  loadThreatHistory();
});

// Load and display threat history
function loadThreatHistory() {
  chrome.storage.local.get(["threatHistory"], function (data) {
    const threats = data.threatHistory || [];
    updateThreatHistory(threats);
    updateStats(threats);
  });
}

// Update threat stats
function updateStats(threats) {
  const totalThreats = threats.length;
  const threatTypes = threats.reduce((acc, threat) => {
    acc[threat.type] = (acc[threat.type] || 0) + 1;
    return acc;
  }, {});

  document.getElementById("totalThreats").innerHTML = `
        <h3>Total Threats Detected</h3>
        <p>${totalThreats}</p>
    `;

  const threatsByTypeHtml = Object.entries(threatTypes)
    .map(([type, count]) => `<p>${type}: ${count}</p>`)
    .join("");
  document.getElementById("threatsByType").innerHTML = `
        <h3>Threats by Type</h3>
        ${threatsByTypeHtml}
    `;
}

// Populate threat history table
function updateThreatHistory(threats) {
  const tbody = document.getElementById("threatHistory").querySelector("tbody");
  tbody.innerHTML = threats
    .map(
      (threat) => `
        <tr>
            <td>${new Date(threat.timestamp).toLocaleString()}</td>
            <td>${threat.type}</td>
            <td>${threat.url}</td>
            <td>${threat.details}</td>
        </tr>
    `
    )
    .join("");
}
