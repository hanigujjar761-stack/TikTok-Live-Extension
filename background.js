chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('tiktok.com')) {
    chrome.storage.local.get(['liveUrl', 'isActive'], function(result) {
      if (result.isActive && result.liveUrl) {
        if (tab.url !== result.liveUrl && tab.url.includes('/live')) {
          setTimeout(function() {
            chrome.tabs.update(tabId, { url: result.liveUrl });
          }, 1000);
        }
      }
    });
  }
});
