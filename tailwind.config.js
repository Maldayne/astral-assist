/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/@headlessui/vue/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [],
}
