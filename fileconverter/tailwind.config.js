/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],  
  theme: {
    colors: {
      'primary': '#430f58',
      'secondary': '#6643b5',
      'tertiary': '#8594e4',
      'quaternary': '#d5def5',
      'black': '#000',
      'white': '#fff',

    },
    extend: {},
  },
  plugins: [],
}

