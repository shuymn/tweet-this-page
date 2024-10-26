import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	extensionApi: "chrome",
	modules: ["@wxt-dev/module-vue", "@wxt-dev/i18n/module"],
	srcDir: "src",
	outDir: "dist",
	manifest: {
		name: "__MSG_extName__",
		description: "__MSG_extDescription__",
		default_locale: "en",
		permissions: ["contextMenus", "webNavigation", "tabs", "storage"],
		host_permissions: [
			"https://x.com/intent/post?url=*",
			"https://x.com/intent/tweet?url=*",
			"https://twitter.com/intent/post?url=*",
			"https://twitter.com/intent/tweet?url=*",
		],
	},
});
