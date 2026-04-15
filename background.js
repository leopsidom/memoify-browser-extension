const SHARE_BASE = "https://memoify.com/share";
const MENU_ID = "memoify-share";
const MAX_TEXT = 200_000;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Share to Memoify",
    contexts: ["page", "selection", "link", "image", "video", "audio"],
  });
});

const capturePageText = async (tabId) => {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => document.body?.innerText ?? "",
    });
    const text = result?.result;
    if (typeof text !== "string" || !text.trim()) return null;
    return text.length > MAX_TEXT ? text.slice(0, MAX_TEXT) : text;
  } catch {
    // chrome:// pages, PDF viewers, and other restricted contexts reject
    // scripting. Fall back to URL-only behavior.
    return null;
  }
};

const openShare = (params) => {
  chrome.windows.create({
    url: `${SHARE_BASE}?${params.toString()}`,
    type: "popup",
    width: 480,
    height: 720,
  });
};

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID) return;

  let url;
  let text;
  let title;

  if (info.srcUrl) {
    url = info.srcUrl;
    title = tab?.title;
  } else if (info.selectionText) {
    text = info.selectionText;
    url = info.pageUrl || tab?.url;
    title = tab?.title;
  } else if (info.linkUrl) {
    url = info.linkUrl;
    title = info.selectionText || tab?.title;
  } else {
    url = info.pageUrl || tab?.url;
    title = tab?.title;
    // No selection, no src/link — user wants the whole page. Scrape its
    // visible text so auth-gated pages (Gmail, private docs) can still be
    // summarized; the edge function has no cookies, but the extension does.
    if (tab?.id != null) {
      const scraped = await capturePageText(tab.id);
      if (scraped) text = scraped;
    }
  }

  const params = new URLSearchParams();
  if (url) params.set("url", url);
  if (title) params.set("title", title);
  if (text) params.set("text", text);

  openShare(params);
});
