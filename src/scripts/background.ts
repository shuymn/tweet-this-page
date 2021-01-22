const MenuId = {
  TweetThisPage: "tweet-this-page",
} as const;

// Register context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "tweet-this-page",
    title: chrome.i18n.getMessage("menuItemTweetThisPage"),
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MenuId.TweetThisPage && tab !== undefined) {
    const { title, url } = tab;
    if (url !== undefined) {
      chrome.tabs.create({ url: buildTweetUrl(url, title) });
    }
  }
});

const buildTweetUrl = (url: string, title?: string): string =>
  "https://twitter.com/intent/tweet?url=" +
  encodeURIComponent(url) +
  "&text=" +
  encodeURIComponent("NowBrowsing: ") +
  (title !== undefined ? encodeURIComponent(title) : "");
