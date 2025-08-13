# ZEZE ONE 스마트 대시보드 프론트엔드

📍 AI 기반 결함 감지 및 품질 모니터링을 위한 ZEZE ONE 대시보드 프론트엔드 프로젝트입니다.

---

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router, Server Actions)
- **Styling**: Tailwind CSS, Custom Theme (brand / grayscale / semantic colors)
- **State Management**: Zustand
- **Data Visualization**: D3.js (`contourDensity`), Recharts
- **Font**: Pretendard, Pretendard Rounded
- **API 통신**: Axios (instance화, error 처리 포함)
- **환경**: Vercel, TypeScript, ESM 기반

---

## ✨ 주요 기능

| 기능 구분         | 설명                                          |
| ----------------- | --------------------------------------------- |
| **로그인 라우팅** | 로그인 페이지 및 인증 상태 분기 처리          |
| **생산량 요약**   | 일/주/월 단위 A/B 품질 생산 수량 카드         |
| **균일도 분석**   | KDE 기반 2D 히트맵 + 스캐터 시각화            |
| **클러스터 분석** | max cluster, uniformity, n_spots 등 특성 표시 |
| **데이터 리스트** | 전체 제품 목록 조회                           |
| **시간대 시계**   | 상단 시간/요일/날짜 실시간 표시               |
| **에러 핸들링**   | Axios 404, CORS 등 대응 로직 포함             |

---

## 🚀 실행 방법

```bash
# 1. 프로젝트 클론
git clone https://github.com/your-org/zezeone-dashboard.git

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 환경변수 (.env.local)
NEXT_PUBLIC_API_BASE_URL=https://api.zezeone-sf.site/api
```

---

## 📷 시각 자료

<img width="2560" height="1348" alt="스크린샷 2025-08-13 052327" src="https://github.com/user-attachments/assets/7958f2da-e5da-4c2d-97e9-303c8fe2af92" />
