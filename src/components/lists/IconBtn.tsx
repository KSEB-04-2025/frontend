import React from 'react';

export default function IconBtn({
  title,
  onClick,
  children,
}: React.PropsWithChildren<{ title: string; onClick?: () => void }>) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="grid place-items-center h-[50px] w-[50px] rounded-lg border border-brand-border bg-box hover:bg-[#121a2b] transition"
    >
      {children}
    </button>
  );
}