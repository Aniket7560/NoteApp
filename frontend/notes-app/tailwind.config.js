/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // coors used in the project 
      colors : {
        primary : '#2B85ff',
        secondary : '#EF863E',
      }
    },
  },
  plugins: [],
}

