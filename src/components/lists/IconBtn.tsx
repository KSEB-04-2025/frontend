import React from 'react';

export default function IconBtn({
  title,
  onClick,
  children,
}: React.PropsWithChildren<{ title: string; onClick?: () => void }>) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="grid h-[50px] w-[50px] place-items-center rounded-lg border border-brand-border bg-box transition hover:bg-[#121a2b]"
    >
      {children}
    </button>
  );
}
