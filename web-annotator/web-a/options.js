document.getElementById('save-btn').addEventListener('click', function() {
    let color = document.getElementById('highlight-color').value;
    chrome.storage.sync.set({ highlightColor: color });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get('highlightColor', function(data) {
      if (data.highlightColor) {
        document.getElementById('highlight-color').value = data.highlightColor;
      }
    });
  });
  