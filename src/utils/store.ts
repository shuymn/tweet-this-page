import { defineStore } from "pinia";
import { type Mode, type Options, type Theme, defaultOptions } from "./storage";

type State = Options & {
	initialized: boolean;
	error: unknown;
};

export const useOptionsStore = defineStore("options", {
	state: (): State => ({
		...defaultOptions,
		initialized: false,
		error: null,
	}),
	actions: {
		async initialize() {
			try {
				const options = await getOptions();
				this.mode = options.mode;
				this.prefixWord = options.prefixWord;
				this.enablePrefix = options.enablePrefix;
				this.enableAutoClose = options.enableAutoClose;
				this.theme = options.theme;
			} catch (error) {
				this.error = error;
			} finally {
				this.initialized = true;
			}
		},
		async updateMode(mode: Mode) {
			this.mode = mode;
			await setMode(mode);
		},
		async updateEnableAutoClose(enableAutoClose: boolean) {
			this.enableAutoClose = enableAutoClose;
			await setEnableAutoClose(enableAutoClose);
		},
		async updateEnablePrefix(enablePrefix: boolean) {
			this.enablePrefix = enablePrefix;
			await setEnablePrefix(enablePrefix);
		},
		async updatePrefixWord(prefixWord: string) {
			this.prefixWord = prefixWord;
			await setPrefixWord(prefixWord);
		},
		async updateTheme(theme: Theme) {
			this.theme = theme;
			await setTheme(theme);
		},
	},
});
