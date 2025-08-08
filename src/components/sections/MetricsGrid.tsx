import React from 'react';

export default function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="placeholder flex h-32 items-center justify-center">총 생산량</div>
      <div className="placeholder flex h-32 items-center justify-center">균일도·군집도 그래프</div>
      <div className="placeholder flex h-32 items-center justify-center">기타 지표</div>
    </div>
  );
}
