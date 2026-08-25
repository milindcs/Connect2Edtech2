/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#5E0ED7',
        pink: {
          DEFAULT: '#F0247A',
          light: '#FFE8F4',
        },
        'rich-black': '#0A0A0A',
        'gray-surface': '#FAFAFA',
        'gray-border': '#ECECEC',
        'gray-muted': '#8A8A8A',
        panel: '#F3F3F3',
        neu: '#ECECEC',
        'neu-dark-shadow': '#CBCBCB',
        'neu-light-shadow': '#FFFFFF',
      },
      boxShadow: {
        neu: '9px 9px 18px #cfcfcf, -9px -9px 18px #ffffff',
        'neu-sm': '6px 6px 12px #d1d1d1, -6px -6px 12px #ffffff',
        'neu-lg': '14px 14px 28px #c9c9c9, -14px -14px 28px #ffffff',
        'neu-inset': 'inset 6px 6px 12px #cfcfcf, inset -6px -6px 12px #ffffff',
        'neu-inset-sm': 'inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff',
        'neu-dark': '8px 8px 16px #000000, -8px -8px 16px #232323',
        'neu-dark-inset': 'inset 5px 5px 10px #000000, inset -5px -5px 10px #232323',
      },
      fontFamily: {
        sans: ['Michroma', 'sans-serif'],
        gilroy: ['Gilroy', 'sans-serif'],
        ui: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
