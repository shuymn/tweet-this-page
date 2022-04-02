export const Action = {
  GetOptions: "getOptions",
  SetMode: "setMode",
  SetPrefixWord: "setPrefixWord",
  SetEnablePrefix: "setEnablePrefix",
  SetEnableAutoClose: "setEnableAutoClose",
  ObserveTweetButton: "observeTweetButton",
  CloseTweetTab: "closeTweetTab",
} as const;
// eslint-disable-next-line no-redeclare
export type Action = typeof Action[keyof typeof Action];

export type Message = {
  action: Action;
  params?: Record<string, unknown>;
};

export const Mode = {
  Tab: "tab",
  Window: "window",
} as const;
// eslint-disable-next-line no-redeclare
export type Mode = typeof Mode[keyof typeof Mode];

export const MenuId = {
  TweetThisPage: "tweet-this-page",
} as const;
