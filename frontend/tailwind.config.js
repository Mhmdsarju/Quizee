export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "blue-quiz": "#211842",
        "quiz-main":"#E6CFA7",
        "quiz-admin":"#E6CFA7"
      },
      animation: {
        marquee: "marquee 18s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
  ],
};
