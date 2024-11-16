document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    initializeCharts();
  });
  
  async function loadDashboardData() {
    const threats = await getThreatHistory();
    updateStats(threats);
    updateThreatHistory(threats);
  }
  
  function updateStats(threats) {
    const totalThreats = threats.length;
    const threatTypes = threats.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {});
  
    document.getElementById('totalThreats').innerHTML = `
      <h3>Total Threats Detected</h3>
      <p class="stat-number">${totalThreats}</p>
    `;
  
    const threatsByTypeHtml = Object.entries(threatTypes)
      .map(([type, count]) => `<p>${type}: ${count}</p>`)
      .join('');
  
    document.getElementById('threatsByType').innerHTML = `
      <h3>Threats by Type</h3>
      ${threatsByTypeHtml}
    `;
  }