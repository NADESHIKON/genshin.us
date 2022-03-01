module.exports = {
  darkMode: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./component/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Bai Jamjuree"]
      },
      colors: {

      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography')
  ],
  variants: {
    scrollbar: ['dark']
  }
}
