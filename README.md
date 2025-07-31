# AutoTone 🔊

AutoTone is a smart, minimal browser extension that **automatically keeps your audio volume steady and comfortable across tabs**. For example, if you're listening to Spotify and start playing a YouTube video, AutoTone will lower Spotify’s volume and restore it when the video stops, no manual fiddling required.

---

## 🚀 Features

- 🧠 **Automatic detection** of YouTube audio playback
- 🎵 **Dynamically adjusts** Spotify tab volume in real time
- 🔇 **Reduces distractions**—no user intervention needed
- ⚡ **Lightweight**, privacy-friendly, and fully open source

---

## 🛠️ Manual Installation (Chrome)

AutoTone isn’t on the Chrome Web Store yet, but you can install it locally:

1. **Clone or download this repository:**
   ```bash
   git clone https://github.com/M-SaaD-H/autotone.git
   cd autotone
   ```
2. **Open Chrome or any other browser** and go to `chrome://extensions/`
3. **Enable Developer mode** (toggle in the top right)
4. **Click "Load unpacked"**
5. **Select the folder** where you cloned/extracted this repo
6. You should now see the AutoTone icon in your extensions bar!

---

## ⚙️ How Does It Work?

AutoTone uses Chrome Extension APIs to monitor and communicate between your browser tabs, automatically controlling the volume of media elements (like YouTube and Spotify) in real time.

---

## 🧩 Permissions Required

- `"tabs"` – to find and monitor Spotify/YouTube tabs
- `"scripting"` – to inject and run volume control scripts
- `"activeTab"` – to interact with the currently focused tab

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** this repository (via GitHub UI or):
   ```bash
   gh repo fork M-SaaD-H/autotone
   ```
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/autotone.git
   cd autotone
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "Describe your changes"
   ```
5. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a pull request** on GitHub

> **Tip:** For major changes, please open an issue first to discuss your ideas.

---

## 🔒 Privacy

AutoTone does **not** collect or transmit any personal data. All logic runs locally in your browser and only interacts with media elements on the pages you visit.

---

If you find this project useful, please consider giving it a ⭐ on [GitHub](https://github.com/M-SaaD-H/autotone)!

AutoTone is licensed under the [Creative Commons Attribution-NonCommercial 4.0 License](./LICENSE).