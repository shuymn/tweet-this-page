import { getOptions } from "./lib/options";
import { setBoolean, setValue } from "./lib/storage";
import { Message, Action, Mode, MenuId } from "./lib/utils";

// handle sending and receiving data between scripts
chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    switch (message.action) {
      // popup -> background -> popup
      case Action.GetOptions: {
        sendResponse({ data: getOptions() });
        break;
      }
      // popup -> background(-> local storage of background)
      case Action.SetMode: {
        // check null or undefined
        if (message.params?.mode != null) {
          setValue("mode", message.params.mode);
        }
        break;
      }
      // popup -> background(-> local storage of background)
      case Action.SetPrefixWord: {
        if (message.params?.prefix != null) {
          setValue("prefix_word", message.params.prefix);
        }
        break;
      }
      // popup -> background(-> local storage of background)
      case Action.SetEnablePrefix: {
        if (message.params?.enable != null) {
          setBoolean("enable_prefix", message.params.enable as boolean);
        }
        break;
      }
      // popup -> background(-> local storage of background)
      case Action.SetEnableAutoClose: {
        if (message.params?.enable != null) {
          setBoolean("enable_auto_close", message.params.enable as boolean);
        }
        break;
      }
      default: {
        // nothing to do
      }
    }
  }
);

// register context menu when installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "tweet-this-page",
    title: chrome.i18n.getMessage("menuItemTweetThisPage"),
  });
});

// register context menu behavior
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // skip if the context menu clicked was not for this extension
  if (info.menuItemId !== MenuId.TweetThisPage || tab === undefined) {
    return;
  }

  const { title, url, windowId } = tab;
  // target url(current page url) is required
  if (url === undefined) {
    return;
  }

  const {
    mode,
    enablePrefix,
    prefixWord,
    enableAutoClose,
    windowHeight: newWindowHeight,
    windowWidth: newWindowWidth,
  } = getOptions();
  const prefix = enablePrefix ? prefixWord : "";

  // create tweet page url for new tab or window
  const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(prefix)}${
    title !== undefined ? encodeURIComponent(title) : ""
  }`;

  switch (mode) {
    case Mode.Tab: {
      chrome.tabs.create({ url: tweetUrl }, ({ id: tabId }) => {
        if (!enableAutoClose || tabId === undefined) {
          return;
        }
        // close tab after tweeting if the feature is enabled
        closeTweetTab(tabId);
      });
      break;
    }
    case Mode.Window:
      {
        const createData: chrome.windows.CreateData = {
          url: tweetUrl,
          type: "popup",
          width: newWindowWidth,
          height: newWindowHeight,
          focused: true,
        };

        chrome.windows.get(windowId, (currentWindow) => {
          try {
            const { left, top } = calculateWindowPosition(
              currentWindow,
              newWindowHeight,
              newWindowWidth
            );
            createData.left = left;
            createData.top = top;
          } finally {
            chrome.windows.create(createData, (newWindow) => {
              if (
                !enableAutoClose ||
                newWindow === undefined ||
                newWindow.tabs === undefined
              ) {
                return;
              }

              const { tabs } = newWindow;
              const tab = tabs.find(
                (tab) => tab.active && tab.id !== undefined
              );
              if (tab === undefined || tab.id === undefined) {
                return;
              }
              // close tab after tweeting if the feature is enabled
              closeTweetTab(tab.id);
            });
          }
        });
      }
      break;
    default: {
      // nothing to do
    }
  }
});

const calculateWindowPosition = (
  window: chrome.windows.Window,
  newWindowHeight: number,
  newWindowWidth: number
): { left: number; top: number } => {
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
    windowLeft + (currentWindowWidth - newWindowWidth) / 2
  );
  const top = Math.round(
    windowTop + (currentWindowHeight - newWindowHeight) / 2
  );

  return { left, top };
};

const closeTweetTab = (tweetTabId: number) => {
  const handleTabUpdate = (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo
  ) => {
    // wait for loading tweet page
    if (tabId !== tweetTabId || changeInfo.status !== "complete") {
      return;
    }

    // send a message to content script to observe clicking tweet button
    const message: Message = {
      action: Action.ObserveTweetButton,
    };
    chrome.tabs.sendMessage(tabId, message);

    // avoid duplicate execution
    chrome.tabs.onUpdated.removeListener(handleTabUpdate);
  };

  const handleHistoryStateUpdate = ({
    tabId,
  }: chrome.webNavigation.WebNavigationTransitionCallbackDetails) => {
    if (tabId !== tweetTabId) {
      return;
    }

    // send a message to content script to confirm that it can be closed
    const message: Message = {
      action: Action.CloseTweetTab,
    };
    chrome.tabs.sendMessage(tabId, message, ({ close }) => {
      if (close) {
        chrome.tabs.remove(tabId);
      }
    });

    // avoid duplicate execution
    chrome.webNavigation.onHistoryStateUpdated.removeListener(
      handleHistoryStateUpdate
    );
  };

  chrome.tabs.onUpdated.addListener(handleTabUpdate);
  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleHistoryStateUpdate
  );
};
