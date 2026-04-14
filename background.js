const SHARE_BASE = "https://memoify.com/share";
const MENU_ID = "memoify-share";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Share to Memoify",
    contexts: ["page", "selection", "link", "image", "video", "audio"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
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
  }

  const params = new URLSearchParams();
  if (url) params.set("url", url);
  if (title) params.set("title", title);
  if (text) params.set("text", text);

  chrome.windows.create({
    url: `${SHARE_BASE}?${params.toString()}`,
    type: "popup",
    width: 480,
    height: 720,
  });
});
