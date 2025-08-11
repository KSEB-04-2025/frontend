'use client';

import React from 'react';

export default function HeaderBar() {
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const day = ['일', '월', '화', '수', '목', '금', '토'];
  const time = now
    ? now.toLocaleTimeString('ko-KR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '';
  const date = now
    ? `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${day[now.getDay()]}`
    : '';

  return (
    <header className="flex h-16 items-center gap-10 border-b border-list-sep px-10">
      <span className="font-regular text-4xl tracking-wide text-heading" suppressHydrationWarning>
        {time}
      </span>
      <span className="text-4xl font-semibold tracking-wide text-sub" suppressHydrationWarning>
        {date}
      </span>
    </header>
  );
}
