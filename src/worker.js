console.log("AutoTone service worker loaded");

// Reload the youtube tab to execute the contentScript
chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
  for (let tab of tabs) {
    chrome.tabs.reload(tab.id);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Service worker received message:", msg);
  
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

function adjustSpotifyVolume(volumeLevel) {
  console.log("Adjusting Spotify volume to:", volumeLevel);
  
  chrome.tabs.query({ url: "*://*.spotify.com/*" }, (tabs) => {
    for (let tab of tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (volume) => {
          // This selector is specific to Spotify's web player
          // If Spotify changes their DOM, this may need to be updated
          // Or this have to be adjusted to support other platforms
          const volumeInput = document.querySelector('[data-testid="volume-bar"] .hidden-visually input');

          volumeInput.value = volume;

          volumeInput.dispatchEvent(new Event("input", { bubbles: true }));
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