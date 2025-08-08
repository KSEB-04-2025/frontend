import React from 'react';

export default function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`rounded bg-white p-4 shadow ${className}`}>{children}</div>;
}
