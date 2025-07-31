console.log("AutoDucker service worker loaded");

// Reload the youtube tab to execute the contentScript
chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
  for (let tab of tabs) {
    chrome.tabs.reload(tab.id);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Service worker received message:", msg);
  
  // Check if extension is enabled before processing events
  chrome.storage.sync.get(['enabled'], function(result) {
    const enabled = result.enabled !== undefined ? result.enabled : true; // Default to enabled
    
    if (!enabled) {
      console.log("AutoTone is disabled, ignoring event:", msg.event);
      return;
    }
    
    if (msg.event === "youtube_play") {
      // Get low volume setting from storage
      chrome.storage.sync.get(['lowVolume'], function(result) {
        const lowVolume = result.lowVolume !== undefined ? result.lowVolume / 100 : 0.3;
        adjustSpotifyVolume(lowVolume);
      });
    } else if (msg.event === "youtube_pause") {
      // Get high volume setting from storage
      chrome.storage.sync.get(['highVolume'], function(result) {
        const highVolume = result.highVolume !== undefined ? result.highVolume / 100 : 1.0;
        adjustSpotifyVolume(highVolume);
      });
    }
  });
});

function adjustSpotifyVolume(volumeLevel) {
  console.log("Adjusting Spotify volume to:", volumeLevel);
  
  chrome.tabs.query({ url: "*://*.spotify.com/*" }, (tabs) => {
    console.log("Found Spotify tabs:", tabs.length);
    
    for (let tab of tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (volume) => {
          const volumeInput = document.querySelector('[data-testid="volume-bar"] .hidden-visually input');
          console.log("volumeInput:", volumeInput);

          console.log("volume =", volume)
          volumeInput.value = volume;

          console.log("new volumeInput.value =", volumeInput.value)
          volumeInput.dispatchEvent(new Event("input", { bubbles: true }));
          console.log("done")
        },
        args: [volumeLevel]
      }).then((results) => {
        console.log("Volume adjustment result:", results);
      }).catch((error) => {
        console.error("Error adjusting volume:", error);
      });
    }
  });
}