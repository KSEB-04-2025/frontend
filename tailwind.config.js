/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
        "dm-sans": ["DM Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        side: "0px 8px 28px rgba(1, 5, 17, 0.3)",
      },
      colors: {
        "brand-a": "#cb3cff",
        "brand-b": "#0038ff",
        defect: "#00c2ff",
        day: "#7F25FB",
        bg: "#081028",
        box: "#0B1739",
        nav: "#081028",
        "list-sep": "#1A1B2F",
        "brand-border": "#343B4F",
        button: "#cb3cff",
        heading: "#FFFFFF",
        sub: "#aeb9e1",
        gradea: "#14CA74",
        gradeb: "#FFCE20",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
