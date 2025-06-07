/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        floatAround: "floatAround 15s linear infinite",
      },
      keyframes: {
        floatAround: {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(100px, -50px) rotate(90deg)" },
          "50%": { transform: "translate(50px, -100px) rotate(180deg)" },
          "75%": { transform: "translate(-50px, -50px) rotate(270deg)" },
          "100%": { transform: "translate(0, 0) rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
