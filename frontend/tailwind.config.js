/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#ffffff',
          sidebar: '#f7f6f3',
          border: '#e9e9e8',
          hover: '#f1f1ef',
          text: '#37352f',
          muted: '#787774',
          subtle: '#9b9a97',
          blue: '#0c66e4',
          blueBg: '#e8f3ff',
          green: '#1f845a',
          greenBg: '#e6f6ee',
          grayBg: '#f1f1ef',
          grayText: '#5a5a58',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
