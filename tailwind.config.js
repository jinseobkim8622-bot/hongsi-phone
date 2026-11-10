/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#EF4444',
          'red-dark': '#E12D2D',
          neon: '#1CF28D',
          roseBg: '#FFF5F5',
          dangerBg: '#FEF2F2',
          dangerBorder: '#F87171',
          bg: '#F8FAFC',
          control: '#F1F5F9',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

