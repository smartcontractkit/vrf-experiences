/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif']
			},
		}
	},
	daisyui: {
		themes: [
			{
				mytheme: {

					primary: "#00ff93",
					secondary: "#2163ff",
					accent: "#ffffff",
					neutral: "#1c1c1c",
					'base-100': "#1c1c1c",
					info: "#3ABFF8",
					success: "#ff5e57",
					warning: "#FBBD23",
					error: "#F87272",
				},
			}
		]
	},
	plugins: [require('daisyui')]
};
