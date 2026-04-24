/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // green (trust)
          dark: '#059669',
        },
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6'
        },
        dark: {
          900: '#0B1120',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
