module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				montserrat: 'Montserrat, sans-serif',
				'space-grotesk': "'Space Grotesk', sans-serif"
			},
			colors: {
				primary: '#ff92fa',
				'primary-dark': '#ff5af7',
				bg: '#1c1e26'
			}
		}
	},

	plugins: []
};
