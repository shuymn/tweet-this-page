import { sendMessage } from "@/utils/messaging";

const clickHandler = async (event: MouseEvent) => {
  const tweetButton = event.target as Element | null;
  if (tweetButton?.closest("[data-testid='tweetButton']")) {
    await sendMessage("closeTweetTab", undefined).catch((err) => {
      console.error(err);
      document.removeEventListener("click", clickHandler);
    });
  }
};

const keydownHandler = async (event: KeyboardEvent) => {
  const isMac = await sendMessage("isMac", undefined);
  const isCmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

  if (isCmdOrCtrl && event.key === "Enter") {
    const activeElement = document.activeElement;
    if (!activeElement) {
      return;
    }

    const isTweetInput =
      activeElement.matches('[data-testid="tweetTextarea_0"]') ||
      activeElement.closest('[role="textbox"]') !== null;

    if (isTweetInput) {
      await sendMessage("closeTweetTab", undefined).catch((err) => {
        console.error(err);
        document.removeEventListener("keydown", keydownHandler);
      });
    }
  }
};

export default defineContentScript({
  matches: [
    "https://x.com/intent/post?url=*",
    "https://x.com/intent/tweet?url=*",
    "https://twitter.com/intent/post?url=*",
    "https://twitter.com/intent/tweet?url=*",
  ],
  async main() {
    const currentValue = await getEnableAutoClose();
    const currentHref = location.href;

    watchEnableAutoClose((newValue) => {
      // If the current URL has changed, do nothing
      if (currentHref !== location.href) {
        return;
      }
      if (newValue !== currentValue) {
        location.reload();
      }
    });

    if (!currentValue) {
      return;
    }

    // watch submit by mouse click
    document.addEventListener("click", clickHandler);

    // watch submit by keyboard
    document.addEventListener("keydown", keydownHandler);
  },
});
