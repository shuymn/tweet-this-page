chrome.contextMenus.create({
  id: "tweet-this-page",
  title: chrome.i18n.getMessage("menuItemTweetThisPage"),
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab === undefined) {
    return;
  }

  const { title, url } = tab;
  if (url !== undefined) {
    chrome.tabs.create({ url: buildTweetUrl(url, title) });
  }
});

const buildTweetUrl = (url: string, title?: string): string =>
  "https://twitter.com/intent/tweet?url=" +
  encodeURIComponent(url) +
  "&text=" +
  encodeURIComponent("NowBrowsing: ") +
  (title !== undefined ? encodeURIComponent(title) : "");
