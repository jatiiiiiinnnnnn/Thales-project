class StorageService {
    static async storeThreat(threat) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['threats'], function(result) {
          const threats = result.threats || [];
          threats.push(threat);
          chrome.storage.local.set({ threats: threats }, function() {
            resolve();
          });
        });
      });
    }
  
    static async getThreatHistory() {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(['threats'], function(result) {
          resolve(result.threats || []);
        });
      });
    }
  
    static async clearHistory() {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set({ threats: [] }, function() {
          resolve();
        });
      });
    }
  }
  