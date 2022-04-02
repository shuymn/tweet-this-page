import { Action, Message } from "./lib/utils";

type State = {
  clicked: boolean;
};

// status of tweet
const state: State = {
  clicked: false,
};

// handle sending and receiving data between scripts
chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    switch (message.action) {
      // background -> content
      case Action.ObserveTweetButton: {
        const target = document.body;
        if (target === null) {
          return;
        }

        const observer = new MutationObserver(() => {
          const button = document.querySelector<HTMLDivElement>(
            "div[data-testid='tweetButton']"
          );
          if (button === null) {
            return;
          }

          const listener = () => {
            state.clicked = true;
            button.removeEventListener("click", listener);
          };

          button.addEventListener("click", listener);
          observer.disconnect();
        });

        observer.observe(target, { childList: true, subtree: true });

        break;
      }
      // background -> content -> background
      case Action.CloseTweetTab: {
        sendResponse({ close: state.clicked });

        break;
      }
      default: {
        // nothing to do
      }
    }
  }
);
