import { Mode } from "@/utils/storage";
import { onMessage, type ProtocolMap } from "@/utils/messaging";
import type { ExtensionMessage, Message } from "@webext-core/messaging";

const menuId = "tweet-this-page";
const tabsToWatch = new Set<number>();

function calculateWindowPosition(
  window: chrome.windows.Window,
  newWindowHeight: number,
  newWindowWidth: number,
): { left: number; top: number } {
  const {
    height: currentWindowHeight,
    width: currentWindowWidth,
    top: windowTop,
    left: windowLeft,
  } = window;

  // skip if required values do not exist
  if (
    currentWindowHeight === undefined ||
    currentWindowWidth === undefined ||
    windowTop === undefined ||
    windowLeft === undefined
  ) {
    throw new Error("failed to calculate new window position");
  }

  // calculate new window position(center of window)
  const left = Math.round(
    windowLeft + (currentWindowWidth - newWindowWidth) / 2,
  );
  const top = Math.round(
    windowTop + (currentWindowHeight - newWindowHeight) / 2,
  );

  return { left, top };
}

function handleCloseTweetTab(
  message: Message<ProtocolMap, "closeTweetTab"> & ExtensionMessage,
) {
  const tweetTabUrl = message.sender.url || message.sender.tab?.url;
  const tweetTabId = message.sender.tab?.id;
  if (!tweetTabId || !tweetTabUrl) {
    return;
  }

  const handleHistoryStateUpdated = async ({
    tabId,
    url,
  }: chrome.webNavigation.WebNavigationTransitionCallbackDetails) => {
    // tab id must be the same as the tweet tab id
    if (tabId !== tweetTabId) {
      return;
    }
    // skip if the url is the same as the tweet tab url
    if (url === tweetTabUrl) {
      return;
    }
    // skip if the url is not opened by this extension
    if (!tabsToWatch.has(tabId)) {
      return;
    }

    const ok = await browser.tabs
      .get(tabId)
      .then(() => true)
      .catch(() => false);

    try {
      if (ok) {
        await browser.tabs.remove(tabId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      tabsToWatch.delete(tabId);

      // avoid duplicate execution
      browser.webNavigation.onHistoryStateUpdated.removeListener(
        handleHistoryStateUpdated,
      );
    }
  };

  browser.webNavigation.onHistoryStateUpdated.addListener(
    handleHistoryStateUpdated,
  );
}

async function handleIsMac(): Promise<boolean> {
  const { os } = await browser.runtime.getPlatformInfo();
  return os === "mac";
}

export default defineBackground(() => {
  onMessage("closeTweetTab", handleCloseTweetTab);
  onMessage("isMac", handleIsMac);

  // register context menu when installed
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.removeAll();

    browser.contextMenus.create({
      id: menuId,
      title: i18n.t("menuItemTweetThisPage"),
    });
  });

  // register context menu behavior
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    // skip if the context menu clicked was not for this extension
    if (info.menuItemId !== menuId || tab === undefined) {
      return;
    }

    const { title, url, windowId } = tab;
    // target url(current page url) is required
    if (url === undefined) {
      return;
    }

    const {
      mode,
      prefixWord,
      enablePrefix,
      windowHeight: newWindowHeight,
      windowWidth: newWindowWidth,
    } = await getOptions();
    const prefix = enablePrefix ? prefixWord : "";

    // create tweet page url for new tab or window
    const tweetUrl = `https://x.com/intent/post?url=${encodeURIComponent(
      url,
    )}&text=${encodeURIComponent(prefix)}${
      title !== undefined ? encodeURIComponent(title) : ""
    }`;

    const handleTabsRemoved = (tabId: number) => {
      if (tabsToWatch.has(tabId)) {
        tabsToWatch.delete(tabId);
      }
      if (tabsToWatch.size === 0) {
        browser.tabs.onRemoved.removeListener(handleTabsRemoved);
      }
    };

    switch (mode) {
      case Mode.Tab: {
        const tab = await browser.tabs.create({ url: tweetUrl });
        if (tab.id) {
          tabsToWatch.add(tab.id);
          browser.tabs.onRemoved.addListener(handleTabsRemoved);
        }
        break;
      }
      case Mode.Window: {
        const createData: chrome.windows.CreateData = {
          url: tweetUrl,
          type: "popup",
          width: newWindowWidth,
          height: newWindowHeight,
          focused: true,
        };

        browser.windows.get(windowId, async (currentWindow) => {
          try {
            const { left, top } = calculateWindowPosition(
              currentWindow,
              newWindowHeight,
              newWindowWidth,
            );
            createData.left = left;
            createData.top = top;
          } finally {
            const win = await browser.windows.create(createData);
            if (win.tabs && win.tabs.length > 0) {
              for (const tab of win.tabs) {
                if (tab.id) {
                  tabsToWatch.add(tab.id);
                }
              }
              browser.tabs.onRemoved.addListener(handleTabsRemoved);
            }
          }
        });
        break;
      }
      default: {
        // nothing to do
      }
    }
  });
});
