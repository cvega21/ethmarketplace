const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        indigo: '0 4px 14px 0 rgba(0, 78, 255, 0.27)',
        indigoDark: '0 0px 20px 0 rgba(99, 89, 224, 0.4)',
      },
      width: {
        '200': '200px'
      }
    },
    fontFamily: {
      'dramatic': ['Gemunu Libre', ...defaultTheme.fontFamily.sans],
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      textColor: ['group-focus'],
    },
  },
  plugins: [],
}
