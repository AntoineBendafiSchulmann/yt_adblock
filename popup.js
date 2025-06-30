document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('toggle');
  
    chrome.storage.local.get(['adsEnabled'], (result) => {
      checkbox.checked = result.adsEnabled !== false;
    });
  
    checkbox.addEventListener('change', () => {
      const value = checkbox.checked;
      chrome.storage.local.set({ adsEnabled: value }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.runtime.sendMessage({ adsEnabled: value }, () => {
              chrome.tabs.reload(tabs[0].id);
              window.close();
            });
          }
        });
      });
    });
});
