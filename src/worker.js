console.log("AutoDucker service worker loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Service worker received message:", msg);
  
  if (msg.event === "youtube_play") {
    adjustSpotifyVolume(0.3); // Lower the volume to 30%
  } else if (msg.event === "youtube_pause") {
    adjustSpotifyVolume(1); // Increase the volume back to 100%
  }
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