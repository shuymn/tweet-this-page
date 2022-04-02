import { h, render } from "preact";
import { Popup } from "./components/Popup";
import { Action, Message } from "./lib/utils";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (app === null) {
    throw new Error('the element named "app" is not found');
  }

  const message: Message = { action: Action.GetOptions };
  chrome.runtime.sendMessage(message, ({ data: options }) => {
    render(<Popup options={options} />, app);
  });
});
