const video = document.querySelector("video");

if (video) {
  console.log("got the video:", video)
  video.addEventListener("play", () => {
    console.log("video play")
    chrome.runtime.sendMessage({ event: "youtube_play" });
  });
  video.addEventListener('pause', () => {
    console.log("video pause")
    chrome.runtime.sendMessage({ event: "youtube_pause" });
  });
}

// chrome.runtime.sendMessage({test: "hello from content script"}, response => {
//   console.log("Background responded:", response);
// });