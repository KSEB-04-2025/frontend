"use client";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* 1) 헤더 영역 */}
      <header className="placeholder h-16 flex items-center justify-center">
        HEADER (오늘 날짜 · 시간)
      </header>

      {/* 2) 상단 카드 그리드: 모바일 1열, md 이상 3열 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="placeholder h-32 flex items-center justify-center">
          총 생산량
        </div>
        <div className="placeholder h-32 flex items-center justify-center">
          균일도·군집도 그래프
        </div>
        <div className="placeholder h-32 flex items-center justify-center">
          기타 지표
        </div>
      </section>

      {/* 3) 생산량 추이 카드 (토글 + 차트) */}
      <section className="placeholder p-4 space-y-4">
        <div className="h-10 placeholder flex items-center justify-center">
          [기간 토글: 일/주/월]
        </div>
        <div className="h-48 placeholder flex items-center justify-center">
          생산량 시계열 차트
        </div>
      </section>

      {/* 4) 리스트 영역 */}
      <section className="placeholder p-4">
        <h2 className="mb-2 font-medium">이벤트 리스트</h2>
        <div className="space-y-2">
          <div className="placeholder h-12 flex items-center px-4">
            리스트 아이템 1
          </div>
          <div className="placeholder h-12 flex items-center px-4">
            리스트 아이템 2
          </div>
          {/* … */}
        </div>
      </section>
    </div>
  );
}
