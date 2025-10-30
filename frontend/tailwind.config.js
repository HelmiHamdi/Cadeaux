/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1F4D3E",
        secondary: "#2E6653",
        accent: "#C5A762",
        bg: "#F7F3ED",
        white: "#FFFFFF",
        text: "#1E1E1E",
        "text-light": "#707070",
      },
      fontFamily: {
        main: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        xl: "10px",
      },
    },
  },
  plugins: [],
}
