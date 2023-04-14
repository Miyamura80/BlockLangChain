/* @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./{pages,components}/**/*.{html,js,ts,tsx,jsx}", './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}