import type { Config } from "tailwindcss";

export default {
	// Tailwind v4: pas besoin de `content`, ni de plugins ici
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
} satisfies Config;
