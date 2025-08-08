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
      },

      /* 네비게이션 구분 그림자 */
      boxShadow: {
        side: "0px 8px 28px rgba(1, 5, 17, 0.3)",
      },

      /* 각 품질별 등급색 */
      colors: {
        /* 브랜드 팔레트 */
        "brand-a": "#cb3cff",
        "brand-b": "#0038ff",
        defect: "#00c2ff",
        day: "#7F25FB",

        /* 배경색과 전반적인 박스색입니다. */
        bg: "#081028",
        box: "#0B1739",
        nav: "#081028",

        /* 리스트와 헬스체크 구분선입니다. 그리고 박스 테두리입니다. */
        "list-sep": "#1A1B2F",
        "brand-border": "#343B4F",

        /* 버튼색은 하나입니다. */
        button: "#cb3cff",

        /* 텍스트 색 입니다. */
        heading: "#FFFFFF",
        sub: "#aeb9e1",
        gradea: "#14CA74",
        gradeb: "#FFCE20",
      },
    },
  },
  plugins: [],
};
