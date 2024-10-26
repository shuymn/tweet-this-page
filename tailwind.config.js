/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/entrypoints/**", "./src/components/**"],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
};
