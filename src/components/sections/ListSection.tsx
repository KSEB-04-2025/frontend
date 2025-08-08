import React from 'react';

export default function ListSection() {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">이벤트 리스트</h2>
      <ul className="space-y-2">
        <li className="placeholder flex h-12 items-center px-4">리스트 아이템 1</li>
        <li className="placeholder flex h-12 items-center px-4">리스트 아이템 2</li>
      </ul>
    </div>
  );
}
