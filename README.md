# Memoify Chrome Extension

Right-click → **Share to Memoify**. Opens a popup window that hands off the page/link/selection/image to `https://memoify.com/share`.

## Load unpacked

1. Open `chrome://extensions`.
2. Toggle **Developer mode** (top right).
3. Click **Load unpacked** and select this `chrome-extension/` folder.
4. Right-click anywhere on a page, link, selection, or image → **Share to Memoify**.

## Payload precedence

On click, the most specific target wins:

1. Image/video/audio → `url = srcUrl`
2. Selected text → `text = selection`, `url = pageUrl`
3. Link → `url = linkUrl`
4. Page (fallback) → `url = pageUrl`

## Icons

`icons/icon-{16,48,128}.png` are placeholders — drop in real assets when ready.
