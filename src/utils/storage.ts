import { storage } from "wxt/storage";

export const Mode = {
	Tab: "tab",
	Window: "window",
} as const;
export type Mode = (typeof Mode)[keyof typeof Mode];

export const Theme = {
	System: "system",
	Light: "light",
	Dark: "dark",
} as const;
export type Theme = (typeof Theme)[keyof typeof Theme];

export type Options = {
	mode: Mode;
	prefixWord: string;
	enablePrefix: boolean;
	enableAutoClose: boolean;
	windowWidth: number;
	windowHeight: number;
	theme: Theme;
};

export const defaultOptions: Options = {
	mode: Mode.Tab,
	prefixWord: "NowBrowsing: ",
	enablePrefix: true,
	enableAutoClose: false,
	windowWidth: 650,
	windowHeight: 800,
	theme: Theme.System,
};

const keys = {
	mode: "local:mode",
	prefixWord: "local:prefix_word",
	enablePrefix: "local:enable_prefix",
	enableAutoClose: "local:enable_auto_close",
	windowWidth: "local:window_width",
	windowHeight: "local:window_height",
	theme: "local:theme",
} as const;

export async function getOptions(): Promise<Options> {
	return {
		mode: await storage.getItem<Mode>(keys.mode, {
			fallback: defaultOptions.mode,
		}),
		prefixWord: await storage.getItem<string>(keys.prefixWord, {
			fallback: defaultOptions.prefixWord,
		}),
		enablePrefix: await storage.getItem<boolean>(keys.enablePrefix, {
			fallback: defaultOptions.enablePrefix,
		}),
		enableAutoClose: await storage.getItem<boolean>(keys.enableAutoClose, {
			fallback: defaultOptions.enableAutoClose,
		}),
		windowWidth: await storage.getItem<number>(keys.windowWidth, {
			fallback: defaultOptions.windowWidth,
		}),
		windowHeight: await storage.getItem<number>(keys.windowHeight, {
			fallback: defaultOptions.windowHeight,
		}),
		theme: await storage.getItem<Theme>(keys.theme, {
			fallback: defaultOptions.theme,
		}),
	};
}

export async function getEnableAutoClose(): Promise<boolean> {
	return await storage.getItem<boolean>(keys.enableAutoClose, {
		fallback: defaultOptions.enableAutoClose,
	});
}

export function watchEnableAutoClose(callback: (newValue: boolean) => void) {
	storage.watch<boolean>(keys.enableAutoClose, (newValue) => {
		if (newValue !== null) {
			callback(newValue);
		}
	});
}

export async function setMode(mode: Mode) {
	await storage.setItem(keys.mode, mode);
}

export async function setPrefixWord(prefix: string) {
	await storage.setItem(keys.prefixWord, prefix);
}

export async function setEnablePrefix(enable: boolean) {
	await storage.setItem(keys.enablePrefix, enable);
}

export async function setEnableAutoClose(enable: boolean) {
	await storage.setItem(keys.enableAutoClose, enable);
}

export async function setTheme(theme: Theme) {
	await storage.setItem(keys.theme, theme);
}
