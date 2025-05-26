/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.css"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Be Vietnam Pro', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("@catppuccin/tailwindcss")({
      defaultFlavour: "latte",
    }),
  ],
  darkMode: "class", // Enable dark mode based on class
}
