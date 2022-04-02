import { getBoolean, getValue } from "../lib/storage";
import { Action, Message, Mode } from "../lib/utils";

export type Options = {
  mode: Mode;
  prefixWord: string;
  enablePrefix: boolean;
  enableAutoClose: boolean;
  windowWidth: number;
  windowHeight: number;
};

export const getOptions = (): Options => {
  return {
    mode: getValue("mode", Mode.Tab) as Mode,
    prefixWord: getValue("prefix_word", "NowBrowsing: ") as string,
    enablePrefix: getBoolean("enable_prefix", true),
    enableAutoClose: getBoolean("enable_auto_close", false),
    windowWidth: getValue("window_width", 650) as number,
    windowHeight: getValue("window_height", 800) as number,
  };
};

export const setMode = (mode: Mode): void => {
  const message: Message = { action: Action.SetMode, params: { mode } };
  chrome.runtime.sendMessage(message);
};

export const setPrefixWord = (prefix: string): void => {
  const message: Message = { action: Action.SetPrefixWord, params: { prefix } };
  chrome.runtime.sendMessage(message);
};

export const setEnablePrefix = (enable: boolean): void => {
  const message: Message = {
    action: Action.SetEnablePrefix,
    params: { enable },
  };
  chrome.runtime.sendMessage(message);
};

export const setEnableAutoClose = (enable: boolean): void => {
  const message: Message = {
    action: Action.SetEnableAutoClose,
    params: { enable },
  };
  chrome.runtime.sendMessage(message);
};
