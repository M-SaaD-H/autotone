// Function to set up video event listeners
function setupVideoListeners(video) {
  if (video && !video.hasAttribute("data-autotone-initialized")) {
    video.setAttribute("data-autotone-initialized", "true");
    
    video.addEventListener("play", () => {
      console.log("video play");
      chrome.runtime.sendMessage({ event: "youtube_play" });
    });
    
    video.addEventListener("pause", () => {
      console.log("video pause");
      chrome.runtime.sendMessage({ event: "youtube_pause" });
    });

    video.pause();
  }
}

// Function to find and set up all video elements
function findAndSetupVideos() {
  const videos = document.querySelectorAll("video");
  videos.forEach(video => setupVideoListeners(video));
}

// Set up initial videos
findAndSetupVideos();

// Use MutationObserver to detect when new video elements are added
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // Check for added nodes
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Check if the added node is a video
        if (node.tagName === "VIDEO") {
          setupVideoListeners(node);
        }
        // Check if the added node contains videos
        const videos = node.querySelectorAll ? node.querySelectorAll("video") : [];
        videos.forEach(video => setupVideoListeners(video));
      }
    });
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Also check periodically for videos that might have been missed
setInterval(() => {
  findAndSetupVideos();
}, 2000);