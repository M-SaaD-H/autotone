document.addEventListener('DOMContentLoaded', function() {
  const lowVolumeSlider = document.getElementById('lowVolume');
  const highVolumeSlider = document.getElementById('highVolume');
  const lowVolumeDisplay = document.getElementById('lowVolumeDisplay');
  const highVolumeDisplay = document.getElementById('highVolumeDisplay');
  const saveButton = document.getElementById('saveSettings');
  const statusDiv = document.getElementById('status');
  const extensionToggle = document.getElementById('extensionEnabled');
  const doPauseToggle = document.getElementById('doPause');

  const volumeControls = document.getElementsByClassName('volume-control');

  // Load saved settings
  chrome.storage.sync.get(['lowVolume', 'highVolume', 'enabled', 'doPause'], function(result) {
    if (result.lowVolume !== undefined) {
      lowVolumeSlider.value = result.lowVolume;
      lowVolumeDisplay.textContent = result.lowVolume + '%';
    }
    if (result.highVolume !== undefined) {
      highVolumeSlider.value = result.highVolume;
      highVolumeDisplay.textContent = result.highVolume + '%';
    }
    if (result.enabled !== undefined) {
      extensionToggle.checked = result.enabled;
    }
    if (result.doPause !== undefined) {
      doPauseToggle.checked = result.doPause;
    }

    console.log("volumeControls:", volumeControls)

    Array.from(volumeControls).forEach(element => {
      if (result.doPause) {
        element.classList.add("hidden");
      } else {
        element.classList.remove("hidden");
      }
    });
  });

  // Update displays when sliders change
  lowVolumeSlider.addEventListener('input', function() {
    lowVolumeDisplay.textContent = this.value + '%';
  });

  highVolumeSlider.addEventListener('input', function() {
    highVolumeDisplay.textContent = this.value + '%';
  });

  // Handle Pause toggle
  doPauseToggle.addEventListener('change', function() {
    const doPause = this.checked;

    chrome.storage.sync.set({ doPause: doPause }, function() {
      statusDiv.textContent = enabled ? 'AutoTone enabled!' : 'AutoTone disabled!';
      statusDiv.style.background = enabled ? '#d4edda' : '#f8d7da';
      statusDiv.style.color = enabled ? '#155724' : '#721c24';
      
      setTimeout(() => {
        statusDiv.textContent = 'Settings will be saved automatically';
        statusDiv.style.background = '#d2f4e4';
        statusDiv.style.color = '#000';
      }, 2000);
    });
  })

  // Handle extension toggle
  extensionToggle.addEventListener('change', function() {
    const enabled = this.checked;
    chrome.storage.sync.set({ enabled: enabled }, function() {
      statusDiv.textContent = enabled ? 'AutoTone enabled!' : 'AutoTone disabled!';
      statusDiv.style.background = enabled ? '#d4edda' : '#f8d7da';
      statusDiv.style.color = enabled ? '#155724' : '#721c24';
      
      setTimeout(() => {
        statusDiv.textContent = 'Settings will be saved automatically';
        statusDiv.style.background = '#d2f4e4';
        statusDiv.style.color = '#000';
      }, 2000);
    });
  });

  // Save settings when sliders change
  function saveSettings() {
    const settings = {
      lowVolume: parseInt(lowVolumeSlider.value),
      highVolume: parseInt(highVolumeSlider.value),
      enabled: extensionToggle.checked,
      pause: doPauseToggle.checked
    };

    chrome.storage.sync.set(settings, function() {
      statusDiv.textContent = 'Settings saved!';
      statusDiv.style.background = '#d4edda';
      statusDiv.style.color = '#155724';
      
      setTimeout(() => {
        statusDiv.textContent = 'Settings will be saved automatically';
        statusDiv.style.background = '#d2f4e4';
        statusDiv.style.color = '#000';
      }, 2000);
    });
  }

  // Save on slider change
  lowVolumeSlider.addEventListener('change', saveSettings);
  highVolumeSlider.addEventListener('change', saveSettings);
  
  // Save on button click
  saveButton.addEventListener('click', saveSettings);
}); 