/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sanctuary: {
          bg: '#fbf9f5',
          card: '#ffffff',
          dark: '#1e2420',
          muted: '#7a827b',
          subtle: '#a4aca6',
          border: '#edeae3',
          green: '#2d5339',
          greenLight: '#e8efe9',
          greenHover: '#23422e',
          terracotta: '#b06c53',
          terracottaLight: '#faede8',
          gold: '#b5893d',
          goldLight: '#fbf4e6',
          sage: '#5a7c66',
          sageLight: '#ebf2ed',
          sky: '#4a7c8e',
          skyLight: '#eaf1f4',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'float': '0 10px 25px -5px rgba(45, 83, 57, 0.25)',
      }
    },
  },
  plugins: [],
}
