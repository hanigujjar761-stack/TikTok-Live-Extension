let targetUrl = '';
let isMonitoring = false;
let checkInterval = null;

chrome.storage.local.get(['liveUrl', 'isActive'], function(result) {
  if (result.liveUrl) {
    targetUrl = result.liveUrl;
  }
  if (result.isActive) {
    isMonitoring = true;
    startMonitoring();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggle') {
    isMonitoring = request.isActive;
    targetUrl = request.url;
    
    if (isMonitoring) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
  }
});

function startMonitoring() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  
  checkInterval = setInterval(function() {
    const currentUrl = window.location.href;
    
    if (currentUrl !== targetUrl && currentUrl.includes('tiktok.com')) {
      if (currentUrl.includes('/live') && !currentUrl.includes(targetUrl)) {
        console.log('Different live detected, returning to saved live...');
        window.location.href = targetUrl;
      }
    }
  }, 2000);
  
  console.log('TikTok Live Auto Return: Monitoring started');
}

function stopMonitoring() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  console.log('TikTok Live Auto Return: Monitoring stopped');
}

window.addEventListener('beforeunload', function() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
});
