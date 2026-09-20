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
          dark: '#141a16',
          text: '#1a221d',
          muted: '#68726a',
          subtle: '#949e96',
          border: '#e8e4dc',
          borderStrong: '#ded8ce',
          green: '#234a31',
          greenDark: '#173623',
          greenLight: '#e4efe7',
          greenHover: '#1c3e29',
          terracotta: '#a85b42',
          gold: '#b88228',
          sage: '#4e735b',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(28, 40, 32, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 8px 30px -4px rgba(28, 40, 32, 0.09), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'float-green': '0 10px 30px -5px rgba(35, 74, 49, 0.35)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
