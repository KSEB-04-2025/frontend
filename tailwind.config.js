/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
      Shadow: {
        side: "0px 8px 28px rgba(1, 5, 17, 0.3)",
      },
      brand: {
        labela: "#cb3cff",
        labelb: "#0038ff",
        defect: "#00c2ff",
        day: "#7F25FB",
        bg: "#081028",
        box: "#0B1739",
        Listsepar: "#1A1B2F",
        border: "#343B4F",
        nav: "#081028",
        button: "#cb3cff",
      },
      textColor: {
        heading: "#FFFFFF",
        sub: "#aeb9e1",
        gradea: "#14CA74",
        gradeb: "#FFCE20",
      },
    },
  },
  plugins: [],
};
