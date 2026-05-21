let isActive = false;
let savedUrl = '';

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['liveUrl', 'isActive'], function(result) {
    if (result.liveUrl) {
      document.getElementById('liveUrl').value = result.liveUrl;
      savedUrl = result.liveUrl;
    }
    if (result.isActive) {
      isActive = result.isActive;
      updateUI();
    }
  });
});

document.getElementById('saveBtn').addEventListener('click', function() {
  const url = document.getElementById('liveUrl').value.trim();
  
  if (!url) {
    alert('Please enter a TikTok live URL');
    return;
  }
  
  if (!url.includes('tiktok.com')) {
    alert('Invalid TikTok URL');
    return;
  }
  
  savedUrl = url;
  chrome.storage.local.set({ liveUrl: url }, function() {
    alert('✅ Link save ho gayi!');
  });
});

document.getElementById('toggleBtn').addEventListener('click', function() {
  if (!savedUrl) {
    alert('❌ Pehle live link save karein!');
    return;
  }
  
  isActive = !isActive;
  chrome.storage.local.set({ isActive: isActive }, function() {
    updateUI();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggle',
          isActive: isActive,
          url: savedUrl
        });
      }
    });
  });
});

function updateUI() {
  const toggleBtn = document.getElementById('toggleBtn');
  const statusText = document.getElementById('statusText');
  
  if (isActive) {
    toggleBtn.textContent = '🟢 Extension Chalu Hai';
    toggleBtn.classList.add('active');
    statusText.textContent = 'Chalu hai ✅';
  } else {
    toggleBtn.textContent = '🔴 Extension Chalu Karein';
    toggleBtn.classList.remove('active');
    statusText.textContent = 'Band hai ❌';
  }
}
