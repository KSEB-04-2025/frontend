'use client'
import React, { useState } from "react";

export default function ChartSection() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">생산량 추이</h2>
        <div className="inline-flex border rounded overflow-hidden">
          {[
            { label: "일별", value: "day" },
            { label: "주별", value: "week" },
            { label: "월별", value: "month" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value as any)}
              className={`px-4 py-2 ${
                period === opt.value
                  ? "bg-brand-a text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="placeholder h-48 flex items-center justify-center">
        [차트 영역]
      </div>
    </div>
  );
}
