import { createApp } from "vue";
import { createPinia } from "pinia";
import "~/assets/tailwind.css";
import App from "./App.vue";

(async () => {
	const pinia = createPinia();
	const store = useOptionsStore(pinia);
	await store.initialize();

	const app = createApp(App);
	app.use(pinia);
	app.mount("#app");
})();
