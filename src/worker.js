console.log("AutoTone service worker loaded");

// Reload the youtube tab to execute the contentScript
// Only reload YouTube tabs once, when the service worker is first loaded
// if (!globalThis._autotone_youtube_reloaded) {
//   chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
//     for (let tab of tabs) {
//       chrome.tabs.reload(tab.id);
//     }

//     globalThis._autotone_youtube_reloaded = true;
//   });
// }

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Service worker received message:", msg);

  // Check if extension is enabled before processing events
  chrome.storage.sync.get(['enabled'], function (result) {
    const enabled = result.enabled !== undefined ? result.enabled : true; // Default to enabled

    if (!enabled) {
      console.log("AutoTone is disabled, ignoring event:", msg.event);
      return;
    }

    chrome.storage.sync.get(['doPause'], function (result) {
      const doPause = result.doPause !== undefined ? result.doPause : "false";

      console.log("doPause:", doPause)

      if (msg.event === "youtube_play") {
        // Get low volume setting from storage
        chrome.storage.sync.get(['lowVolume'], function (result) {
          const lowVolume = result.lowVolume !== undefined ? result.lowVolume / 100 : 0.3;
          adjustSpotifyVolume(lowVolume, doPause);
          adjustYtMusicVolume(lowVolume, doPause);
        });
      } else if (msg.event === "youtube_pause") {
        // Get high volume setting from storage
        chrome.storage.sync.get(['highVolume'], function (result) {
          const highVolume = result.highVolume !== undefined ? result.highVolume / 100 : 1.0;
          adjustSpotifyVolume(highVolume, doPause);
          adjustYtMusicVolume(highVolume, doPause);
        });
      }
    });
  });
});

function adjustSpotifyVolume(volumeLevel, doPause) {
  console.log("Adjusting Spotify volume to:", volumeLevel);

  chrome.tabs.query({ url: "*://*.spotify.com/*" }, (tabs) => {
    console.log("Found Spotify tabs:", tabs.length);

    for (let tab of tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (volume, doPause) => {
          if (doPause) {
            const pauseToggleButton = document.querySelector('[data-testid="control-button-playpause"]');
            pauseToggleButton.dispatchEvent(new Event('click', { bubbles: true }));

            return;
          }

          const volumeInput = document.querySelector('[data-testid="volume-bar"] .hidden-visually input');

          volumeInput.value = volume;

          volumeInput.dispatchEvent(new Event("input", { bubbles: true }));
          volumeInput.dispatchEvent(new Event("change", { bubbles: true }));
        },
        args: [volumeLevel, doPause]
      }).then((results) => {
        console.log("Volume adjustment result:", results);
      }).catch((error) => {
        console.error("Error adjusting volume:", error);
      });
    }
  });
}

function adjustYtMusicVolume(volumeLevel, doPause) {
  console.log("Adjusting YT Music volume to:", volumeLevel);

  chrome.tabs.query({ url: "*://music.youtube.com/*" }, (tabs) => {
    console.log("Found YT Music tabs:", tabs.length);

    for (let tab of tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (volume, doPause) => {
          if (doPause) {
            const pauseToggleButton = document.querySelector('#play-pause-button');
            pauseToggleButton.dispatchEvent(new Event('click', { bubbles: true }));

            return;
          }

          // Decreasing the volume is not working
          const volumeInput = document.querySelector('#volume-slider');
          console.log("volumeInput:", volumeInput)

          volumeInput.value = volume;

          volumeInput.dispatchEvent(new Event("input", { bubbles: true }));
          volumeInput.dispatchEvent(new Event("change", { bubbles: true }));
        },
        args: [volumeLevel, doPause]
      }).then((results) => {
        console.log("Volume adjustment result:", results);
      }).catch((error) => {
        console.error("Error adjusting volume:", error);
      });
    }
  });
}