chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ adsEnabled: true });
  });
  
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (typeof message.adsEnabled !== 'undefined') {
      chrome.storage.local.set({ adsEnabled: message.adsEnabled }, () => {
        sendResponse({ success: true });
      });
      return true;
    }
});